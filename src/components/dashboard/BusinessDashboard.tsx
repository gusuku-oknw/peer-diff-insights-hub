
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
import { 
  BarChart3, 
  ChevronRight, 
  Clock, 
  FileText, 
  Filter, 
  MessageSquare, 
  Plus, 
  Search,
  Calendar 
} from "lucide-react";
import { useState } from "react";

// Mock project data
const projects = [
  {
    id: 1,
    title: "デジタルマーケティング戦略 2025",
    unreadComments: 7,
    progress: 85,
    aiSummary: "プレゼンテーションの充実点",
    color: "bg-blue-500",
    lastUpdated: "2025年5月20日",
    deadline: "2025年6月15日",
  },
  {
    id: 2,
    title: "四半期業績報告",
    unreadComments: 4,
    progress: 45,
    color: "bg-teal-400",
    lastUpdated: "2025年5月18日",
    deadline: "2025年6月1日",
  },
  {
    id: 3,
    title: "新製品ローンチ計画",
    unreadComments: 3,
    progress: 45,
    aiSummary: "競合優位性の独壇",
    color: "bg-indigo-500",
    lastUpdated: "2025年5月15日",
    deadline: "2025年7月10日",
  },
  {
    id: 4,
    title: "企業説明資料",
    unreadComments: 0,
    progress: 12,
    color: "bg-amber-400",
    lastUpdated: "2025年5月12日",
    deadline: "2025年5月30日",
  },
];

// Mock stats data
const statsData = [
  { label: "進行中のプロジェクト", value: 4, change: "+1", icon: FileText, color: "text-blue-500" },
  { label: "未読コメント", value: 14, change: "+5", icon: MessageSquare, color: "text-pink-500" },
  { label: "今月のスライド数", value: 28, change: "+12", icon: BarChart3, color: "text-emerald-500" },
];

const BusinessDashboard = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter projects based on selected filter and search query
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "high-progress") return project.progress > 75 && matchesSearch;
    if (filter === "medium-progress") return project.progress >= 30 && project.progress <= 75 && matchesSearch;
    if (filter === "low-progress") return project.progress < 30 && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span className={`ml-2 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-').replace('500', '100')}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">フィルター:</span>
          <select 
            className="text-sm border rounded-md px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="high-progress">高進捗 (75%以上)</option>
            <option value="medium-progress">中進捗 (30-75%)</option>
            <option value="low-progress">低進捗 (30%未満)</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">プロジェクト一覧</h2>
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-12 w-full">
                  {/* Progress bar side */}
                  <div className={`${project.color} md:col-span-3`}>
                    <div className="h-full flex items-center justify-center p-6">
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
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <span>{project.unreadComments} 件の未読コメント</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>更新: {project.lastUpdated}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-red-500" />
                            <span>期限: {project.deadline}</span>
                          </div>
                        </div>
                        {project.aiSummary && (
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mt-2">
                            <span className="font-medium text-blue-700">AI要約: </span>
                            <span className="text-gray-700">{project.aiSummary}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col gap-2">
                        <Link to={`/slides?id=${project.id}`}>
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2">
                            <span>スライド編集</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full">
                          <span>詳細を見る</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">該当するプロジェクトはありません</p>
            <p className="text-gray-400 text-sm mt-1">検索条件を変更するか、新しいプロジェクトを作成してください</p>
          </div>
        )}
      </div>
      
      {/* Add project button */}
      <div className="flex justify-center mt-8">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>新しいプロジェクトを作成</span>
        </Button>
      </div>
    </div>
  );
};

export default BusinessDashboard;
