
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Plus, 
  Send, 
  BookmarkPlus, 
  RotateCcw, 
  Share2,
  Lightbulb,
  CheckCheck,
  MessageSquare
} from "lucide-react";

interface QuickActionBarProps {
  canInteract: boolean;
  onAddComment: () => void;
  onSendReview: () => void;
  onBookmark: () => void;
  onUndo: () => void;
  onShare: () => void;
  onSuggest: () => void;
  onMarkComplete: () => void;
  onStartDiscussion: () => void;
  isVeryNarrow?: boolean;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({
  canInteract,
  onAddComment,
  onSendReview,
  onBookmark,
  onUndo,
  onShare,
  onSuggest,
  onMarkComplete,
  onStartDiscussion,
  isVeryNarrow = false
}) => {
  const actions = [
    {
      id: 'add',
      label: 'コメント追加',
      icon: Plus,
      onClick: onAddComment,
      variant: 'default' as const,
      shortcut: 'Ctrl+N',
      color: 'green'
    },
    {
      id: 'send',
      label: 'レビュー送信',
      icon: Send,
      onClick: onSendReview,
      variant: 'default' as const,
      shortcut: 'Ctrl+Enter',
      color: 'blue'
    },
    {
      id: 'bookmark',
      label: 'ブックマーク',
      icon: BookmarkPlus,
      onClick: onBookmark,
      variant: 'outline' as const,
      shortcut: 'Ctrl+B',
      color: 'purple'
    },
    {
      id: 'suggest',
      label: 'AI提案',
      icon: Lightbulb,
      onClick: onSuggest,
      variant: 'outline' as const,
      shortcut: 'Ctrl+I',
      color: 'orange'
    },
    {
      id: 'complete',
      label: '完了マーク',
      icon: CheckCheck,
      onClick: onMarkComplete,
      variant: 'outline' as const,
      shortcut: 'Ctrl+D',
      color: 'green'
    },
    {
      id: 'discuss',
      label: 'ディスカッション',
      icon: MessageSquare,
      onClick: onStartDiscussion,
      variant: 'outline' as const,
      shortcut: 'Ctrl+T',
      color: 'indigo'
    },
    {
      id: 'undo',
      label: '元に戻す',
      icon: RotateCcw,
      onClick: onUndo,
      variant: 'ghost' as const,
      shortcut: 'Ctrl+Z',
      color: 'gray'
    },
    {
      id: 'share',
      label: '共有',
      icon: Share2,
      onClick: onShare,
      variant: 'ghost' as const,
      shortcut: 'Ctrl+S',
      color: 'blue'
    }
  ];

  if (isVeryNarrow) {
    return (
      <div className="p-2 border-t border-gray-200">
        <div className="flex justify-center space-x-1">
          {actions.slice(0, 3).map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                disabled={!canInteract && action.id !== 'share'}
                className="h-7 w-7 p-0"
              >
                <Icon className="h-3 w-3" />
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
        {/* Primary Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2">
            {actions.slice(0, 2).map((action) => {
              const Icon = action.icon;
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={action.variant}
                      size="sm"
                      onClick={action.onClick}
                      disabled={!canInteract}
                      className={`h-8 px-3 text-xs transition-all duration-200 hover:scale-105 ${
                        action.color === 'green' ? 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700' :
                        action.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' :
                        ''
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {action.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label} ({action.shortcut})</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {!canInteract && (
            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
              閲覧専用
            </div>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-1">
          {actions.slice(2, 8).map((action) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={action.variant}
                    size="sm"
                    onClick={action.onClick}
                    disabled={!canInteract && action.id !== 'share'}
                    className={`h-7 px-2 text-xs transition-all duration-200 hover:scale-105 ${
                      action.color === 'purple' ? 'hover:bg-purple-50 hover:text-purple-700' :
                      action.color === 'orange' ? 'hover:bg-orange-50 hover:text-orange-700' :
                      action.color === 'green' ? 'hover:bg-green-50 hover:text-green-700' :
                      action.color === 'indigo' ? 'hover:bg-indigo-50 hover:text-indigo-700' :
                      action.color === 'gray' ? 'hover:bg-gray-50 hover:text-gray-700' :
                      'hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    <span className="truncate">{action.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label} ({action.shortcut})</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QuickActionBar;
