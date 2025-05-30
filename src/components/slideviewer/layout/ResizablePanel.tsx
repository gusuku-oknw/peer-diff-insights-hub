import React from "react";
import { useResizablePanels } from "@/hooks/useResizablePanels";

interface ResizablePanelProps {
  children: React.ReactNode;
  /** 初期サイズ (px) */
  initialSize: number;
  /** サイズの最小値 (px) */
  minSize?: number;
  /** サイズの最大値 (px) */
  maxSize?: number;
  /** サイズ変更時コールバック */
  onSizeChange?: (size: number) => void;
  /** 追加クラス */
  className?: string;
  /** パネルの伸縮方向: vertical = 高さ, horizontal = 幅 */
  orientation?: "vertical" | "horizontal";
  /** リサイズハンドルの位置 */
  resizePosition?: "left" | "right" | "top" | "bottom";
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
                                                                children,
                                                                initialSize,
                                                                minSize = 200,
                                                                maxSize = 400,
                                                                onSizeChange,
                                                                className = "",
                                                                orientation = "vertical",
                                                                resizePosition = orientation === "vertical" ? "top" : "right",
                                                              }) => {
  // useResizablePanels 側も同じ prop 名に合わせて実装済みとします
  const { size, ResizeHandle } = useResizablePanels({
    initialSize,
    minSize,
    maxSize,
    onSizeChange,
    orientation,
  });

  // orientation に応じて style プロパティを切り替え
  const style =
      orientation === "vertical"
          ? { height: `${size}px` }
          : { width: `${size}px` };

  return (
      <div className={`relative ${className}`} style={style}>
        {(resizePosition === "left" || resizePosition === "top") && (
            <ResizeHandle
                className={
                  resizePosition === "left"
                      ? "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10"
                      : "absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10"
                }
                position={resizePosition}
            />
        )}

        <div className="h-full w-full overflow-auto">
          {children}
        </div>

        {(resizePosition === "right" || resizePosition === "bottom") && (
            <ResizeHandle
                className={
                  resizePosition === "right"
                      ? "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10"
                      : "absolute bottom-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10"
                }
                position={resizePosition}
            />
        )}
      </div>
  );
};
