
import { GitBranch, Mail, MessageSquare, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                PeerDiffX
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              学生と企業をつなぐ革新的なレビュープラットフォーム。AI要約とGitライク差分管理で、効率的なフィードバックループを実現します。
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                500+ 学生ネットワーク
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <GitBranch className="h-4 w-4" />
                Gitライク管理
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">プロダクト</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">機能</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">料金</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">セキュリティ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
              <li><a href="#" className="hover:text-white transition-colors">導入事例</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ブログ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PeerDiffX. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-white transition-colors">利用規約</a>
              <a href="#" className="hover:text-white transition-colors">Cookie設定</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
