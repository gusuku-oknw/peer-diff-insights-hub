
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, MessageSquare, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "オンラインコメント＆差分プレビュー",
      description: "Canvas技術により高速レンダリングでスライドを表示。スライド上での直感的なコメント機能と、XMLレベルの変更箇所をハイライト表示。",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
      border: "border-blue-200"
    },
    {
      icon: <GitBranch className="h-8 w-8 text-purple-600" />,
      title: "Gitライクなブランチ管理",
      description: "非エンジニアでも使いやすいビジュアルブランチUI。マージ申請やコンフリクト解消を直感的に操作可能。",
      color: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
      border: "border-purple-200"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-cyan-600" />,
      title: "AI要約レポート",
      description: "GPT-4 Turboがフィードバックを3〜5文に自動要約。キーワード抽出と感情分析で短時間でインサイトを把握。",
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200",
      border: "border-cyan-200"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "インセンティブ管理",
      description: "ユニーク学生数ベースの課金システム。上位10%に自動ボーナス支給で学生のモチベーションを維持。",
      color: "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
      border: "border-green-200"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "学生コミュニティ",
      description: "500名以上の学生ネットワークから最適なレビュアーをマッチング。多様な視点での質の高いフィードバックを提供。",
      color: "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200",
      border: "border-orange-200"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "高速ワークフロー",
      description: "アップロードからレビュー完了まで最短48時間。リアルタイム通知と進捗追跡で効率的なプロジェクト管理。",
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200",
      border: "border-yellow-200"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            革新的な機能
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            レビューを
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              再定義
            </span>
            する機能群
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PeerDiffXの先進的な機能群が、企業と学生の協働を効率化し、質の高いフィードバックループを実現します。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.color} ${feature.border} border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-white/80 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
