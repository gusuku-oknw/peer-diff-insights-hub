
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserCircle, Shield, GraduationCap, Building, ArrowLeft, FileText, Presentation } from "lucide-react";
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
      case 'student': return 'bg-blue-500';
      case 'business': return 'bg-purple-500';
      case 'debugger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'student': return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 text-xs font-medium">学生</Badge>;
      case 'business': return <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 text-xs font-medium">企業</Badge>;
      case 'debugger': return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-xs font-medium">デバッガー</Badge>;
      default: return <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 text-xs font-medium">ゲスト</Badge>;
    }
  };
  
  const UserAvatar = ({ size = "default" }: { size?: "default" | "sm" }) => (
    <Avatar className={`${size === "sm" ? "h-7 w-7" : "h-8 w-8"} ${getRoleColor(userRole)} text-white border-2 border-white shadow-sm`}>
      <AvatarFallback className="text-white font-semibold">
        {userDisplayName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PeerDiffX
                </h1>
              </Link>
            </div>
            
            {/* Slide Viewer specific navigation */}
            {isSlideViewerRoute && (
              <>
                <div className="h-5 w-px bg-gray-300 hidden sm:block" />
                <Link to="/dashboard" className="hidden sm:block">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>ダッシュボード</span>
                  </Button>
                </Link>
                
                {/* Project info - desktop only */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="h-5 w-px bg-gray-300" />
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">サンプルプレゼンテーション</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center space-x-1">
                    <Presentation className="h-3 w-3" />
                    <span>プレゼンテーション</span>
                  </Badge>
                </div>
                
                {/* Mobile back button */}
                <Link to="/dashboard" className="sm:hidden">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>戻る</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Center navigation - only for non-slide viewer pages */}
          {!isSlideViewerRoute && !isDashboardRoute && (
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                <a href="/#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  機能
                </a>
                <a href="/#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  料金
                </a>
                <Link to="/demo" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  デモ
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  ダッシュボード
                </Link>
                <a href="/#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  について
                </a>
              </div>
            </div>
          )}
          
          {/* Right section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* User info - desktop */}
                <div className="hidden md:flex items-center space-x-2">
                  {getRoleBadge(userRole)}
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative rounded-full p-0 h-9 w-9 hover:bg-gray-100 transition-colors"
                    >
                      {isDebugger && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                      <UserAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuLabel>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserAvatar size="sm" />
                          <div>
                            <div className="font-medium text-gray-900">{userDisplayName}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        {getRoleBadge(userRole)}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {isDebugger && (
                      <>
                        <div className="px-2 py-1.5">
                          <p className="text-xs font-medium text-gray-600 mb-2">デバッグ: ロール切り替え</p>
                          <DropdownMenuRadioGroup 
                            value={displayRole} 
                            onValueChange={handleRoleChange}
                          >
                            <DropdownMenuRadioItem value="student" className="cursor-pointer">
                              <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                              <span>学生として表示</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="business" className="cursor-pointer">
                              <Building className="mr-2 h-4 w-4 text-purple-600" />
                              <span>企業として表示</span>
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="bg-red-50 text-red-700 hover:bg-red-100">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>デバッグモード有効</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <Link to="/dashboard">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                        <span>ダッシュボード</span>
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuItem 
                      onClick={() => signOut()} 
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>ログアウト</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
                    ログイン
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm">
                    無料で始める
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-3 pt-3 pb-4 space-y-3">
            {/* Slide viewer mobile back button */}
            {isSlideViewerRoute && (
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white justify-start">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  ダッシュボードに戻る
                </Button>
              </Link>
            )}
            
            {/* Mobile project info for slide viewer */}
            {isSlideViewerRoute && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">サンプルプレゼンテーション</span>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  プレゼンテーションモード
                </Badge>
              </div>
            )}
            
            {/* Regular navigation for non-slide viewer pages */}
            {!isSlideViewerRoute && !isDashboardRoute && (
              <div className="space-y-2">
                <a href="/#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  機能
                </a>
                <a href="/#pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  料金
                </a>
                <Link to="/demo" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  デモ
                </Link>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  ダッシュボード
                </Link>
                <a href="/#about" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  について
                </a>
              </div>
            )}
            
            {/* User section */}
            {user ? (
              <div className="pt-3 space-y-3 border-t border-gray-200">
                {/* User info card */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <UserAvatar />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{userDisplayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {getRoleBadge(userRole)}
                </div>
                
                {/* Debug controls */}
                {isDebugger && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-medium text-red-800 mb-3 flex items-center">
                      <Shield className="mr-1 h-3 w-3" />
                      デバッグモード: ロール切り替え
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant={displayRole === 'student' ? 'default' : 'outline'} 
                        className={displayRole === 'student' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50'} 
                        onClick={() => handleRoleChange('student')}
                      >
                        <GraduationCap className="mr-1 h-3 w-3" />
                        学生
                      </Button>
                      <Button 
                        size="sm" 
                        variant={displayRole === 'business' ? 'default' : 'outline'}
                        className={displayRole === 'business' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'hover:bg-purple-50'} 
                        onClick={() => handleRoleChange('business')}
                      >
                        <Building className="mr-1 h-3 w-3" />
                        企業
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="space-y-2">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                      ダッシュボード
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-3 space-y-2 border-t border-gray-200">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    ログイン
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    無料で始める
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
