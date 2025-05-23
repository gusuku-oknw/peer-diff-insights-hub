
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { userProfile, updateUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "business" | "debugger">("student");

  // Set the default tab based on user role when the component mounts or userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.role) {
      if (userProfile.role === "student" || userProfile.role === "business" || userProfile.role === "debugger") {
        setActiveTab(userProfile.role);
      }
    }
  }, [userProfile]);

  const handleRoleChange = (value: string) => {
    if (!value) return; // Don't proceed if no value (happens when clicking active item)
    
    const role = value as "student" | "business";
    setActiveTab(role);
    
    // If the user has switched to a different role, update their profile
    if (userProfile && userProfile.role !== role) {
      updateUserRole(role);
      toast(`${role === 'student' ? '学生' : '企業'}ビューに切り替えました`, {
        icon: role === 'student' ? <GraduationCap className="h-5 w-5" /> : 
              <Building className="h-5 w-5" />
      });
    }
  };

  const isDebugger = userProfile?.role === 'debugger';
  
  // For debugger display mode - determine which role to show in the UI
  const displayRole = isDebugger ? activeTab : (userProfile?.role as "student" | "business");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <div className="flex-grow pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Debugger Role Switcher */}
          {isDebugger && (
            <div className="my-4 flex justify-center">
              <Card className="w-full max-w-md border border-red-100 bg-red-50/40">
                <CardContent className="pt-4 pb-2">
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium text-red-700">デバッグモード: 表示を切り替える</p>
                  </div>
                  <ToggleGroup 
                    type="single" 
                    value={displayRole} 
                    onValueChange={handleRoleChange}
                    className="justify-center"
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
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{displayRole === 'student' ? '学生ダッシュボード' : '企業ダッシュボード'}</h1>
          </div>

          <Tabs value={displayRole} className="w-full">
            <TabsContent value="student" className="animate-fade-in focus:outline-none p-0 mt-0">
              <StudentDashboard />
            </TabsContent>
            <TabsContent value="business" className="animate-fade-in focus:outline-none p-0 mt-0">
              <BusinessDashboard />
            </TabsContent>
            {activeTab === "debugger" && (
              <div className="p-8 bg-white rounded-xl border border-gray-200">
                <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-red-800 mb-2">デバッガーモード</h3>
                  <p className="text-red-700 text-sm">
                    現在のユーザープロファイル情報:
                  </p>
                  <pre className="bg-white p-3 mt-2 rounded border text-xs overflow-auto">
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Tabs>

          <div className="mt-6 flex justify-center">
            <Link to="/slides">
              <Button className="gradient-primary shadow-md hover:shadow-lg">
                <FileText className="mr-2 h-5 w-5" />
                スライドビューアを開く
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
