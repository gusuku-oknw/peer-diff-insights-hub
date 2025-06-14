
import React from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Copy, Trash2, MoveUp, MoveDown, RotateCw, Square, Palette } from 'lucide-react';

interface CanvasContextMenuProps {
  children: React.ReactNode;
  selectedObject: any;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDuplicate: () => void;
  onRotate: () => void;
  hasClipboard: boolean;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  children,
  selectedObject,
  onCopy,
  onPaste,
  onDelete,
  onBringToFront,
  onSendToBack,
  onDuplicate,
  onRotate,
  hasClipboard
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {selectedObject ? (
          <>
            <ContextMenuItem onClick={onCopy} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              コピー
              <span className="ml-auto text-xs text-gray-500">Ctrl+C</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={onDuplicate} className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              複製
              <span className="ml-auto text-xs text-gray-500">Ctrl+D</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onRotate} className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              90度回転
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onBringToFront} className="flex items-center gap-2">
              <MoveUp className="h-4 w-4" />
              最前面へ
            </ContextMenuItem>
            <ContextMenuItem onClick={onSendToBack} className="flex items-center gap-2">
              <MoveDown className="h-4 w-4" />
              最背面へ
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDelete} className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              削除
              <span className="ml-auto text-xs text-gray-400">Del</span>
            </ContextMenuItem>
          </>
        ) : (
          <>
            {hasClipboard && (
              <>
                <ContextMenuItem onClick={onPaste} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  貼り付け
                  <span className="ml-auto text-xs text-gray-500">Ctrl+V</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem disabled className="flex items-center gap-2 text-gray-400">
              <Palette className="h-4 w-4" />
              要素を選択してください
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CanvasContextMenu;
