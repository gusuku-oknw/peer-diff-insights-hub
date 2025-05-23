
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ChevronRight, MessageSquare } from "lucide-react";

// Mock project data
const projects = [
  {
    id: 1,
    title: "デジタルマーケティング戦略 2025",
    unreadComments: 7,
    progress: 85,
    aiSummary: "プレゼンテーションの充実点",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "デジタルマーケティング戦略 2025",
    unreadComments: 7,
    progress: 45,
    color: "bg-teal-400",
  },
  {
    id: 3,
    title: "新製品ローンチ",
    unreadComments: 3,
    progress: 45,
    aiSummary: "競合優位性の独壇",
    color: "bg-teal-400",
  },
  {
    id: 4,
    title: "企業説明資料",
    unreadComments: 0,
    progress: 12,
    color: "bg-amber-400",
  },
];

const BusinessDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">プロジェクト一覧</h2>
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-12 w-full">
                {/* Progress bar side */}
                <div className="md:col-span-3">
                  <div className={`${project.color} h-full flex items-center justify-center p-6`}>
                    <div className="text-center">
                      <span className="text-white text-4xl font-bold">{project.progress}%</span>
                      <div className="bg-white/30 h-2 rounded-full w-32 mt-2">
                        <div 
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content side */}
                <div className="md:col-span-9 p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-700">コメント未承認数: {project.unreadComments}</span>
                      </div>
                      {project.aiSummary && (
                        <div className="mt-2">
                          <span className="font-medium">AI要約: </span>
                          <span className="text-gray-700">{project.aiSummary}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <Link to={`/slides?id=${project.id}`}>
                        <Button className="flex items-center space-x-1">
                          <span>詳細を見る</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add project button */}
      <div className="flex justify-center mt-8">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2">
          <span>新しいプロジェクトを作成</span>
        </Button>
      </div>
    </div>
  );
};

export default BusinessDashboard;
