
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile, signOut, isLoading } = useAuth();
  
  const isSlideViewerRoute = location.pathname === "/slides";
  const isDashboardRoute = location.pathname === "/dashboard";
  const isAuthRoute = location.pathname === "/auth";
  
  // Don't show navigation on auth pages
  if (isAuthRoute) return null;
  
  const userDisplayName = userProfile?.display_name || user?.email?.split('@')[0] || 'User';
  const userRole = userProfile?.role || 'guest';
  
  const UserAvatar = () => (
    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
      {userDisplayName.charAt(0).toUpperCase()}
    </div>
  );
  
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="font-bold gradient-primary bg-clip-text text-transparent text-2xl">
                  PeerDiffX
                </h1>
              </Link>
            </div>
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
              {isSlideViewerRoute && (
                <Link to="/dashboard">
                  <Button className="gradient-primary text-white hover:opacity-90">
                    ダッシュボードに戻る
                  </Button>
                </Link>
              )}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-0 h-8 w-8">
                      <UserAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">{userDisplayName}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs px-2 py-1 rounded-sm">
                      ロール: <span className="ml-1 font-medium capitalize">{userRole}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
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
              {isSlideViewerRoute && (
                <Link to="/dashboard">
                  <Button className="w-full gradient-primary text-white">
                    ダッシュボードに戻る
                  </Button>
                </Link>
              )}
              
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <UserAvatar />
                    <div>
                      <p className="font-medium text-gray-800">{userDisplayName}</p>
                      <p className="text-xs text-gray-500">ロール: {userRole}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200"
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
