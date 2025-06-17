import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { parseXMLToSlides } from '@/utils/pptxParser';
import { convertPPTXToHTML } from '@/utils/pptxToHtml';
import { useSlideStore } from '@/stores/slide.store'; // Fix import path
import type { Slide } from '@/types/slide.types';

interface PPTXLoaderResult {
  loading: boolean;
  error: Error | null;
  loadPPTX: (file: File) => Promise<void>;
}

/**
 * Custom hook for loading and parsing PPTX files.
 * @returns {PPTXLoaderResult} An object containing the loading state, error, and a function to load a PPTX file.
 */
export const usePPTXLoader = (): PPTXLoaderResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setSlides = useSlideStore(state => state.setSlides);
  const setPPTXImported = useSlideStore(state => state.setPPTXImported);
  const importSlidesFromPPTX = useSlideStore(state => state.importSlidesFromPPTX);

  /**
   * Loads and parses a PPTX file, then updates the slide store.
   * @param {File} file The PPTX file to load.
   */
  const loadPPTX = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const zip = new JSZip();
      const pptx = await zip.loadAsync(file);
      const slidesData = await parseXMLToSlides(pptx);
      
      // Convert PPTX content to HTML
      const htmlSlides = await convertPPTXToHTML(pptx);
      
      // Merge HTML content into slidesData
      const slidesWithHtml = slidesData.map((slide, index) => ({
        ...slide,
        html: htmlSlides[index] || '', // Assign corresponding HTML or empty string
      }));

      // Update the slide store with the parsed slides and HTML content
      importSlidesFromPPTX(slidesWithHtml);
      setPPTXImported(true, file.name);
    } catch (err: any) {
      console.error("Error loading or parsing PPTX file:", err);
      setError(err instanceof Error ? err : new Error(err.message || "Failed to load PPTX file"));
      setPPTXImported(false);
    } finally {
      setLoading(false);
    }
  }, [setSlides, setPPTXImported, importSlidesFromPPTX]);

  return { loading, error, loadPPTX };
};
