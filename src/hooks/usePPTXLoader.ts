
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parsePPTX, convertPPTXToSlides } from '@/utils/pptxParser';
import { convertPPTXWithPreview, PPTXSlideData } from '@/utils/pptxPreviewConverter';
import { useSlideStore } from '@/stores/slideStore';

// Convert pptx-preview slides to application format
function convertPPTXPreviewToSlides(pptxSlides: PPTXSlideData[]) {
  return pptxSlides.map((slide, index) => ({
    id: `slide-${slide.id}`,
    number: slide.id,
    title: `スライド ${slide.id}`,
    content: slide.html,
    notes: slide.notes || '',
    thumbnail: '', // Will be generated later
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export function usePPTXLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { importSlidesFromPPTX, setPPTXImported } = useSlideStore();
  
  const loadPPTXFile = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      
      // Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      
      // Try to parse PPTX file with pptx-preview first
      let slides;
      try {
        const pptxResult = await convertPPTXWithPreview(fileBuffer);
        slides = convertPPTXPreviewToSlides(pptxResult.slides);
        
        toast({
          title: "高品質変換完了",
          description: `pptx-preview.jsで${slides.length}枚のスライドを読み込みました`,
        });
      } catch (previewError) {
        console.warn('pptx-preview failed, falling back to original parser:', previewError);
        
        // Fallback to original parser
        const pptxSlides = await parsePPTX(fileBuffer);
        slides = convertPPTXToSlides(pptxSlides);
        
        toast({
          title: "フォールバック変換完了",
          description: `従来の方式で${slides.length}枚のスライドを読み込みました`,
        });
      }
      
      // Set the PPTX as imported with the filename
      setPPTXImported(true, file.name);
      
      // Update store with slides
      importSlidesFromPPTX(slides);
      
      return slides;
    } catch (error) {
      console.error('Error loading PPTX file:', error);
      toast({
        title: "エラー",
        description: "PPTXファイルの読み込みに失敗しました",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, importSlidesFromPPTX, setPPTXImported]);
  
  return {
    loadPPTXFile,
    isLoading
  };
}
