
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, Building, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { userProfile, updateUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "business" | "debugger">("student");

  // Set the default tab based on user role when the component mounts or userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.role) {
      setActiveTab(userProfile.role);
    }
  }, [userProfile]);

  const handleTabChange = (value: string) => {
    const role = value as "student" | "business" | "debugger";
    setActiveTab(role);
    
    // If the user has switched to a different role, update their profile
    if (userProfile && userProfile.role !== role) {
      updateUserRole(role);
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "student":
        return <StudentDashboard />;
      case "business":
        return <BusinessDashboard />;
      case "debugger":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">デバッガーモード</h2>
            <p className="text-gray-600 mb-6">デバッグ機能にアクセスできます</p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md max-w-xl mx-auto">
              <pre className="whitespace-pre-wrap text-left">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          </div>
        );
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="inline-block mb-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
                <Button className="gradient-primary shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 duration-200">
                  <FileText className="mr-2 h-5 w-5" />
                  スライドビューを開く
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <Tabs 
              value={activeTab} 
              className="w-full max-w-3xl"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 p-1.5 bg-blue-50/80 rounded-xl shadow-sm">
                <TabsTrigger 
                  value="student"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  学生ビュー
                </TabsTrigger>
                <TabsTrigger 
                  value="business"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  <Building className="mr-2 h-5 w-5" />
                  企業ビュー
                </TabsTrigger>
                <TabsTrigger 
                  value="debugger"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium py-3 transition-all duration-200 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  デバッガー
                </TabsTrigger>
              </TabsList>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <TabsContent value="student" className="animate-fade-in">
                  <StudentDashboard />
                </TabsContent>
                <TabsContent value="business" className="animate-fade-in">
                  <BusinessDashboard />
                </TabsContent>
                <TabsContent value="debugger" className="animate-fade-in">
                  <div className="p-8">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
                      <h3 className="font-medium text-yellow-800 mb-2">デバッガーモード</h3>
                      <p className="text-yellow-700 text-sm">
                        このモードでは、アプリケーションのデバッグ情報を確認できます。
                      </p>
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
