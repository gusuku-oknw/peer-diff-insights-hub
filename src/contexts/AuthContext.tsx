
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserRole = "student" | "business" | "debugger";

interface UserProfile {
  id: string;
  role: UserRole;
  display_name?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data fetching using setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, display_name")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("プロフィール情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem("supabase.auth.token");
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Try to sign out globally in case there's an existing session
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("ログインしました");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, displayName: string) => {
    setIsLoading(true);
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
            role: role
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("アカウントが作成されました");
        navigate("/auth", { state: { message: "メールアドレスを確認してください" } });
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: "global" });
      
      // Reset state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      toast.success("ログアウトしました");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("ログアウトに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, role } : null);
      toast.success("ユーザーロールを更新しました");
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error("ユーザーロールの更新に失敗しました");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
