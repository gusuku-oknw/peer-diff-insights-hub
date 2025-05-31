
import React from "react";
import SplitPane from "react-split-pane";

interface SplitPaneLayoutProps {
  firstPane: React.ReactElement;
  secondPane: React.ReactElement;
  split: "vertical" | "horizontal";
  primary?: "first" | "second";
  minSize: number;
  maxSize?: number;
  defaultSize: number | string;
  size: number | string;
  onDragFinished: (size: number) => void;
  allowResize: boolean;
  resizerStyle: React.CSSProperties | { display: string };
}

export const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
  firstPane,
  secondPane,
  split,
  primary,
  minSize,
  maxSize,
  defaultSize,
  size,
  onDragFinished,
  allowResize,
  resizerStyle,
}) => {
  return (
    <SplitPane
      split={split}
      primary={primary}
      minSize={minSize}
      maxSize={maxSize}
      defaultSize={defaultSize}
      size={size}
      onDragFinished={onDragFinished}
      allowResize={allowResize}
      resizerStyle={resizerStyle}
    >
      {firstPane}
      {secondPane}
    </SplitPane>
  );
};
