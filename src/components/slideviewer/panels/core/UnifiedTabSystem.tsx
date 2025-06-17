
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
        backgroundColor: `${tabConfig.color}20`,
        borderColor: `${tabConfig.color}60`,
        color: tabConfig.color,
        transform: 'scale(1.02)',
        boxShadow: `0 2px 8px ${tabConfig.color}25`
      };
    }
    return {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: panelTokens.colors.text.secondary
    };
  };

  // テキストは選択されたタブのみ表示
  const shouldShowText = (tabConfig: TabConfig) => {
    return activeTab === tabConfig.id;
  };

  const TabButton = ({ tabConfig }: { tabConfig: TabConfig }) => {
    const IconComponent = tabConfig.icon;
    const isActive = activeTab === tabConfig.id;
    const showText = shouldShowText(tabConfig);
    const needsTooltip = !showText;

    const buttonContent = (
      <TabsTrigger
        value={tabConfig.id}
        className={`flex items-center transition-all duration-300 ease-out relative border ${
          showText 
            ? 'px-3 py-2 gap-2 min-w-fit' 
            : 'px-2.5 py-2 min-w-[44px] justify-center'
        } rounded-lg hover:scale-105`}
        style={getTabStyle(tabConfig, isActive)}
        disabled={tabConfig.disabled}
      >
        <IconComponent 
          className={`flex-shrink-0 transition-all duration-300 ${
            isActive ? 'h-4 w-4' : 'h-4 w-4'
          }`}
        />
        {showText && (
          <span className="truncate font-medium transition-all duration-300 ease-out transform">
            {sizeClass === 'xs' || sizeClass === 'sm' ? tabConfig.shortLabel : tabConfig.label}
          </span>
        )}
        {tabConfig.badge && tabConfig.badge > 0 && (
          <span 
            className={`${
              showText 
                ? 'h-5 w-5 text-xs ml-1' 
                : 'absolute -top-1 -right-1 h-4 w-4 text-xs'
            } bg-red-500 text-white rounded-full flex items-center justify-center font-bold animate-pulse transition-all duration-300`}
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
          <TooltipContent side="bottom" className="text-sm font-medium">
            {tabConfig.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonContent;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
        <TabsList 
          className={`grid bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 ${
            sizeClass === 'xs' ? 'gap-1 p-1' : 'gap-1.5 p-1.5'
          } rounded-xl shadow-sm`}
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
