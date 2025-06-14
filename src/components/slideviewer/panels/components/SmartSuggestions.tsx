
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Target,
  ChevronRight,
  Sparkles,
  Check,
  X
} from "lucide-react";

interface Suggestion {
  id: string;
  type: 'content' | 'design' | 'flow' | 'accessibility';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  estimatedTime: string;
}

interface SmartSuggestionsProps {
  currentSlide: number;
  onApplySuggestion: (suggestionId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  isVeryNarrow?: boolean;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  currentSlide,
  onApplySuggestion,
  onDismissSuggestion,
  isVeryNarrow = false
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const suggestions: Suggestion[] = [
    {
      id: '1',
      type: 'content',
      priority: 'high',
      title: 'テキストの可読性を改善',
      description: 'フォントサイズを大きくし、コントラストを向上させることで読みやすさが向上します',
      reason: '過去の類似スライドで85%の改善効果が見られました',
      confidence: 92,
      estimatedTime: '2分'
    },
    {
      id: '2',
      type: 'design',
      priority: 'medium',
      title: '視覚的階層の最適化',
      description: 'ヘッダーと本文の差別化を強化して情報の整理を改善',
      reason: 'ユーザーの視線追跡データに基づく提案',
      confidence: 78,
      estimatedTime: '5分'
    },
    {
      id: '3',
      type: 'flow',
      priority: 'low',
      title: 'アニメーション効果の追加',
      description: '要素の登場順序を制御してストーリーテリングを強化',
      reason: '発表効果の向上が期待できます',
      confidence: 65,
      estimatedTime: '10分'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return Target;
      case 'design': return Sparkles;
      case 'flow': return TrendingUp;
      case 'accessibility': return Users;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  if (isVeryNarrow) {
    return (
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-1">
          <Lightbulb className="h-3 w-3 text-orange-500" />
          <span className="text-xs font-medium">提案</span>
          <Badge variant="outline" className="text-xs">{suggestions.length}</Badge>
        </div>
        {suggestions.slice(0, 2).map((suggestion) => (
          <Card key={suggestion.id} className="border-l-4 border-l-orange-500">
            <CardContent className="p-2">
              <p className="text-xs font-medium truncate">{suggestion.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion.id)}
                  className="h-5 px-2 text-xs"
                >
                  適用
                </Button>
                <Badge variant="outline" className="text-xs">
                  {suggestion.confidence}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-800">AI提案</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          スライド {currentSlide}
        </Badge>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const TypeIcon = getTypeIcon(suggestion.type);
          const isExpanded = expandedSuggestion === suggestion.id;
          
          return (
            <Card 
              key={suggestion.id} 
              className={`border-l-4 transition-all duration-200 hover:shadow-sm ${
                getPriorityColor(suggestion.priority) === 'red' ? 'border-l-red-500' :
                getPriorityColor(suggestion.priority) === 'orange' ? 'border-l-orange-500' :
                'border-l-blue-500'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <TypeIcon className="h-4 w-4 mt-0.5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-medium text-gray-800 leading-tight">
                        {suggestion.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            getPriorityColor(suggestion.priority) === 'red' ? 'border-red-200 text-red-600' :
                            getPriorityColor(suggestion.priority) === 'orange' ? 'border-orange-200 text-orange-600' :
                            'border-blue-200 text-blue-600'
                          }`}
                        >
                          {suggestion.priority === 'high' ? '重要' : 
                           suggestion.priority === 'medium' ? '中' : '低'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          信頼度 {suggestion.confidence}%
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {suggestion.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3">
                  {suggestion.description}
                </p>
                
                {isExpanded && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-blue-800 mb-1">なぜこの提案？</h4>
                      <p className="text-xs text-blue-700">{suggestion.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion.id)}
                        className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        適用する
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDismissSuggestion(suggestion.id)}
                        className="h-7 px-3 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        却下
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-orange-600" />
          <span className="text-xs font-medium text-orange-800">改善ポテンシャル</span>
        </div>
        <div className="text-xs text-orange-700">
          これらの提案を適用することで、プレゼンテーションの効果が
          <span className="font-semibold"> 約25% </span>
          向上する可能性があります。
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
