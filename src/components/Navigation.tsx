
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserCircle, Shield, GraduationCap, Building, ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile, signOut, isLoading, updateUserRole } = useAuth();
  
  const isSlideViewerRoute = location.pathname === "/slides";
  const isDashboardRoute = location.pathname === "/dashboard";
  const isAuthRoute = location.pathname === "/auth";
  
  // Don't show navigation on auth pages
  if (isAuthRoute) return null;
  
  const userDisplayName = userProfile?.display_name || user?.email?.split('@')[0] || 'User';
  const userRole = userProfile?.role || 'guest';
  const isDebugger = userRole === 'debugger';

  // For debugger display mode - determine which role to show in the UI
  const displayRole = isDebugger ? ('student' as const) : userRole;

  const handleRoleChange = (value: string) => {
    if (value !== userRole && (value === 'student' || value === 'business')) {
      // For debuggers, we don't want to actually update the role in the database
      // Just show a toast notification for the UI change
      if (isDebugger) {
        toast.success(`ロールを ${value === 'student' ? '学生' : '企業'} に切り替えました`);
      } else {
        updateUserRole(value as 'student' | 'business');
      }
    }
  };
  
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'student': return 'bg-blue-600';
      case 'business': return 'bg-purple-600';
      case 'debugger': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'student': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">学生</Badge>;
      case 'business': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">企業</Badge>;
      case 'debugger': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">デバッガー</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">ゲスト</Badge>;
    }
  };
  
  const UserAvatar = () => (
    <Avatar className={`h-8 w-8 ${getRoleColor(userRole)} text-white`}>
      <AvatarFallback>
        {userDisplayName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="font-bold gradient-primary bg-clip-text text-transparent text-2xl">
                  PeerDiffX
                </h1>
              </Link>
            </div>
            
            {/* Slide Viewer Project Info and Back Button */}
            {isSlideViewerRoute && (
              <>
                <div className="h-6 w-px bg-gray-300" />
                <Link to="/dashboard">
                  <Button className="gradient-primary text-white hover:opacity-90 flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">ダッシュボードに戻る</span>
                    <span className="sm:hidden">戻る</span>
                  </Button>
                </Link>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">サンプルプレゼンテーション</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    プレゼンテーションモード
                  </Badge>
                </div>
              </>
            )}
          </div>
          
          {!isSlideViewerRoute && !isDashboardRoute && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                  機能
                </a>
                <a href="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  料金
                </a>
                <Link to="/demo" className="text-gray-700 hover:text-blue-600 transition-colors">
                  デモ
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  ダッシュボード
                </Link>
                <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  について
                </a>
              </div>
            </div>
          )}
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-0 h-8 w-8 hover:bg-gray-100">
                      {isDebugger && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                      <UserAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{userDisplayName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                        {getRoleBadge(userRole)}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {isDebugger && (
                      <>
                        <div className="px-2 py-1.5">
                          <p className="text-xs font-medium text-muted-foreground mb-2">ロールを切り替える</p>
                          <DropdownMenuRadioGroup 
                            value={displayRole} 
                            onValueChange={handleRoleChange}
                          >
                            <DropdownMenuRadioItem value="student" className="cursor-pointer">
                              <GraduationCap className="mr-2 h-4 w-4" />
                              <span>学生として表示</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="business" className="cursor-pointer">
                              <Building className="mr-2 h-4 w-4" />
                              <span>企業として表示</span>
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="bg-red-50 text-red-600">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>デバッグモード有効</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <Link to="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <span>ダッシュボード</span>
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>ログアウト</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="text-gray-700">
                      ログイン
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="gradient-primary text-white hover:opacity-90">
                      無料で始める
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {isSlideViewerRoute && (
              <Link to="/dashboard">
                <Button className="w-full gradient-primary text-white mb-3">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  ダッシュボードに戻る
                </Button>
              </Link>
            )}
            
            {!isSlideViewerRoute && !isDashboardRoute && (
              <>
                <a href="#features" className="block px-3 py-2 text-gray-700">
                  機能
                </a>
                <a href="#pricing" className="block px-3 py-2 text-gray-700">
                  料金
                </a>
                <Link to="/demo" className="block px-3 py-2 text-gray-700">
                  デモ
                </Link>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700">
                  ダッシュボード
                </Link>
                <a href="#about" className="block px-3 py-2 text-gray-700">
                  について
                </a>
              </>
            )}
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserAvatar />
                      <div>
                        <p className="font-medium text-gray-800">{userDisplayName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {getRoleBadge(userRole)}
                  </div>
                  
                  {isDebugger && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs font-medium text-red-800 mb-2">デバッグモード: ロールを切り替える</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant={displayRole === 'student' ? 'default' : 'outline'} 
                          className={displayRole === 'student' ? 'bg-blue-600 hover:bg-blue-700' : ''} 
                          onClick={() => handleRoleChange('student')}
                        >
                          <GraduationCap className="mr-1 h-4 w-4" />
                          学生として表示
                        </Button>
                        <Button 
                          size="sm" 
                          variant={displayRole === 'business' ? 'default' : 'outline'}
                          className={displayRole === 'business' ? 'bg-purple-600 hover:bg-purple-700' : ''} 
                          onClick={() => handleRoleChange('business')}
                        >
                          <Building className="mr-1 h-4 w-4" />
                          企業として表示
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      ダッシュボード
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="w-full justify-start">
                      ログイン
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="w-full gradient-primary text-white">
                      無料で始める
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>}
    </nav>;
};

export default Navigation;
