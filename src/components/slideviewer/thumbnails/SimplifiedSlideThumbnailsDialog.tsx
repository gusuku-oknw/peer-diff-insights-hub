
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface SimplifiedSlideThumbnailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  isTablet: boolean;
  children: React.ReactNode;
}

const SimplifiedSlideThumbnailsDialog = ({
  isOpen,
  onClose,
  isMobile,
  isTablet,
  children
}: SimplifiedSlideThumbnailsDialogProps) => {
  const getOptimalHeight = () => {
    if (isMobile) return 'h-[95vh]';
    if (isTablet) return 'h-[90vh]';
    return 'h-[85vh]';
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className={`${getOptimalHeight()} max-h-[95vh]`}>
          <DrawerHeader className="sr-only">
            <DrawerTitle>スライド一覧</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl ${getOptimalHeight()} max-h-[85vh] p-0`}>
        <DialogHeader className="sr-only">
          <DialogTitle>スライド一覧</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedSlideThumbnailsDialog;
