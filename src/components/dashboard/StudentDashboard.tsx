
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Award, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText, 
  MessageSquare, 
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock stats data
const statsCards = [
  {
    title: "レビュー枠の残数",
    value: "8",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "合計コメント数",
    value: "13",
    icon: MessageSquare,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "ランク",
    value: "G",
    label: "ゴールド",
    icon: Award,
    color: "bg-amber-100 text-amber-700",
    valueStyle: "text-amber-500",
  },
];

// Mock tasks data
const tasks = [
  {
    id: 1,
    projectName: "デジタルマーケティング戦略1",
    deadline: "2025年5月5日",
    status: "未コメント",
    statusColor: "bg-blue-100 text-blue-800",
    company: "TechCorp 株式会社",
  },
  {
    id: 2,
    projectName: "企業説明会資料2",
    deadline: "2024年4月7日",
    status: "コメント済",
    statusColor: "bg-green-100 text-green-800",
    company: "GlobalSoft 株式会社",
  },
  {
    id: 3,
    projectName: "新製品ローンチ計画",
    deadline: "2025年6月12日",
    status: "未コメント",
    statusColor: "bg-blue-100 text-blue-800",
    company: "イノベーションテック 株式会社",
  },
  {
    id: 4,
    projectName: "マーケティングレポート",
    deadline: "2025年5月30日",
    status: "期限間近",
    statusColor: "bg-amber-100 text-amber-800",
    company: "フューチャービジョン 株式会社",
  },
];

// Mock presentations data
const presentations = [
  {
    id: 1,
    title: "デジタルマーケティング戦略2025",
    company: "TechCorp 株式会社",
    lastUpdated: "2025年5月20日",
    unreadComments: 7,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "新製品ローンチ計画",
    company: "イノベーションテック 株式会社",
    lastUpdated: "2025年5月15日",
    unreadComments: 3,
    color: "bg-indigo-500",
  },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index} className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <div className="mt-2 flex items-center">
                    {card.title === "ランク" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">{card.value}</span>
                        </div>
                        <span className="text-lg font-medium">{card.label}</span>
                      </div>
                    ) : (
                      <p className={`text-3xl font-bold ${card.valueStyle || ''}`}>{card.value}</p>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">タスク一覧</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">未コメント: 2</Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">期限間近: 1</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">完了: 1</Badge>
          </div>
        </div>
        
        <Card className="border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロジェクト</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">企業</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.projectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {task.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className={task.statusColor}>{task.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link to={`/slides?id=${task.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                          確認する <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Presentation Materials */}
      <div>
        <h2 className="text-2xl font-bold mb-4">最近のプレゼン資料</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {presentations.map((presentation) => (
            <Card key={presentation.id} className="border shadow-sm overflow-hidden">
              <div className={`${presentation.color} h-2`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">{presentation.title}</h3>
                    <p className="text-gray-500 text-sm">{presentation.company}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>更新: {presentation.lastUpdated}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span>{presentation.unreadComments} 件のコメント</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex justify-end">
                    <Link to={`/slides?id=${presentation.id}`}>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        スライドを表示
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
