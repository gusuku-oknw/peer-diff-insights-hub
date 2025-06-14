
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Target,
  TrendingUp,
  Users
} from "lucide-react";

interface ReviewDashboardProps {
  currentSlide: number;
  totalSlides: number;
  completionPercentage: number;
  pendingItems: number;
  urgentItems: number;
  completedToday: number;
  isVeryNarrow?: boolean;
}

const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  currentSlide,
  totalSlides,
  completionPercentage,
  pendingItems,
  urgentItems,
  completedToday,
  isVeryNarrow = false
}) => {
  const stats = [
    {
      label: "進捗率",
      value: `${completionPercentage}%`,
      icon: Target,
      color: "blue",
      trend: "+5%"
    },
    {
      label: "未完了",
      value: pendingItems,
      icon: Clock,
      color: "orange",
      urgent: urgentItems > 0
    },
    {
      label: "完了済み",
      value: completedToday,
      icon: CheckCircle2,
      color: "green",
      trend: "+2"
    },
    {
      label: "要確認",
      value: urgentItems,
      icon: AlertTriangle,
      color: "red",
      pulse: urgentItems > 0
    }
  ];

  if (isVeryNarrow) {
    return (
      <div className="space-y-2 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">進捗</span>
          <Badge variant="outline" className="text-xs">{completionPercentage}%</Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto h-full">
      {/* Quick Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">レビュー概要</h3>
          <Badge variant="outline" className="text-xs">
            スライド {currentSlide}/{totalSlides}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">全体進捗</span>
            <span className="font-medium text-blue-700">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          
          {urgentItems > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-3 w-3" />
              <span>緊急: {urgentItems}件の要確認項目</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`relative border-l-4 ${
                stat.color === 'blue' ? 'border-l-blue-500' :
                stat.color === 'green' ? 'border-l-green-500' :
                stat.color === 'orange' ? 'border-l-orange-500' :
                'border-l-red-500'
              } ${stat.pulse ? 'animate-pulse' : ''}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.trend}</span>
                      </div>
                    )}
                  </div>
                  <Icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-500' :
                    stat.color === 'green' ? 'text-green-500' :
                    stat.color === 'orange' ? 'text-orange-500' :
                    'text-red-500'
                  }`} />
                </div>
                {stat.urgent && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Preview */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">次のアクション</span>
          <Users className="h-3 w-3 text-gray-500" />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-600">• 構成チェックを完了する</div>
          <div className="text-xs text-gray-600">• デザイン要素を確認する</div>
          <div className="text-xs text-gray-600">• フィードバックを統合する</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;
