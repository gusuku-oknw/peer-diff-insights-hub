import React from "react";
import { useResizablePanels } from "@/hooks/useResizablePanels";

interface ResizablePanelProps {
    children: React.ReactNode;
    /** 初期サイズ(px)：verticalなら幅、horizontalなら高さ */
    initialWidth: number;
    /** 最小サイズ(px) */
    minWidth?: number;
    /** 最大サイズ(px) */
    maxWidth?: number;
    /** サイズ変更時コールバック */
    onWidthChange?: (width: number) => void;
    className?: string;
    /**
     * vertical = 左右パネル（幅を調整）
     * horizontal = 上下ストリップ（高さを調整）
     */
    orientation?: "vertical" | "horizontal";
    /**
     * ハンドルを置く位置
     * - 左右パネルなら "left" or "right"
     * - 上下ストリップなら "top" or "bottom"
     */
    resizePosition?: "left" | "right" | "top" | "bottom";
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
                                                                  children,
                                                                  initialWidth,
                                                                  minWidth = 200,
                                                                  maxWidth = 400,
                                                                  onWidthChange,
                                                                  className = "",
                                                                  orientation = "vertical",
                                                                  // 左パネルなら右端、上下ストリップなら上端にハンドル
                                                                  resizePosition = orientation === "vertical" ? "right" : "top",
                                                              }) => {
    // 1) hook はこれまでどおり「rawDelta」を返す
    const { width: rawSize, ResizeHandle } = useResizablePanels({
        initialWidth,
        minWidth,
        maxWidth,
        onWidthChange,
        orientation,
    });

    // 2) start-side handle（left/top）の場合だけ “反転” する
    const size =
        resizePosition === "left" || resizePosition === "top"
            ? // invert: size = initial*2 - raw
            initialWidth * 2 - rawSize
            : rawSize;

    // 3) orientation に応じて style を当てる
    const style =
        orientation === "vertical"
            ? { width: `${size}px` }   // 幅を変える
            : { height: `${size}px` }; // 高さを変える

    return (
        <div className={`relative ${className} overflow-hidden`} style={style}>
            {/* 左 or 上 のハンドル */}
            {(resizePosition === "left" || resizePosition === "top") && (
                <ResizeHandle
                    position={resizePosition}
                    className={
                        resizePosition === "left"
                            ? "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10"
                            : "absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10"
                    }
                />
            )}

            <div className="h-full w-full">{children}</div>

            {/* 右 or 下 のハンドル */}
            {(resizePosition === "right" || resizePosition === "bottom") && (
                <ResizeHandle
                    position={resizePosition}
                    className={
                        resizePosition === "right"
                            ? "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10"
                            : "absolute bottom-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 z-10"
                    }
                />
            )}
        </div>
    );
};
