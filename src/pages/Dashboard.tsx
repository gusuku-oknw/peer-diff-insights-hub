
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Dashboard = () => {
  const [userType, setUserType] = useState<"student" | "business">("student");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ダッシュボード
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              あなたのレビュー状況とタスクを管理
            </p>
            <div className="mt-4">
              <Link to="/slides">
                <Button className="gradient-primary">
                  <FileText className="mr-2 h-5 w-5" />
                  スライドビューを開く
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <Tabs 
              defaultValue="student" 
              className="w-full max-w-md"
              onValueChange={(value) => setUserType(value as "student" | "business")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="student">学生ビュー</TabsTrigger>
                <TabsTrigger value="business">企業ビュー</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <StudentDashboard />
              </TabsContent>
              <TabsContent value="business">
                <BusinessDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
