
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: Array<UserRole>;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, userProfile, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // We consider authentication check complete when:
    // 1. Auth state loading is done (isLoading === false)
    // 2. AND we either have no user OR we have a user AND their profile
    if (!isLoading && (!user || (user && userProfile))) {
      setIsChecking(false);
    }
  }, [user, userProfile, isLoading]);

  // Show loading spinner while checking auth state
  if (isChecking || isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If allowedRoles is provided, check if the user has the required role
  if (allowedRoles && userProfile && userProfile.role && !allowedRoles.includes(userProfile.role)) {
    // Special case for debugger - allow access to all routes regardless of role restrictions
    if (userProfile.role === "debugger") {
      return <Outlet />;
    }
    
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">アクセス権限がありません</h2>
          <p className="text-red-600 mb-4">
            このページにアクセスするには、必要な権限が不足しています。
          </p>
          <p className="text-sm text-gray-600">
            現在のロール: {userProfile.role}
            <br />
            必要なロール: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role, allow access
  return <Outlet />;
};

export default ProtectedRoute;
