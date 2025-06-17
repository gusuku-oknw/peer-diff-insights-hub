
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Users, Sparkles, Play, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                <Sparkles className="h-4 w-4" />
                AIを活用した次世代レビューシステム
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
              学生×企業の
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                共創プラットフォーム
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              PeerDiffXは、企業の説明会資料を学生がレビューし、<strong className="text-blue-600">AI要約</strong>と<strong className="text-purple-600">Gitライク差分管理</strong>で効率的なフィードバックを実現する革新的なSaaSです。
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  今すぐ使ってみる
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                  <Play className="mr-2 h-5 w-5" />
                  デモを見る
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
              <p className="text-sm text-blue-800 mb-4 font-medium">
                <Sparkles className="inline h-4 w-4 mr-1" />
                <strong>💡 ヒント:</strong> 「今すぐ使ってみる」でスライドエディタを体験、「デモを見る」で機能の詳細をご確認いただけます
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">500+ 学生ネットワーク</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <GitBranch className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Gitライク差分管理</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 font-medium">満足度 85%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Interactive demo mockup */}
          <div className="relative">
            {/* Floating elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-cyan-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            
            {/* Main demo card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 font-mono">PeerDiffX Editor</div>
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                {/* Status indicator */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">学生レビュー進行中...</span>
                  <div className="ml-auto text-xs text-blue-600 font-medium">3/5 完了</div>
                </div>
                
                {/* Mock slide content */}
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                
                {/* AI summary */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">AI要約生成</span>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded animate-spin"></div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">満足度</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">32</div>
                    <div className="text-xs text-gray-600">コメント</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-xs text-gray-600">改善点</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
