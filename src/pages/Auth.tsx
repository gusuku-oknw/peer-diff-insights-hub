
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation, Navigate, Link } from "react-router-dom";
import { AlertCircle, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"student" | "business" | "debugger">("student");
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const location = useLocation();
  const message = location.state?.message || "";

  // If already authenticated, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, role, displayName);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/">
            <h1 className="font-bold gradient-primary bg-clip-text text-transparent text-3xl mb-2">
              PeerDiffX
            </h1>
          </Link>
          <p className="text-gray-600">スライドレビューが変わる、新しい体験</p>
        </div>

        {message && (
          <Alert className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {authMode === "sign-in" ? "ログイン" : "新規登録"}
            </CardTitle>
            <CardDescription className="text-center">
              {authMode === "sign-in" 
                ? "アカウント情報を入力してください" 
                : "新しいアカウントを作成します"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "sign-in" | "sign-up")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="sign-in" className="text-base">
                  <LogIn className="mr-2 h-4 w-4" /> ログイン
                </TabsTrigger>
                <TabsTrigger value="sign-up" className="text-base">
                  <UserPlus className="mr-2 h-4 w-4" /> 新規登録
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">パスワード</Label>
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        パスワードをお忘れですか？
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        ログイン中...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" /> 
                        ログイン
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="sign-up">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">表示名</Label>
                    <Input 
                      id="display-name" 
                      placeholder="名前" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">メールアドレス</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">パスワード</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>アカウントタイプ</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as "student" | "business" | "debugger")}>
                      <div className="flex items-center space-x-2 rounded-md border p-3 mb-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="flex-1">学生</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 mb-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="flex-1">企業</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="debugger" id="debugger" />
                        <Label htmlFor="debugger" className="flex-1">デバッガー</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        登録中...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" /> 
                        アカウント作成
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-sm text-center text-gray-500">
              アカウントをお持ちでない場合は「新規登録」タブを選択してください
            </div>
            <div className="flex justify-center">
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                ホームページに戻る
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
