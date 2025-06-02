
import { Pencil } from "lucide-react";

const EditModeIndicator = () => {
  return (
    <div className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
      <Pencil className="h-3 w-3" />
      編集モード
    </div>
  );
};

export default EditModeIndicator;
