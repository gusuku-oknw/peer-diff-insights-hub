
import React from "react";
import SlideViewerCore from "@/components/slideviewer/core/SlideViewerCore";
import ProjectHeader from "@/components/slideviewer/layout/ProjectHeader";

const SlideViewer: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <ProjectHeader />
      <div className="flex-1 min-h-0">
        <SlideViewerCore />
      </div>
    </div>
  );
};

export default SlideViewer;
