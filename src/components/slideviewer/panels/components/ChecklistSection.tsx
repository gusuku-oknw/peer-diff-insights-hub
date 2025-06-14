
import React from "react";
import ReviewChecklistPanel from "./ReviewChecklistPanel";

interface ChecklistSectionProps {
  checklistState: any;
  onCheckboxChange: (categoryKey: string, itemId: string, checked: boolean) => void;
  checklistCategories: any;
  canInteract: boolean;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  checklistState,
  onCheckboxChange,
  checklistCategories,
  canInteract
}) => {
  return (
    <div className="h-full overflow-hidden">
      <ReviewChecklistPanel
        checklistState={checklistState}
        onCheckboxChange={onCheckboxChange}
        checklistCategories={checklistCategories}
        canInteract={canInteract}
      />
    </div>
  );
};

export default ChecklistSection;
