
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Users, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 gradient-secondary min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AIを活用した次世代レビューシステム
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              学生×企業の
              <span className="gradient-primary bg-clip-text text-transparent inline-block">
                共創プラットフォーム
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              PeerDiffXは、企業の説明会資料を学生がレビューし、AI要約とGitライクな差分管理で効率的なフィードバックを実現する革新的なSaaSです。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90 text-lg px-8 py-4">
                無料トライアルを開始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                デモを見る
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">500+ 学生ネットワーク</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <GitBranch className="h-5 w-5 text-purple-600" />
                <span className="text-gray-600">Gitライク差分管理</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 animate-float z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
                  <span className="text-sm font-medium">学生レビュー進行中...</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">AI要約生成</span>
                  <div className="w-6 h-6 gradient-primary rounded animate-spin"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">満足度</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">32</div>
                    <div className="text-xs text-gray-600">コメント</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-24 h-24 gradient-primary rounded-full opacity-20 animate-ping z-0"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-pulse-soft z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
