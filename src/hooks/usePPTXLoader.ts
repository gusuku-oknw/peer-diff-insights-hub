
import { useState } from 'react';
import JSZip from 'jszip';
import { useSlideStore } from '@/stores/slide.store';
import type { Slide } from '@/types/slide.types';

interface PPTXLoaderState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

// Basic PPTX parsing function
const parsePPTXToSlides = async (zipFile: JSZip): Promise<Slide[]> => {
  const slides: Slide[] = [];
  
  try {
    // Extract slide files from the zip
    const slideFiles = Object.keys(zipFile.files).filter(
      filename => filename.startsWith('ppt/slides/slide') && filename.endsWith('.xml')
    );
    
    console.log('Found slide files:', slideFiles);
    
    for (let i = 0; i < slideFiles.length; i++) {
      const slideFile = zipFile.files[slideFiles[i]];
      if (slideFile) {
        const content = await slideFile.async('text');
        
        // Basic slide creation - in a real implementation, you'd parse the XML
        const slide: Slide = {
          id: i + 1,
          title: `スライド ${i + 1}`,
          elements: [],
          background: {
            type: 'color',
            value: '#ffffff'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        slides.push(slide);
      }
    }
    
    // If no slides found, create a default one
    if (slides.length === 0) {
      slides.push({
        id: 1,
        title: 'スライド 1',
        elements: [],
        background: {
          type: 'color',
          value: '#ffffff'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    throw new Error('PPTXファイルの解析に失敗しました');
  }
  
  return slides;
};

export const usePPTXLoader = () => {
  const [state, setState] = useState<PPTXLoaderState>({
    isLoading: false,
    error: null,
    progress: 0
  });

  const { importSlidesFromPPTX, setPPTXImported } = useSlideStore();

  const loadPPTX = async (file: File): Promise<void> => {
    setState({ isLoading: true, error: null, progress: 0 });

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      setState(prev => ({ ...prev, progress: 25 }));

      // Load with JSZip
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(arrayBuffer);
      setState(prev => ({ ...prev, progress: 50 }));

      // Parse slides from the zip file
      const slides = await parsePPTXToSlides(zipFile);
      setState(prev => ({ ...prev, progress: 75 }));

      // Import into store
      importSlidesFromPPTX(slides);
      setPPTXImported(true, file.name);

      setState(prev => ({ ...prev, progress: 100 }));
      
      // Clear loading state after a brief delay
      setTimeout(() => {
        setState({ isLoading: false, error: null, progress: 0 });
      }, 500);

    } catch (error) {
      console.error('PPTX loading error:', error);
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'PPTXファイルの読み込みに失敗しました',
        progress: 0
      });
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    loadPPTX,
    clearError
  };
};
