
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { usePPTXLoader } from "@/hooks/usePPTXLoader";

interface PPTXUploaderProps {
  onUploadComplete?: () => void;
}

const PPTXUploader = ({ onUploadComplete }: PPTXUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadPPTXFile, isLoading } = usePPTXLoader();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await loadPPTXFile(file);
    
    // Reset the input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pptx"
        className="hidden"
      />
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 whitespace-nowrap"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">PPTXをインポート</span>
        <span className="sm:hidden">PPTX</span>
      </Button>
    </div>
  );
};

export default PPTXUploader;
