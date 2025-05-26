
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ReviewChecklistPanelProps {
  checklistState: Record<string, ChecklistItem[]>;
  onCheckboxChange: (categoryKey: string, itemId: string, checked: boolean) => void;
  checklistCategories: any;
  canInteract: boolean;
}

const ReviewChecklistPanel: React.FC<ReviewChecklistPanelProps> = ({
  checklistState,
  onCheckboxChange,
  checklistCategories,
  canInteract
}) => {
  const getCompletionRate = (categoryKey: string) => {
    const items = checklistState[categoryKey] || [];
    const completed = items.filter(item => item.checked).length;
    return Math.round((completed / items.length) * 100);
  };

  const handleCheckboxChange = (categoryKey: string, itemId: string, checked: boolean, event?: any) => {
    console.log('ReviewChecklistPanel: Enhanced checkbox change triggered', { 
      categoryKey, 
      itemId, 
      checked, 
      canInteract,
      eventType: event?.type
    });
    
    if (!canInteract) {
      console.log('ReviewChecklistPanel: Interaction blocked - user cannot interact');
      return;
    }
    
    // Stop event propagation to prevent unwanted side effects
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Call the parent handler - this should NOT cause tab transitions
    console.log('ReviewChecklistPanel: Calling onCheckboxChange with isolated event');
    onCheckboxChange(categoryKey, itemId, checked);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pr-4">
        {Object.entries(checklistCategories).map(([key, category]: [string, any]) => {
          const Icon = category.icon;
          const completionRate = getCompletionRate(key);
          const items = checklistState[key] || [];
          
          return (
            <Card key={key} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-${category.color}-600`} />
                    <h4 className="font-medium text-gray-800">{category.label}</h4>
                  </div>
                  <Badge variant={completionRate === 100 ? "default" : "secondary"} className="text-xs">
                    {completionRate}%
                  </Badge>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) => {
                          console.log('ReviewChecklistPanel: Checkbox onCheckedChange triggered', { 
                            itemId: item.id, 
                            checked, 
                            categoryKey: key 
                          });
                          handleCheckboxChange(key, item.id, !!checked);
                        }}
                        onClick={(e) => {
                          console.log('ReviewChecklistPanel: Checkbox onClick triggered', { 
                            itemId: item.id, 
                            categoryKey: key 
                          });
                          e.stopPropagation();
                        }}
                        className="mt-0.5 flex-shrink-0"
                        disabled={!canInteract}
                      />
                      <label 
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${
                          item.checked 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-700'
                        }`}
                        onClick={(e) => {
                          console.log('ReviewChecklistPanel: Label onClick triggered', { 
                            itemId: item.id, 
                            categoryKey: key 
                          });
                          e.preventDefault();
                          e.stopPropagation();
                          if (canInteract) {
                            handleCheckboxChange(key, item.id, !item.checked, e);
                          }
                        }}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ReviewChecklistPanel;
