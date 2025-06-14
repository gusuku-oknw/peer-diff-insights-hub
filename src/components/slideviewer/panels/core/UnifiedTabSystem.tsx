
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, MessageSquare, BarChart3, CheckCircle, Lightbulb } from "lucide-react";
import { panelTokens } from "@/design-system/tokens/panel";

interface TabConfig {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  color: string;
  badge?: number;
  disabled?: boolean;
}

interface UnifiedTabSystemProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  availableTabs: string[];
  sizeClass: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const UnifiedTabSystem: React.FC<UnifiedTabSystemProps> = ({
  activeTab,
  onTabChange,
  availableTabs,
  sizeClass,
  className = ""
}) => {
  // パネルサイズに応じた表示モード
  const isIconOnly = sizeClass === 'xs';
  const isCompact = sizeClass === 'xs' || sizeClass === 'sm';
  
  const tabConfigs: Record<string, TabConfig> = {
    notes: {
      id: 'notes',
      label: 'プレゼンターメモ',
      shortLabel: 'メモ',
      icon: BookOpen,
      color: panelTokens.tabColors.notes.primary
    },
    reviews: {
      id: 'reviews',
      label: 'レビュー',
      shortLabel: 'レビュー',
      icon: MessageSquare,
      color: panelTokens.tabColors.review.primary,
      badge: 3
    },
    dashboard: {
      id: 'dashboard',
      label: 'ダッシュボード',
      shortLabel: 'ダッシュ',
      icon: BarChart3,
      color: panelTokens.tabColors.dashboard.primary
    },
    checklist: {
      id: 'checklist',
      label: 'チェックリスト',
      shortLabel: 'チェック',
      icon: CheckCircle,
      color: panelTokens.tabColors.checklist.primary
    },
    suggestions: {
      id: 'suggestions',
      label: 'AI提案',
      shortLabel: 'AI',
      icon: Lightbulb,
      color: panelTokens.colors.status.warning
    }
  };

  const visibleTabs = availableTabs
    .map(tabId => tabConfigs[tabId])
    .filter(Boolean);

  const getTabStyle = (tabConfig: TabConfig, isActive: boolean) => {
    if (isActive) {
      return {
        backgroundColor: `${tabConfig.color}15`,
        borderColor: `${tabConfig.color}40`,
        color: tabConfig.color
      };
    }
    return {};
  };

  const shouldShowText = (tabConfig: TabConfig) => {
    const isActive = activeTab === tabConfig.id;
    
    // アイコンオンリーモード：アクティブタブのみテキスト表示
    if (isIconOnly) {
      return isActive;
    }
    
    // コンパクトモード：アクティブタブのみテキスト表示
    if (isCompact) {
      return isActive;
    }
    
    // 通常モード：すべてのタブでテキスト表示
    return true;
  };

  const TabButton = ({ tabConfig }: { tabConfig: TabConfig }) => {
    const IconComponent = tabConfig.icon;
    const isActive = activeTab === tabConfig.id;
    const showText = shouldShowText(tabConfig);
    const needsTooltip = !showText && !isActive;

    const buttonContent = (
      <TabsTrigger
        value={tabConfig.id}
        className={`flex items-center transition-all duration-200 relative border border-transparent ${
          isIconOnly 
            ? 'px-2 py-2 min-w-[40px] justify-center' 
            : isCompact 
              ? 'px-2 py-1.5 text-xs gap-1.5' 
              : 'px-3 py-2 text-sm gap-2'
        }`}
        style={getTabStyle(tabConfig, isActive)}
        disabled={tabConfig.disabled}
      >
        <IconComponent 
          className={`flex-shrink-0 ${
            isIconOnly ? 'h-4 w-4' : isCompact ? 'h-3 w-3' : 'h-4 w-4'
          }`}
        />
        {showText && (
          <span className={`truncate font-medium transition-all duration-200 ${
            isActive ? 'opacity-100' : 'opacity-80'
          }`}>
            {isCompact ? tabConfig.shortLabel : tabConfig.label}
          </span>
        )}
        {tabConfig.badge && tabConfig.badge > 0 && (
          <span 
            className={`${
              isIconOnly ? 'absolute -top-1 -right-1 h-4 w-4 text-xs' : 'h-5 w-5 text-xs'
            } bg-red-500 text-white rounded-full flex items-center justify-center font-bold animate-pulse`}
          >
            {tabConfig.badge}
          </span>
        )}
      </TabsTrigger>
    );

    if (needsTooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-sm">
            {tabConfig.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonContent;
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
        <TabsList 
          className={`grid bg-gray-50 ${
            isIconOnly ? 'gap-0.5 p-0.5' : isCompact ? 'gap-0.5 p-1' : 'gap-1 p-1.5'
          }`}
          style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}
        >
          {visibleTabs.map((tabConfig) => (
            <TabButton key={tabConfig.id} tabConfig={tabConfig} />
          ))}
        </TabsList>
      </Tabs>
    </TooltipProvider>
  );
};

export default UnifiedTabSystem;
