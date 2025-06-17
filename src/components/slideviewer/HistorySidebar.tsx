
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, History, GitBranch, GitCommit } from "lucide-react";

export interface CommitHistory {
  id: string;
  message: string;
  author: string;
  date: string;
  reviewStatus: "approved" | "reviewing" | "pending";
}

interface HistorySidebarProps {
  currentBranch: string;
  branches: string[];
  commitHistory: CommitHistory[];
  onBranchChange: (branch: string) => void;
  onClose: () => void;
}

const HistorySidebar = ({
  currentBranch,
  branches,
  commitHistory,
  onBranchChange,
  onClose
}: HistorySidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium flex items-center text-blue-800">
          <History className="h-4 w-4 mr-2 text-blue-600" />
          スライド履歴
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 rounded-full hover:bg-gray-200">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <Tabs defaultValue="branches" className="h-full flex flex-col">
          <TabsList className="w-full grid grid-cols-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
            <TabsTrigger value="branches" className="text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <GitBranch className="h-4 w-4 mr-1" />
              ブランチ
            </TabsTrigger>
            <TabsTrigger value="commits" className="text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <GitCommit className="h-4 w-4 mr-1" />
              コミット
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="branches" className="flex-grow overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                <h4 className="text-sm font-medium flex items-center text-blue-800">
                  <GitBranch className="h-4 w-4 mr-2 text-blue-600" />
                  現在のブランチ
                </h4>
                <p className="mt-1 font-bold text-blue-700">{currentBranch}</p>
              </div>
            </div>
            <ScrollArea className="flex-grow h-[calc(100%-5rem)]" orientation="vertical">
              <div className="p-3 space-y-1">
                {branches.map(branch => (
                  <div 
                    key={branch} 
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center transition-colors ${branch === currentBranch ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}`} 
                    onClick={() => onBranchChange(branch)}
                  >
                    <GitBranch className={`h-4 w-4 mr-2 ${branch === currentBranch ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span className="text-sm">{branch}</span>
                    {branch === currentBranch && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        現在
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="commits" className="flex-grow overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium flex items-center text-blue-800">
                <GitCommit className="h-4 w-4 mr-2 text-blue-600" />
                コミット履歴
              </h4>
            </div>
            <ScrollArea className="flex-grow h-[calc(100%-5rem)]" orientation="vertical">
              <div className="p-3 space-y-2">
                {commitHistory.map((commit, index) => (
                  <div 
                    key={commit.id} 
                    className={`p-3 border rounded-md hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50 border-blue-100' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {commit.id.substring(0, 7)}
                      </span>
                      <span className="text-xs text-gray-500">{commit.date}</span>
                    </div>
                    <p className={`text-sm font-medium mb-1 ${index === 0 ? 'text-blue-800' : ''}`}>
                      {commit.message}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">作成者: {commit.author}</span>
                      <Badge 
                        variant="secondary" 
                        className={
                          commit.reviewStatus === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : commit.reviewStatus === "reviewing" 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {
                          commit.reviewStatus === "approved" 
                            ? "レビュー済" 
                            : commit.reviewStatus === "reviewing" 
                              ? "レビュー中" 
                              : "未レビュー"
                        }
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HistorySidebar;
