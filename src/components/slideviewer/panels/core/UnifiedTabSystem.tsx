
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, BarChart3, CheckCircle, Lightbulb } from "lucide-react";
import { panelTokens } from "@/design-system/tokens/panel";

interface TabConfig {
  id: string;
  label: string;
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
  const isCompact = sizeClass === 'xs' || sizeClass === 'sm';
  
  const tabConfigs: Record<string, TabConfig> = {
    notes: {
      id: 'notes',
      label: isCompact ? 'メモ' : 'プレゼンターメモ',
      icon: BookOpen,
      color: panelTokens.tabColors.notes.primary
    },
    reviews: {
      id: 'reviews',
      label: isCompact ? 'レビュー' : 'レビュー',
      icon: MessageSquare,
      color: panelTokens.tabColors.review.primary,
      badge: 3
    },
    dashboard: {
      id: 'dashboard',
      label: isCompact ? 'ダッシュ' : 'ダッシュボード',
      icon: BarChart3,
      color: panelTokens.tabColors.dashboard.primary
    },
    checklist: {
      id: 'checklist',
      label: isCompact ? 'チェック' : 'チェックリスト',
      icon: CheckCircle,
      color: panelTokens.tabColors.checklist.primary
    },
    suggestions: {
      id: 'suggestions',
      label: isCompact ? 'AI' : 'AI提案',
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

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={`${className}`}>
      <TabsList 
        className={`grid bg-gray-50 ${isCompact ? 'gap-0.5 p-1' : 'gap-1 p-1.5'}`}
        style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}
      >
        {visibleTabs.map((tabConfig) => {
          const IconComponent = tabConfig.icon;
          const isActive = activeTab === tabConfig.id;
          
          return (
            <TabsTrigger
              key={tabConfig.id}
              value={tabConfig.id}
              className={`flex items-center gap-1.5 transition-all duration-200 relative ${
                isCompact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
              } border border-transparent`}
              style={getTabStyle(tabConfig, isActive)}
              disabled={tabConfig.disabled}
            >
              <IconComponent 
                className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`}
              />
              {(!isCompact || isActive) && (
                <span className="truncate font-medium">
                  {tabConfig.label}
                </span>
              )}
              {tabConfig.badge && tabConfig.badge > 0 && (
                <span 
                  className={`${isCompact ? 'h-4 w-4 text-xs' : 'h-5 w-5 text-xs'} bg-red-500 text-white rounded-full flex items-center justify-center font-bold animate-pulse`}
                >
                  {tabConfig.badge}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default UnifiedTabSystem;
