
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, Building, Plus, ArrowRight, RefreshCw, Eye, Pencil, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "business">("student");
  const [isLoading, setIsLoading] = useState(false);

  // Set the default tab based on user role when the component mounts or userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.role) {
      if (userProfile.role === "student" || userProfile.role === "business") {
        setActiveTab(userProfile.role);
      } else if (userProfile.role === "debugger") {
        setActiveTab("student"); // Default to student view for debuggers
      }
    }
  }, [userProfile]);

  const handleRoleChange = (value: string) => {
    if (!value) return; // Don't proceed if no value (happens when clicking active item)
    
    const role = value as "student" | "business";
    setActiveTab(role);
    
    // Show refreshing animation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show toast notification for debuggers when switching views
      if (userProfile?.role === "debugger") {
        toast(`${role === 'student' ? '学生' : '企業'}ビューに切り替えました`, {
          icon: role === 'student' ? <GraduationCap className="h-5 w-5" /> : 
                <Building className="h-5 w-5" />
        });
      }
    }, 300);
  };

  const isDebugger = userProfile?.role === 'debugger';
  
  // For debugger display mode - determine which role to show in the UI
  const displayRole = isDebugger ? activeTab : (userProfile?.role as "student" | "business");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-grow pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{displayRole === 'student' ? '学生ダッシュボード' : '企業ダッシュボード'}</h1>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  更新する
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gradient-primary shadow-sm hover:shadow">
                      <FileText className="mr-2 h-5 w-5" />
                      スライドビューアを開く
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <Link to="/slides?mode=presentation">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>プレゼンテーションモード</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/slides?mode=edit">
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>編集モード</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/slides?mode=review">
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>レビューモード</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Role description */}
            <p className="text-gray-600 mt-2">
              {displayRole === 'student' 
                ? 'レビューを行うプロジェクトの確認、コメントの追加や管理ができます。' 
                : 'プレゼンテーションの作成、管理、共有が行えます。'}
            </p>
          </div>

          {/* Debugger Role Switcher */}
          {isDebugger && (
            <div className="mb-6 flex justify-start">
              <Card className="w-full max-w-md border border-red-100 bg-red-50/40">
                <CardContent className="pt-4 pb-2">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-red-700">デバッグモード: 表示を切り替える</p>
                  </div>
                  <ToggleGroup 
                    type="single" 
                    value={activeTab} 
                    onValueChange={handleRoleChange}
                  >
                    <ToggleGroupItem value="student" className="px-4 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>学生ビュー</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="business" className="px-4 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700">
                      <Building className="mr-2 h-4 w-4" />
                      <span>企業ビュー</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Dashboard Content */}
          <Tabs value={displayRole} className="w-full">
            <TabsContent value="student" className="animate-fade-in focus:outline-none p-0 mt-0">
              <StudentDashboard />
            </TabsContent>
            <TabsContent value="business" className="animate-fade-in focus:outline-none p-0 mt-0">
              <BusinessDashboard />
            </TabsContent>
          </Tabs>

          {/* Bottom action */}
          <div className="mt-8 flex justify-center">
            <Button className="text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {displayRole === 'student' ? 'レビュー枠を追加する' : '新しいプロジェクトを作成する'}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
