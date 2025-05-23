
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { 
  Folder, 
  BarChart3, 
  Users, 
  Award, 
  AlertCircle,
  DollarSign,
  BookOpen,
  GitBranch,
  CreditCard,
  ChevronRight,
  Brain,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data for business dashboard
const projects = [
  {
    id: 1,
    title: "プロダクトロードマップ2025",
    status: "レビュー中",
    progress: 75,
    unreadComments: 12,
    lastUpdated: "30分前",
    slideId: "product-roadmap-2025",
  },
  {
    id: 2,
    title: "Q2マーケティング戦略",
    status: "レビュー中",
    progress: 40,
    unreadComments: 5,
    lastUpdated: "2時間前",
    slideId: "q2-marketing-strategy",
  },
  {
    id: 3,
    title: "四半期業績報告",
    status: "完了",
    progress: 100,
    unreadComments: 0,
    lastUpdated: "1日前",
    slideId: "quarterly-report",
  },
];

// Subscription data
const subscriptionData = {
  plan: "ビジネスプラン",
  maxStudents: 30,
  usedStudents: 24,
  percentUsed: 80,
};

// Student ranks data
const studentRanksData = {
  gold: 5,
  silver: 12,
  bronze: 24,
  nextBonus: "¥50,000",
  featuredComment: "プレゼンの論理構成が明確で、データの可視化も効果的です。特に市場分析のスライドは説得力があります。",
};

// Mock AI summary data
const aiSummaryData = {
  summary: "レビュー全体として好意的なフィードバックが多く、特にビジネスモデルの持続可能性とデザインの一貫性について肯定的なコメントが集中しています。改善点としては技術的実現性の詳細が不足している点が指摘されています。",
  keywords: ["ビジネスモデル", "UI/UX", "スケーラビリティ", "市場分析", "顧客ニーズ"],
  sentiment: [
    { name: "ポジティブ", value: 65 },
    { name: "中立", value: 25 },
    { name: "ネガティブ", value: 10 },
  ],
};

const BusinessDashboard = () => {
  const handleProjectEdit = (projectId: number) => {
    toast.info(`プロジェクト #${projectId} を編集します`);
  };

  const handleProjectShare = (projectId: number) => {
    toast.success(`プロジェクト #${projectId} の共有リンクをコピーしました`);
  };

  const handleProjectDelete = (projectId: number) => {
    toast.success(`プロジェクト #${projectId} を削除しました`);
  };
  
  const handleProjectSettings = (projectId: number) => {
    toast.info(`プロジェクト #${projectId} の設定を開きます`);
  };

  return (
    <div className="space-y-8">
      {/* プロジェクトサマリパネル */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Folder className="h-5 w-5 text-blue-500" />
          プロジェクトサマリ
        </h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={project.status === "完了" ? "default" : "secondary"}
                    >
                      {project.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">メニューを開く</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>プロジェクト操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleProjectEdit(project.id)}>
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProjectShare(project.id)}>
                          共有
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProjectSettings(project.id)}>
                          設定
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleProjectDelete(project.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription>最終更新: {project.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>レビュー進捗</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress 
                      value={project.progress} 
                      className={
                        project.progress >= 100 
                          ? "bg-blue-100 [&>div]:bg-green-500" 
                          : project.progress >= 50
                          ? "bg-blue-100 [&>div]:bg-blue-500"
                          : "bg-blue-100 [&>div]:bg-blue-400"
                      }
                    />
                  </div>
                  {project.unreadComments > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        未読コメント
                      </span>
                      <Badge variant="outline" className="font-bold">
                        {project.unreadComments}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-1" asChild>
                  <Link to={`/slides?id=${project.slideId}`}>
                    スライドを開く <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* レビュー枠＆課金状況 */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> レビュー枠＆課金状況
              </CardTitle>
              <CardDescription>
                {subscriptionData.plan} - 上限ユニーク学生数: {subscriptionData.maxStudents}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>使用状況</span>
                    <span className={
                      subscriptionData.percentUsed >= 80 ? "text-amber-600 font-medium" : ""
                    }>
                      {subscriptionData.usedStudents} / {subscriptionData.maxStudents} 学生
                    </span>
                  </div>
                  <Progress 
                    value={subscriptionData.percentUsed} 
                    className={
                      subscriptionData.percentUsed >= 80 
                        ? "bg-amber-100 [&>div]:bg-amber-500" 
                        : "bg-blue-100 [&>div]:bg-blue-500"
                    }
                  />
                </div>

                {subscriptionData.percentUsed >= 80 && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      学生枠の80%以上を使用しています。上限に達する前に追加枠の購入をご検討ください。
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                請求詳細
              </Button>
              <Button className="flex-1 flex items-center gap-1 gradient-primary text-white">
                <DollarSign className="h-4 w-4" />
                追加枠購入
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* AI要約ウィジェット */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" /> AI要約インサイト
              </CardTitle>
              <CardDescription>
                最新プロジェクト: プロダクトロードマップ2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p>{aiSummaryData.summary}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">キーワード</p>
                <div className="flex flex-wrap gap-2">
                  {aiSummaryData.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="bg-blue-50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">感情分析</p>
                <div className="h-20">
                  <ChartContainer
                    config={{
                      positive: { color: "#22c55e" },
                      neutral: { color: "#64748b" },
                      negative: { color: "#ef4444" },
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={aiSummaryData.sentiment}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        stroke="none"
                      >
                        {aiSummaryData.sentiment.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "ポジティブ"
                                ? "var(--color-positive)"
                                : entry.name === "中立"
                                ? "var(--color-neutral)"
                                : "var(--color-negative)"
                            }
                          />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 bg-green-500 rounded-sm"></span>
                    <span>ポジティブ: {aiSummaryData.sentiment[0].value}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 bg-gray-500 rounded-sm"></span>
                    <span>中立: {aiSummaryData.sentiment[1].value}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 bg-red-500 rounded-sm"></span>
                    <span>ネガティブ: {aiSummaryData.sentiment[2].value}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/slides?id=${projects[0].slideId}`}>
                  詳細レポートを見る
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 優秀学生インサイト */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" /> 優秀学生インサイト
              </CardTitle>
              <CardDescription>
                ランク別学生数: ゴールド {studentRanksData.gold}名、シルバー {studentRanksData.silver}名、ブロンズ {studentRanksData.bronze}名
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold">ゴールド学生のフィードバック例</h4>
                </div>
                <p className="text-sm text-gray-700">"{studentRanksData.featuredComment}"</p>
              </div>
              
              <div>
                <p className="font-medium mb-2">学生ランク分布</p>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "ゴールド", value: studentRanksData.gold },
                        { name: "シルバー", value: studentRanksData.silver },
                        { name: "ブロンズ", value: studentRanksData.bronze },
                      ]}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <Cell fill="#f59e0b" />
                        <Cell fill="#94a3b8" />
                        <Cell fill="#b45309" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">次回インセンティブ支給予定額</p>
                  <p className="text-xl font-bold text-blue-700">{studentRanksData.nextBonus}</p>
                </div>
                <Button variant="outline" size="sm">
                  詳細設定
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* アクションパネル */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">アクションパネル</CardTitle>
              <CardDescription>次に何をしますか？</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full flex items-center justify-between gradient-primary text-white" asChild>
                <Link to={`/slides?id=${projects[0].slideId}`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>差分プレビューを見る</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>再レビューを依頼</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  <span>ブランチをマージ</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span>プラン変更</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* 通知／アラート */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">通知センター</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">全て</TabsTrigger>
                  <TabsTrigger value="comments">コメント</TabsTrigger>
                  <TabsTrigger value="system">システム</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded-lg text-sm flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">新規コメント 12件</p>
                      <p className="text-gray-600">プロダクトロードマップ2025</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">レビュー枠が80%に達しています</p>
                      <p className="text-gray-600">追加枠の購入を検討してください</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded-lg text-sm flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">新規コメント 12件</p>
                      <p className="text-gray-600">プロダクトロードマップ2025</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="system" className="space-y-2">
                  <div className="bg-amber-50 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">レビュー枠が80%に達しています</p>
                      <p className="text-gray-600">追加枠の購入を検討してください</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-gray-500">全ての通知を見る</Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BusinessDashboard;
