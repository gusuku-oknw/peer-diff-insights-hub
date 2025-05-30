
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Play, Pause, Save, Edit3, Eye, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptEditorProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  onUpdateScript: (slideId: number, script: string) => void;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({
  currentSlide,
  totalSlides,
  presenterNotes,
  onUpdateScript,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(presenterNotes[currentSlide] || "");
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Update edit text when slide changes
  useEffect(() => {
    setEditText(presenterNotes[currentSlide] || "");
    setIsEditing(false);
  }, [currentSlide, presenterNotes]);

  // Calculate estimated speaking time (average 150 words per minute)
  useEffect(() => {
    const wordCount = editText.trim().split(/\s+/).length;
    const timeInMinutes = wordCount / 150;
    setEstimatedTime(Math.ceil(timeInMinutes * 60)); // in seconds
  }, [editText]);

  const handleSave = () => {
    onUpdateScript(currentSlide, editText);
    setIsEditing(false);
    toast({
      title: "台本を保存しました",
      description: `スライド ${currentSlide} の台本が更新されました`,
    });
  };

  const handleCancel = () => {
    setEditText(presenterNotes[currentSlide] || "");
    setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "録音を停止しました" : "録音を開始しました",
      description: isRecording ? "練習音声を保存できます" : "台本の練習を録音中です",
    });
  };

  return (
    <div className="h-full bg-white shadow-sm flex flex-col min-w-0">
      {/* Header */}
      <div className={`${isVeryNarrow ? 'px-1 py-1' : 'px-4 py-3'} border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between flex-shrink-0`}>
        <h3 className={`font-medium ${isVeryNarrow ? 'text-xs' : 'text-sm'} flex items-center text-green-800 min-w-0`}>
          <Edit3 className={`${isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-green-600 flex-shrink-0`} />
          {!isVeryNarrow && <span className="truncate">台本編集</span>}
        </h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Clock className={`${isVeryNarrow ? 'h-2 w-2' : 'h-3 w-3'} text-green-600`} />
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-xs'} text-green-600 font-mono`}>
            {formatTime(estimatedTime)}
          </span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-grow min-h-0">
        <div className={`${isVeryNarrow ? 'p-1' : 'p-4'} flex flex-col h-full min-w-0`}>
          {/* Script content */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  スライド {currentSlide}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {estimatedTime}秒予想
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecording}
                  className={`h-6 w-6 p-0 ${isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                >
                  {isRecording ? <Pause className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0 hover:bg-green-100"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="h-6 w-6 p-0 hover:bg-green-100 text-green-600"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <Textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="このスライドの台本を入力してください..."
                className={`min-h-32 ${isVeryNarrow ? 'text-xs' : 'text-sm'} resize-none`}
                autoFocus
              />
            ) : (
              <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} rounded-lg border border-green-200 bg-green-50 min-h-32`}>
                {editText ? (
                  <p className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} leading-relaxed whitespace-pre-wrap text-green-900`}>
                    {editText}
                  </p>
                ) : (
                  <p className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-green-600 italic`}>
                    台本を入力するには編集ボタンをクリックしてください
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Speaking tips */}
          {!isVeryNarrow && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-xs font-medium text-blue-800 mb-2">発表のコツ</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 1分間に約150語のペースで話しましょう</li>
                <li>• 重要なポイントは間を置いて強調しましょう</li>
                <li>• 聴衆の反応を見ながら調整しましょう</li>
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScriptEditor;
