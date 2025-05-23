
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Layers } from "lucide-react";

const Dashboard = () => {
  const [userType, setUserType] = useState<"student" | "business">("student");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-block mb-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              PeerDiffX ダッシュボード
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-2">
              ダッシュボード
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              あなたのレビュー状況とタスクを管理し、効率的にコラボレーションできます
            </p>
            <div className="mt-6">
              <Link to="/slides">
                <Button className="gradient-primary shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                  <FileText className="mr-2 h-5 w-5" />
                  スライドビューを開く
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <Tabs 
              defaultValue="student" 
              className="w-full max-w-3xl"
              onValueChange={(value) => setUserType(value as "student" | "business")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-blue-50 rounded-lg">
                <TabsTrigger 
                  value="student"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  学生ビュー
                </TabsTrigger>
                <TabsTrigger 
                  value="business"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  企業ビュー
                </TabsTrigger>
              </TabsList>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <TabsContent value="student">
                  <StudentDashboard />
                </TabsContent>
                <TabsContent value="business">
                  <BusinessDashboard />
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
