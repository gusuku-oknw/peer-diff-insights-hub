
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, MessageSquare, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "オンラインコメント＆差分プレビュー",
      description: "Canvas技術により高速レンダリングでスライドを表示。スライド上での直感的なコメント機能と、XMLレベルの変更箇所をハイライト表示。",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <GitBranch className="h-8 w-8 text-purple-600" />,
      title: "Gitライクなブランチ管理",
      description: "非エンジニアでも使いやすいビジュアルブランチUI。マージ申請やコンフリクト解消を直感的に操作可能。",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-cyan-600" />,
      title: "AI要約レポート",
      description: "GPT-4 Turboがフィードバックを3〜5文に自動要約。キーワード抽出と感情分析で短時間でインサイトを把握。",
      color: "bg-cyan-50 hover:bg-cyan-100"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "インセンティブ管理",
      description: "ユニーク学生数ベースの課金システム。上位10%に自動ボーナス支給で学生のモチベーションを維持。",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "学生コミュニティ",
      description: "500名以上の学生ネットワークから最適なレビュアーをマッチング。多様な視点での質の高いフィードバックを提供。",
      color: "bg-orange-50 hover:bg-orange-100"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "高速ワークフロー",
      description: "アップロードからレビュー完了まで最短48時間。リアルタイム通知と進捗追跡で効率的なプロジェクト管理。",
      color: "bg-yellow-50 hover:bg-yellow-100"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            革新的な機能で
            <span className="gradient-primary bg-clip-text text-transparent inline-block">
              レビューを再定義
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PeerDiffXの先進的な機能群が、企業と学生の協働を効率化し、質の高いフィードバックループを実現します。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.color} border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
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
