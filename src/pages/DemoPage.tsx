import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Building, GraduationCap, Play, FileText, ArrowRight, Monitor, Edit3, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState<"business" | "student">("business");

  const handleStartTrial = () => {
    toast({
      title: "無料トライアル登録",
      description: `${activeTab === "business" ? "企業" : "学生"}アカウントの登録を開始します。`,
      duration: 3000,
    });
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent inline-block">
              PeerDiffX
            </span>
            を体験する
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            企業と学生、それぞれの視点からプラットフォームの機能を試してみましょう。
            無料トライアルでは実際のプロジェクトを作成・参加できます。
          </p>
          <Link to="/slides">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90 shadow-lg">
              <Play className="mr-2 h-5 w-5" />
              今すぐ実際のエディタを体験
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* 機能デモセクション */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">主要機能のデモ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">プレゼンテーションモード</h3>
              <p className="text-gray-600 text-sm mb-4">実際のプレゼンテーション環境でスライドを表示・操作</p>
              <Link to="/slides">
                <Button variant="outline" size="sm" className="w-full">
                  試してみる
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">編集モード</h3>
              <p className="text-gray-600 text-sm mb-4">スライドの内容を直接編集・カスタマイズ</p>
              <Link to="/slides">
                <Button variant="outline" size="sm" className="w-full">
                  試してみる
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">レビューモード</h3>
              <p className="text-gray-600 text-sm mb-4">コメントやフィードバックの確認・作成</p>
              <Link to="/slides">
                <Button variant="outline" size="sm" className="w-full">
                  試してみる
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs 
          defaultValue="business" 
          className="max-w-4xl mx-auto mb-12"
          onValueChange={(value) => setActiveTab(value as "business" | "student")}
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              企業視点
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              学生視点
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg text-sm font-medium">
                  企業向け
                </div>
                <h3 className="text-2xl font-bold mb-4">説明会資料の改善</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>実際の学生からのフィードバックを受け取る</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>Gitライクなコミット機能で資料のバージョン管理</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>AIによる要約と分析で効率的にレポート作成</p>
                  </div>
                </div>
                <div className="relative h-64 bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-blue-600 mx-auto mb-3" />
                      <p className="text-gray-600">企業ダッシュボードのデモ</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link to="/slides">
                    <Button className="w-full gradient-primary text-white hover:opacity-90">
                      実際のエディタで体験
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={handleStartTrial}
                  >
                    企業として無料トライアルを開始
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">デモを見る</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">プレゼンテーションのアップロード</h4>
                      <p className="text-sm text-gray-600">PPTXファイルをアップロードしてプロジェクト作成</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">フィードバックの確認</h4>
                      <p className="text-sm text-gray-600">学生からのコメントとXMLベースの差分を確認</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">AIレポートの生成</h4>
                      <p className="text-sm text-gray-600">フィードバックをAIが要約・分析するプロセス</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="student" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 px-3 py-1 rounded-bl-lg text-sm font-medium">
                  学生向け
                </div>
                <h3 className="text-2xl font-bold mb-4">企業のプレゼンをレビュー</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>実際の企業資料へのレビューでスキルアップ</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>質の高いコメントで報酬を獲得</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>就活に役立つ企業理解と実務経験</p>
                  </div>
                </div>
                <div className="relative h-64 bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-purple-600 mx-auto mb-3" />
                      <p className="text-gray-600">学生レビュー画面のデモ</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link to="/slides">
                    <Button className="w-full gradient-primary text-white hover:opacity-90">
                      実際のレビュー機能を体験
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={handleStartTrial}
                  >
                    学生として無料トライアルを開始
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">デモを見る</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">レビュータスクの確認</h4>
                      <p className="text-sm text-gray-600">アサインされた企業プレゼンの閲覧とタスク管理</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">コメントの作成</h4>
                      <p className="text-sm text-gray-600">資料に対する効果的なレビューコメントの入力</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-100 transition cursor-pointer">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">収益確認</h4>
                      <p className="text-sm text-gray-600">高評価レビューでの追加ボーナス獲得と収益確認</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">よくある質問</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2">無料トライアルには何が含まれますか？</h4>
              <p className="text-gray-600">
                企業アカウントでは3つのプレゼンテーションと最大10人の学生レビュー、学生アカウントでは5つのレビュータスクが無料でご利用いただけます。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">クレジットカードの登録は必要ですか？</h4>
              <p className="text-gray-600">
                無料トライアルでは不要です。有料プランへのアップグレード時にのみ登録が必要となります。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">トライアル期間はどのくらいですか？</h4>
              <p className="text-gray-600">
                トライアル期間は14日間です。期間終了後は自動的に終了し、お客様の同意なく課金されることはありません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
