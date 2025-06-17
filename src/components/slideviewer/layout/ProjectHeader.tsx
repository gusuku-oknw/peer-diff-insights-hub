
import React from "react";

const ProjectHeader: React.FC = () => {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-900">スライドビューア</h1>
      </div>
    </div>
  );
};

export default ProjectHeader;
