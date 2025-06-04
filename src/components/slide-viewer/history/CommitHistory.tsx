
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "reviewing":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <GitCommit className="h-4 w-4 mr-2 text-blue-600" />
          コミット履歴
        </h3>
        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
          {commitHistory.length} コミット
        </Badge>
      </div>
      
      <ScrollArea className="h-40">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-gray-100"></div>
          
          <div className="space-y-4 pb-2">
            {commitHistory.map((commit, index) => (
              <div key={commit.id} className="relative flex items-start space-x-4 group">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  index === 0 
                    ? 'bg-blue-500 border-blue-500 shadow-md' 
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
                }`}>
                  {index === 0 && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>

                {/* Commit content */}
                <div className={`flex-1 min-w-0 transition-all duration-200 ${
                  index === 0 ? 'transform scale-105' : 'group-hover:transform group-hover:scale-102'
                }`}>
                  <div className={`p-3 rounded-lg border transition-all duration-200 ${
                    index === 0 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-gray-200 group-hover:border-blue-200 group-hover:shadow-sm'
                  }`}>
                    {/* Header with commit ID and status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <code className={`text-xs font-mono px-2 py-1 rounded transition-colors duration-200 ${
                          index === 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-700'
                        }`}>
                          {commit.id.substring(0, 7)}
                        </code>
                        {getStatusIcon(commit.reviewStatus)}
                      </div>
                      
                      <Badge className={`text-xs border ${getStatusColor(commit.reviewStatus)}`}>
                        {getStatusText(commit.reviewStatus)}
                      </Badge>
                    </div>

                    {/* Commit message */}
                    <p className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                      index === 0 ? 'text-blue-900' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {commit.message}
                    </p>

                    {/* Author and timestamp */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {commit.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {commit.date}
                        </span>
                      </div>
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
