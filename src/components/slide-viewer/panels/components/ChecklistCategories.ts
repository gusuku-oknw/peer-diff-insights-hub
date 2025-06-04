
import { FileText, Palette, MessageSquare } from "lucide-react";

export const checklistCategories = {
  structure: {
    icon: FileText,
    label: "構成",
    color: "blue",
    items: [
      { id: "s1", text: "タイトルは明確で理解しやすいか", checked: false },
      { id: "s2", text: "内容の流れは論理的か", checked: false },
      { id: "s3", text: "重要なポイントが強調されているか", checked: false }
    ]
  },
  design: {
    icon: Palette,
    label: "デザイン",
    color: "green",
    items: [
      { id: "d1", text: "色使いは見やすく統一されているか", checked: false },
      { id: "d2", text: "フォントサイズは適切か", checked: false },
      { id: "d3", text: "レイアウトはバランスが取れているか", checked: false }
    ]
  },
  content: {
    icon: MessageSquare,
    label: "文言",
    color: "purple",
    items: [
      { id: "c1", text: "文章は簡潔で分かりやすいか", checked: false },
      { id: "c2", text: "専門用語の説明は十分か", checked: false },
      { id: "c3", text: "誤字脱字はないか", checked: false }
    ]
  }
};
