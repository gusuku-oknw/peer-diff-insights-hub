
import { Button } from "@/components/ui/button";

interface AddElementButtonsProps {
  onAddText: () => void;
  onAddRect: () => void;
  onAddCircle: () => void;
}

const AddElementButtons = ({
  onAddText,
  onAddRect,
  onAddCircle
}: AddElementButtonsProps) => {
  return (
    <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-lg flex gap-2 flex-wrap">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onAddText}
        className="bg-white"
      >
        テキスト追加
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onAddRect}
        className="bg-white"
      >
        四角形追加
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onAddCircle}
        className="bg-white"
      >
        円追加
      </Button>
    </div>
  );
};

export default AddElementButtons;
