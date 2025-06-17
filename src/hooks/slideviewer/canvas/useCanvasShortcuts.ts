
import { useEffect, useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCanvasShortcutsProps {
  canvas: Canvas | null;
  editable: boolean;
  onAddText: () => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onDeleteSelected: () => void;
  onCopySelected: () => void;
  onPasteSelected: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const useCanvasShortcuts = ({
  canvas,
  editable,
  onAddText,
  onAddRectangle,
  onAddCircle,
  onDeleteSelected,
  onCopySelected,
  onPasteSelected,
  onUndo,
  onRedo
}: UseCanvasShortcutsProps) => {

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!editable || !canvas) return;

    // Prevent shortcuts when typing in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;

    // Handle shortcuts
    if (isCtrl) {
      switch (e.key.toLowerCase()) {
        case 't':
          e.preventDefault();
          onAddText();
          break;
        case 'r':
          e.preventDefault();
          onAddRectangle();
          break;
        case 'o':
          e.preventDefault();
          onAddCircle();
          break;
        case 'c':
          e.preventDefault();
          onCopySelected();
          break;
        case 'v':
          e.preventDefault();
          onPasteSelected();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey && onRedo) {
            onRedo();
          } else if (onUndo) {
            onUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          if (onRedo) {
            onRedo();
          }
          break;
        case 'd':
          e.preventDefault();
          // Duplicate selected object
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            // Use async clone for Fabric.js v6
            activeObject.clone().then((cloned: any) => {
              cloned.set({
                left: activeObject.left! + 10,
                top: activeObject.top! + 10,
              });
              canvas.add(cloned);
              canvas.setActiveObject(cloned);
              canvas.renderAll();
            }).catch((error: any) => {
              console.error('Error duplicating object:', error);
            });
          }
          break;
      }
    } else {
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onDeleteSelected();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          moveSelectedObject(e.key);
          break;
      }
    }
  }, [canvas, editable, onAddText, onAddRectangle, onAddCircle, onDeleteSelected, onCopySelected, onPasteSelected, onUndo, onRedo]);

  const moveSelectedObject = useCallback((direction: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const step = 1;
    let newLeft = activeObject.left!;
    let newTop = activeObject.top!;

    switch (direction) {
      case 'ArrowUp':
        newTop -= step;
        break;
      case 'ArrowDown':
        newTop += step;
        break;
      case 'ArrowLeft':
        newLeft -= step;
        break;
      case 'ArrowRight':
        newLeft += step;
        break;
    }

    activeObject.set({ left: newLeft, top: newTop });
    canvas.renderAll();
  }, [canvas]);

  useEffect(() => {
    if (!editable) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, editable]);

  return {
    moveSelectedObject
  };
};
