
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Keyboard, X } from 'lucide-react';

const CanvasShortcutsGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { category: "要素追加", items: [
      { key: "Ctrl + T", description: "テキストを追加" },
      { key: "Ctrl + R", description: "四角形を追加" },
      { key: "Ctrl + O", description: "円を追加" }
    ]},
    { category: "編集", items: [
      { key: "Ctrl + C", description: "コピー" },
      { key: "Ctrl + V", description: "貼り付け" },
      { key: "Ctrl + D", description: "複製" },
      { key: "Del / Backspace", description: "削除" }
    ]},
    { category: "元に戻す", items: [
      { key: "Ctrl + Z", description: "元に戻す" },
      { key: "Ctrl + Y", description: "やり直し" },
      { key: "Ctrl + Shift + Z", description: "やり直し" }
    ]},
    { category: "移動", items: [
      { key: "矢印キー", description: "選択要素を1pxずつ移動" },
      { key: "右クリック", description: "コンテキストメニューを表示" }
    ]}
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="ショートカットキー一覧"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            ショートカットキー一覧
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-medium text-sm text-gray-700 mb-2">{category.category}</h3>
              <div className="space-y-1">
                {category.items.map((shortcut) => (
                  <div key={shortcut.key} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanvasShortcutsGuide;
