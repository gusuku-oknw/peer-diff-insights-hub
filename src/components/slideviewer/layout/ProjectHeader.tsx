
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectHeaderProps {
  projectName?: string;
  projectAuthor?: string;
  lastModified?: string;
  collaborators?: number;
  totalSlides?: number;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName = "サンプルプレゼンテーション",
  projectAuthor = "田中太郎",
  lastModified = "5分前",
  collaborators = 3,
  totalSlides = 10
}) => {
  console.log("ProjectHeader rendering");
  
  // Always call hooks at the top level, never conditionally
  const isMobile = useIsMobile();

  console.log("ProjectHeader: isMobile =", isMobile);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Back button and project info */}
        <div className="flex items-center space-x-4 min-w-0">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200 text-blue-700">
                <ArrowLeft className="h-4 w-4" />
                <span className={isMobile ? "hidden" : ""}>ダッシュボード</span>
                {isMobile && <Home className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
          
          {!isMobile && (
            <>
              <div className="h-6 w-px bg-gray-300" />
              <div className="min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-gray-900 truncate">
                      {projectName}
                    </h1>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{projectAuthor}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{lastModified}に更新</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{totalSlides}枚</span>
                    </Badge>
                    {collaborators > 1 && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{collaborators}人</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile project name */}
        {isMobile && (
          <div className="ml-4 flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              {projectName}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
