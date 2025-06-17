
import React from "react";

interface CommitHistoryProps {
  commitHistory: any[];
}

const CommitHistory: React.FC<CommitHistoryProps> = ({ commitHistory }) => {
  return (
    <div className="space-y-2">
      {commitHistory.map((commit, index) => (
        <div key={index} className="p-2 bg-white rounded border border-gray-100">
          <div className="text-xs text-gray-600">{commit.message || "コミット情報"}</div>
        </div>
      ))}
    </div>
  );
};

export default CommitHistory;
