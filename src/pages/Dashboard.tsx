
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, Building, Shield } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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

  const handleTabChange = (value: string) => {
    const role = value as "student" | "business" | "debugger";
    setActiveTab(role);
    
    // If the user has switched to a different role, update their profile
    if (userProfile && userProfile.role !== role) {
      updateUserRole(role);
      toast(`${role === 'student' ? '学生' : role === 'business' ? '企業' : 'デバッガー'}ビューに切り替えました`, {
        icon: role === 'student' ? <GraduationCap className="h-5 w-5" /> : 
              role === 'business' ? <Building className="h-5 w-5" /> : 
              <Shield className="h-5 w-5" />
      });
    }
  };

  const isDebugger = userProfile?.role === 'debugger';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/50">
      <Navigation />
      <div className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="inline-block mb-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
              PeerDiffX ダッシュボード
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ダッシュボード
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              あなたのレビュー状況とタスクを管理し、効率的にコラボレーションできます
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to="/slides">
                <Button className="gradient-primary shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 duration-200 px-6">
                  <FileText className="mr-2 h-5 w-5" />
                  スライドビューを開く
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <Tabs 
              value={activeTab} 
              className="w-full max-w-4xl"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 p-1.5 bg-blue-50/80 rounded-xl shadow-sm border border-blue-100">
                <TabsTrigger 
                  value="student"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 flex items-center justify-center gap-2"
                >
                  <GraduationCap className="h-5 w-5" />
                  学生ビュー
                  {userProfile?.role === 'student' && !isDebugger && (
                    <Badge className="bg-blue-100 text-blue-800 ml-1">現在</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="business"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 flex items-center justify-center gap-2"
                >
                  <Building className="h-5 w-5" />
                  企業ビュー
                  {userProfile?.role === 'business' && !isDebugger && (
                    <Badge className="bg-purple-100 text-purple-800 ml-1">現在</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="debugger"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-red-500 flex items-center justify-center gap-2"
                  disabled={!isDebugger}
                >
                  <Shield className="h-5 w-5" />
                  デバッガー
                  {isDebugger && (
                    <Badge className="bg-red-100 text-red-800 ml-1 animate-pulse">有効</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
                <TabsContent value="student" className="animate-fade-in focus:outline-none p-0">
                  <StudentDashboard />
                </TabsContent>
                <TabsContent value="business" className="animate-fade-in focus:outline-none p-0">
                  <BusinessDashboard />
                </TabsContent>
                <TabsContent value="debugger" className="animate-fade-in focus:outline-none p-0">
                  <div className="p-8">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
                      <h3 className="font-medium text-red-800 mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        デバッガーモード
                      </h3>
                      <p className="text-red-700 text-sm">
                        このモードでは、アプリケーションのデバッグ情報を確認できます。
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="bg-white rounded-lg p-2 border border-red-200 flex items-center text-sm">
                          <span className="text-gray-600 mr-1">現在のロール表示:</span>
                          <Badge className={activeTab === 'student' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                            {activeTab === 'student' ? '学生' : '企業'}
                          </Badge>
                        </div>
                        <p className="text-xs text-red-600">
                          ※ドロップダウンメニューからもロールを切り替え可能
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border overflow-auto">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ユーザープロファイル:</h4>
                      <pre className="bg-white p-3 rounded border text-xs overflow-auto">
                        {JSON.stringify(userProfile, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
