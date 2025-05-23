
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  BarChartHorizontal, 
  MessageSquare, 
  Award, 
  Bell, 
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  Zap
} from "lucide-react";

// Mock data for the student dashboard
const assignedTasks = [
  {
    id: 1,
    title: "プロダクト企画資料レビュー",
    deadline: "2025年6月10日",
    status: "進行中",
    progress: 60,
    totalSlides: 5,
    completedSlides: 3,
  },
  {
    id: 2,
    title: "マーケティング戦略資料",
    deadline: "2025年6月15日",
    status: "未着手",
    progress: 0,
    totalSlides: 10,
    completedSlides: 0,
  },
  {
    id: 3,
    title: "四半期業績発表資料",
    deadline: "2025年6月5日",
    status: "完了",
    progress: 100,
    totalSlides: 8,
    completedSlides: 8,
  },
];

// Student contribution metrics
const contributionMetrics = {
  totalComments: 42,
  approvalRate: 85,
  rank: "シルバー",
  nextRankComments: 8,
};

// Notifications
const notifications = [
  {
    id: 1,
    type: "reply",
    message: "あなたのコメントに企業から返信がありました",
    time: "30分前",
  },
  {
    id: 2,
    type: "review",
    message: "再レビュー依頼が届いています",
    time: "2時間前",
  },
];

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch(status) {
    case "完了": 
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "進行中": 
      return <Timer className="h-4 w-4 text-blue-500" />;
    default: 
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const StudentDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* 割り当てタスク一覧 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          割り当てタスク一覧
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedTasks.map((task) => (
            <Card 
              key={task.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-blue-500 group"
            >
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-800">{task.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={
                      task.status === "完了"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                        : task.status === "進行中"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1 text-gray-600">
                  <Clock className="h-3.5 w-3.5" /> 期限: {task.deadline}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">進捗状況</span>
                    <span className="font-medium text-gray-900">
                      {task.completedSlides}/{task.totalSlides} スライド
                    </span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    className={
                      task.progress >= 100 
                        ? "h-2.5 bg-green-100 [&>div]:bg-green-500" 
                        : task.progress >= 50
                        ? "h-2.5 bg-blue-100 [&>div]:bg-blue-600"
                        : "h-2.5 bg-gray-100 [&>div]:bg-blue-400"
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-1 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors group-hover:border-blue-300"
                >
                  詳細を見る <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 貢献メトリクス */}
        <section>
          <Card className="border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 border-t-4 border-t-purple-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-100 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                <BarChartHorizontal className="h-5 w-5 text-purple-600" /> 貢献メトリクス
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="text-sm text-gray-600 mb-1">累計コメント数</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    {contributionMetrics.totalComments}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="text-sm text-gray-600 mb-1">承認率</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {contributionMetrics.approvalRate}%
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center flex-col bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Award className={
                    contributionMetrics.rank === "ゴールド" ? "text-amber-500 h-6 w-6" : 
                    contributionMetrics.rank === "シルバー" ? "text-gray-400 h-6 w-6" : 
                    "text-amber-700 h-6 w-6"
                  } />
                  <span className="font-semibold text-lg text-blue-900">
                    {contributionMetrics.rank}ランク
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  ゴールドランクまで、あと{contributionMetrics.nextRankComments}コメント！
                </p>
                <Progress value={85} className="mt-2 w-full h-2.5 bg-blue-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* クイックスタートと通知 */}
        <section className="space-y-5">
          {/* クイックスタート */}
          <Card className="border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" /> クイックスタート
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Button className="w-full gradient-primary shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 duration-200">
                最新PPTXを開く
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-colors hover:-translate-y-0.5 duration-200">
                  チェックリスト
                </Button>
                <Button variant="outline" className="flex-1 border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-colors hover:-translate-y-0.5 duration-200">
                  ヘルプ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知／バッジ */}
          <Card className="border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 border-t-4 border-t-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                <Bell className="h-5 w-5 text-purple-600" /> 通知
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="bg-gray-50 border border-gray-100 p-3 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors hover:border-blue-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full w-8 h-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 hover:bg-gray-100 transition-colors">
              <Button variant="ghost" className="w-full text-gray-600 hover:text-blue-700 font-medium">全ての通知を見る</Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      {/* キャンペーンバナー */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 transform transition-transform hover:scale-[1.01] duration-300">
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-xl mb-1">レビュアーコンテスト開催中！</h3>
          <p className="text-white/90">今月のトップレビュアーには特別ボーナスが贈られます。積極的に参加しましょう！</p>
        </div>
        <Button variant="secondary" className="whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          詳細を見る
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
