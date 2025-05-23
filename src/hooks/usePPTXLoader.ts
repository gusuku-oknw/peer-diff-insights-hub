
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parsePPTX, convertPPTXToSlides } from '@/utils/pptxParser';
import { useSlideStore } from '@/stores/slideStore';

export function usePPTXLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setSlides } = useSlideStore();
  
  const loadPPTXFile = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      
      // Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      
      // Parse PPTX file
      const pptxSlides = await parsePPTX(fileBuffer);
      
      // Convert to application's slide format
      const slides = convertPPTXToSlides(pptxSlides);
      
      // Update store
      setSlides(slides);
      
      toast({
        title: "プレゼンテーションが読み込まれました",
        description: `${slides.length}枚のスライドを読み込みました`,
      });
      
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
  }, [toast, setSlides]);
  
  return {
    loadPPTXFile,
    isLoading
  };
}
