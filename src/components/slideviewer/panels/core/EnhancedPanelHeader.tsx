
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, MessageSquare, BookOpen, BarChart3 } from "lucide-react";
import { panelTokens } from "@/design-system/tokens/panel";

interface EnhancedPanelHeaderProps {
  activeTab: string;
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  sizeClass: 'xs' | 'sm' | 'md' | 'lg';
  completionPercentage?: number;
  onClose?: () => void;
  showProgress?: boolean;
}

const EnhancedPanelHeader: React.FC<EnhancedPanelHeaderProps> = ({
  activeTab,
  currentSlide,
  totalSlides,
  userType,
  sizeClass,
  completionPercentage = 0,
  onClose,
  showProgress = false
}) => {
  const isCompact = sizeClass === 'xs' || sizeClass === 'sm';
  
  const getTabInfo = (tab: string) => {
    switch (tab) {
      case 'notes':
        return {
          icon: BookOpen,
          label: isCompact ? 'メモ' : 'プレゼンターメモ',
          color: panelTokens.tabColors.notes.primary
        };
      case 'reviews':
        return {
          icon: MessageSquare,
          label: isCompact ? 'レビュー' : 'レビュー・評価',
          color: panelTokens.tabColors.review.primary
        };
      case 'dashboard':
        return {
          icon: BarChart3,
          label: isCompact ? 'ダッシュボード' : 'レビューダッシュボード',
          color: panelTokens.tabColors.dashboard.primary
        };
      default:
        return {
          icon: MessageSquare,
          label: 'パネル',
          color: panelTokens.colors.text.primary
        };
    }
  };

  const tabInfo = getTabInfo(activeTab);
  const IconComponent = tabInfo.icon;

  return (
    <div 
      className={`${isCompact ? 'p-2' : 'p-4'} border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-slate-50`}
      style={{ 
        borderBottomColor: panelTokens.colors.border.light,
        background: `linear-gradient(to right, ${panelTokens.colors.background.secondary}, ${panelTokens.colors.background.accent})`
      }}
    >
      {/* メインヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center min-w-0 flex-1">
          <IconComponent 
            className={`${isCompact ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'} flex-shrink-0`}
            style={{ color: tabInfo.color }}
          />
          <h2 className={`${isCompact ? 'text-sm' : 'text-base'} font-semibold text-gray-800 truncate`}>
            {tabInfo.label}
          </h2>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isCompact ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'} flex-shrink-0 hover:bg-white/70 transition-all duration-200`}
            title="パネルを閉じる (ESC)"
          >
            <X className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
          </Button>
        )}
      </div>

      {/* ステータス情報 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            スライド {currentSlide}/{totalSlides}
          </Badge>
          {userType === "enterprise" && (
            <Badge variant="secondary" className="text-xs">
              閲覧専用
            </Badge>
          )}
        </div>
        
        {!isCompact && (
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString('ja-JP', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* 進捗表示 */}
      {showProgress && userType === "student" && (
        <div className={`${isCompact ? 'mt-2' : 'mt-3'} bg-white/60 rounded-md p-2 border border-white/50`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              {isCompact ? '進捗' : 'レビュー進捗'}
            </span>
            <span className="text-xs font-bold" style={{ color: tabInfo.color }}>
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-1.5" />
        </div>
      )}
    </div>
  );
};

export default EnhancedPanelHeader;
