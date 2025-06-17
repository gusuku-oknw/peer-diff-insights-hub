
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">コミット履歴</h3>
      <ScrollArea className="h-32">
        <div className="space-y-2">
          {commitHistory.map((commit) => (
            <div key={commit.id} className="p-2 bg-white rounded border border-gray-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-blue-600">{commit.id.substring(0, 7)}</span>
                <Badge 
                  variant={commit.reviewStatus === "approved" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {commit.reviewStatus === "approved" ? "承認済み" : "レビュー中"}
                </Badge>
              </div>
              <p className="text-gray-800 mb-1">{commit.message}</p>
              <div className="text-gray-500">
                {commit.author} • {commit.date}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommitHistory;
