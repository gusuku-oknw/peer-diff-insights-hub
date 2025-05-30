
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Palette, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReviewChecklistTabsProps {
  currentSlide: number;
  onSubmitComment: (comment: string, category: string) => void;
  userType: "student" | "enterprise";
}

const checklistCategories = {
  structure: {
    icon: FileText,
    label: "構成",
    color: "blue",
    items: [
      "タイトルは明確で理解しやすいか",
      "内容の流れは論理的か",
      "重要なポイントが強調されているか",
      "情報量は適切か（多すぎず少なすぎず）"
    ]
  },
  design: {
    icon: Palette,
    label: "デザイン",
    color: "green",
    items: [
      "色使いは見やすく統一されているか",
      "フォントサイズは適切か",
      "レイアウトはバランスが取れているか",
      "図表やグラフは分かりやすいか"
    ]
  },
  content: {
    icon: MessageSquare,
    label: "文言",
    color: "purple",
    items: [
      "文章は簡潔で分かりやすいか",
      "専門用語の説明は十分か",
      "誤字脱字はないか",
      "表現は聞き手に配慮されているか"
    ]
  }
};

const ReviewChecklistTabs = ({ 
  currentSlide, 
  onSubmitComment, 
  userType 
}: ReviewChecklistTabsProps) => {
  const [activeTab, setActiveTab] = useState("structure");
  const [comments, setComments] = useState({
    structure: "",
    design: "",
    content: ""
  });
  const { toast } = useToast();

  console.log('ReviewChecklistTabs render:', { activeTab, currentSlide, userType });

  const handleCommentChange = (category: string, value: string) => {
    console.log('ReviewChecklistTabs: Comment change', { category, value });
    setComments(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (category: string) => {
    const comment = comments[category as keyof typeof comments];
    console.log('ReviewChecklistTabs: Submit called', { category, comment, userType });
    
    if (!comment.trim()) {
      console.log('ReviewChecklistTabs: Empty comment, not submitting');
      return;
    }

    if (userType === "enterprise") {
      console.log('ReviewChecklistTabs: Enterprise user blocked from submitting');
      toast({
        title: "権限がありません",
        description: "企業ユーザーはコメントの投稿はできません",
        variant: "destructive"
      });
      return;
    }

    console.log('ReviewChecklistTabs: Calling onSubmitComment');
    onSubmitComment(comment, category);
    setComments(prev => ({ ...prev, [category]: "" }));
    
    toast({
      title: "コメントを投稿しました",
      description: `${checklistCategories[category as keyof typeof checklistCategories].label}の観点でコメントを投稿しました`,
      variant: "default"
    });
  };

  const handleTabChange = (newTab: string) => {
    console.log('ReviewChecklistTabs: Tab change', { from: activeTab, to: newTab });
    setActiveTab(newTab);
  };

  const canInteract = userType === "student";

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
        <TabsList className="grid grid-cols-3 w-full bg-gray-50 p-1">
          {Object.entries(checklistCategories).map(([key, category]) => {
            const Icon = category.icon;
            const hasComment = comments[key as keyof typeof comments].length > 0;
            
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={`flex items-center gap-1 relative data-[state=active]:bg-${category.color}-100 data-[state=active]:text-${category.color}-700`}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs font-medium">{category.label}</span>
                {hasComment && (
                  <Badge className={`bg-${category.color}-500 h-2 w-2 p-0 rounded-full`} />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(checklistCategories).map(([key, category]) => {
          const Icon = category.icon;
          
          return (
            <TabsContent key={key} value={key} className="flex-grow p-4 space-y-4 overflow-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 text-${category.color}-600`} />
                  <h3 className="font-medium text-gray-800">{category.label}の観点</h3>
                </div>
                
                {/* Checklist items */}
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Comment input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {category.label}に関するコメント:
                  </label>
                  <Textarea
                    placeholder={`${category.label}の観点から気づいた点やアドバイスを入力してください...`}
                    value={comments[key as keyof typeof comments]}
                    onChange={(e) => handleCommentChange(key, e.target.value)}
                    className="min-h-20 text-sm"
                    disabled={!canInteract}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      上記のチェックポイントを参考にしてください
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSubmit(key)}
                      disabled={!comments[key as keyof typeof comments].trim() || !canInteract}
                      className={`bg-${category.color}-500 hover:bg-${category.color}-600 text-white`}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      投稿
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ReviewChecklistTabs;
