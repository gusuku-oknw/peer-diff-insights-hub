import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
const PricingSection = () => {
  const plans = [{
    name: "ライト",
    price: "¥29,800",
    period: "/月",
    description: "小規模企業や初回利用に最適",
    features: ["学生レビュアー 20名まで", "月間プロジェクト 5件", "基本的なAI要約", "標準サポート", "差分管理機能", "レポートエクスポート"],
    popular: false,
    color: "border-gray-200"
  }, {
    name: "スタンダード",
    price: "¥59,800",
    period: "/月",
    description: "中堅企業の継続利用に最適",
    features: ["学生レビュアー 50名まで", "月間プロジェクト 15件", "高度なAI要約＋感情分析", "優先サポート", "Gitライクブランチ管理", "カスタムレポート", "API連携", "専用アカウントマネージャー"],
    popular: true,
    color: "border-blue-500 ring-2 ring-blue-500"
  }, {
    name: "プレミアム",
    price: "¥149,800",
    period: "/月",
    description: "大企業向け包括ソリューション",
    features: ["学生レビュアー 150名まで", "無制限プロジェクト", "フルAI機能＋カスタム分析", "24/7専用サポート", "高度なワークフロー自動化", "白ラベルオプション", "専用インフラ", "オンサイトトレーニング", "カスタム開発対応"],
    popular: false,
    color: "border-purple-500"
  }];
  return <section id="pricing" className="py-20 gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            シンプルで
            <span className="gradient-primary bg-clip-text text-transparent inline-block font-normal text-3xl">
              透明性のある料金
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ユニーク学生数ベースの料金体系で、利用規模に合わせて最適なプランをお選びいただけます。
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => <Card key={index} className={`relative transition-all duration-300 hover:scale-105 ${plan.color} ${plan.popular ? 'shadow-2xl' : 'hover:shadow-lg'}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    人気プラン
                  </div>
                </div>}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-bold gradient-primary bg-clip-text text-transparent inline-block mx-0 text-4xl py-0 text-justify">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>
                
                <Button className={`w-full ${plan.popular ? 'gradient-primary text-white hover:opacity-90' : 'border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600'}`} variant={plan.popular ? 'default' : 'outline'} size="lg">
                  {plan.popular ? '今すぐ始める' : 'プランを選択'}
                </Button>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            全プランに14日間の無料トライアル付き。いつでもキャンセル可能です。
          </p>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
            エンタープライズプランについて相談する →
          </Button>
        </div>
      </div>
    </section>;
};
export default PricingSection;