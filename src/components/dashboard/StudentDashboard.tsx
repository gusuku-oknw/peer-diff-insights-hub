
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border rounded-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg text-gray-700 mb-2">レビュー枠の残数</h3>
            <p className="text-6xl font-bold text-indigo-900">8</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg text-gray-700 mb-2">ゴールド</h3>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">G</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border rounded-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg text-gray-700 mb-2">合計コメント数</h3>
            <p className="text-6xl font-bold text-indigo-900">13</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">タスク一覧</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">プロジェクト</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">期限</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">ステータス</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">デジタルマーケティング戦略1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024年5月5日</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">未コメント</Badge>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">企業説明会資料2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024年4月7日</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">コメント済</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Presentation Materials */}
      <div>
        <h2 className="text-2xl font-bold mb-4">プレゼン資料</h2>
        <div className="border rounded-md p-6 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">デジタルマーケティング戦略2025</h3>
              <p className="text-gray-700">TechCorp 株式会社</p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-700">
              スライドを表示
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
