
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitCommit, Clock, User, CheckCircle, AlertCircle, Circle } from "lucide-react";

interface CommitHistoryProps {
  commitHistory: Array<{
    id: string;
    message: string;
    author: string;
    date: string;
    reviewStatus: string;
  }>;
}

const CommitHistory: React.FC<CommitHistoryProps> = ({ commitHistory }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "reviewing":
        return <AlertCircle className="h-3 w-3 text-amber-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "reviewing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "承認済み";
      case "reviewing":
        return "レビュー中";
      default:
        return "未レビュー";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <GitCommit className="h-4 w-4 mr-2 text-blue-600" />
          最新のコミット
        </h3>
        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5">
          {commitHistory.length}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1 h-full">
        <div className="relative pb-2">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-gray-100"></div>
          
          <div className="space-y-2">
            {commitHistory.map((commit, index) => (
              <div key={commit.id} className="relative flex items-start space-x-3 group">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-2 h-2 rounded-full border transition-all duration-200 flex-shrink-0 mt-2 ${
                  index === 0 
                    ? 'bg-blue-500 border-blue-500 shadow-sm' 
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}>
                  {index === 0 && (
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  )}
                </div>

                {/* Compact commit content */}
                <div className={`flex-1 min-w-0 transition-all duration-200 ${
                  index === 0 ? 'transform scale-[1.02]' : 'group-hover:transform group-hover:scale-[1.01]'
                }`}>
                  <div className={`p-2.5 rounded-md border transition-all duration-200 ${
                    index === 0 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-gray-200 group-hover:border-blue-200 group-hover:shadow-sm'
                  }`}>
                    {/* Compact header with commit ID and status */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        <code className={`text-xs font-mono px-1.5 py-0.5 rounded transition-colors duration-200 flex-shrink-0 ${
                          index === 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-700'
                        }`}>
                          {commit.id.substring(0, 7)}
                        </code>
                        <div className="flex-shrink-0">
                          {getStatusIcon(commit.reviewStatus)}
                        </div>
                      </div>
                      
                      <Badge className={`text-xs border px-1.5 py-0.5 flex-shrink-0 ${getStatusColor(commit.reviewStatus)}`}>
                        {getStatusText(commit.reviewStatus)}
                      </Badge>
                    </div>

                    {/* Commit message */}
                    <p className={`text-sm font-medium mb-1.5 line-clamp-2 transition-colors duration-200 ${
                      index === 0 ? 'text-blue-900' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {commit.message}
                    </p>

                    {/* Compact author and timestamp */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center truncate">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{commit.author}</span>
                      </span>
                      <span className="flex items-center ml-2 flex-shrink-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {commit.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommitHistory;
