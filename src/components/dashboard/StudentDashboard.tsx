
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
  Clock
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

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      {/* 割り当てタスク一覧 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          割り当てタスク一覧
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge
                    variant={
                      task.status === "完了"
                        ? "default"
                        : task.status === "進行中"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 期限: {task.deadline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>進捗状況</span>
                    <span className="font-medium">
                      {task.completedSlides}/{task.totalSlides} スライド
                    </span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    className={
                      task.progress >= 100 
                        ? "bg-blue-100 [&>div]:bg-green-500" 
                        : task.progress >= 50
                        ? "bg-blue-100 [&>div]:bg-blue-500"
                        : "bg-blue-100 [&>div]:bg-blue-400"
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                  詳細を見る <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 貢献メトリクス */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChartHorizontal className="h-5 w-5 text-blue-500" /> 貢献メトリクス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500">累計コメント数</div>
                  <div className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-1">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    {contributionMetrics.totalComments}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500">承認率</div>
                  <div className="text-3xl font-bold text-gray-800">
                    {contributionMetrics.approvalRate}%
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Award className={
                    contributionMetrics.rank === "ゴールド" ? "text-amber-500 h-6 w-6" : 
                    contributionMetrics.rank === "シルバー" ? "text-gray-400 h-6 w-6" : 
                    "text-amber-700 h-6 w-6"
                  } />
                  <span className="font-semibold text-lg">
                    {contributionMetrics.rank}ランク
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  ゴールドランクまで、あと{contributionMetrics.nextRankComments}コメント！
                </p>
                <Progress value={85} className="mt-2 w-full bg-gray-200 [&>div]:bg-amber-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* クイックスタートと通知 */}
        <section className="space-y-4">
          {/* クイックスタート */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">クイックスタート</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gradient-primary">最新PPTXを開く</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">チェックリスト</Button>
                <Button variant="outline" className="flex-1">ヘルプ</Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知／バッジ */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" /> 通知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-gray-500">全ての通知を見る</Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      {/* キャンペーンバナー */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">レビュアーコンテスト開催中！</h3>
          <p className="text-white/90">今月のトップレビュアーには特別ボーナスが贈られます。</p>
        </div>
        <Button variant="secondary">詳細を見る</Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
