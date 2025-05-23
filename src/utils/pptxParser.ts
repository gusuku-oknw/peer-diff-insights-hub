
import JSZip from 'jszip';
import { convert } from 'xml-js';
import { Slide, SlideElement } from '@/stores/slideStore';

// Function to parse PPTX file
export const parsePPTX = async (fileBuffer: ArrayBuffer): Promise<any[]> => {
  try {
    // Load the PPTX file using JSZip
    const zip = new JSZip();
    const pptxContent = await zip.loadAsync(fileBuffer);
    
    // Extract slides from the PPTX
    const slides: any[] = [];
    const slideFiles = Object.keys(pptxContent.files).filter(
      (fileName) => fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')
    );
    
    // Sort slide files by their number
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0');
      return numA - numB;
    });
    
    // Process each slide file
    for (const slideFile of slideFiles) {
      const content = await pptxContent.files[slideFile].async('text');
      const xmlData = convert(content, { compact: true, spaces: 2 });
      slides.push(xmlData);
    }
    
    return slides;
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    throw new Error('Failed to parse PPTX file');
  }
};

// Function to convert PPTX slide data to our app's slide format
export const convertPPTXToSlides = (pptxSlides: any[]): Slide[] => {
  return pptxSlides.map((pptxSlide, index) => {
    // Extract slide ID
    const slideId = index + 1;
    
    // Extract slide title if available
    let slideTitle = `スライド ${slideId}`;
    try {
      // This is a simplified example - actual extraction would be more complex
      const titleElement = pptxSlide?.['p:sld']?.['p:cSld']?.['p:spTree']?.['p:sp']?.find?.(
        (sp: any) => sp?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?._attributes?.type === 'title'
      );
      
      if (titleElement) {
        const titleText = titleElement?.['p:txBody']?.['a:p']?.['a:r']?.['a:t']?._text;
        if (titleText) {
          slideTitle = titleText;
        }
      }
    } catch (e) {
      console.error('Error extracting slide title:', e);
    }
    
    // Create slide elements
    const elements: SlideElement[] = [];
    
    // In a real implementation, you would parse the XML structure to extract text, shapes, and images
    // This is a placeholder that creates a simple text element
    elements.push({
      id: `imported-title-${slideId}`,
      type: 'text',
      props: {
        text: slideTitle,
        fontSize: 40,
        color: '#1e40af',
        fontFamily: 'Arial',
        fontWeight: 'bold',
      },
      position: { x: 800, y: 150 },
      size: { width: 600, height: 60 },
      angle: 0,
      zIndex: 1,
    });
    
    // Add a placeholder note
    const notes = "このスライドはPPTXファイルからインポートされました。";
    
    return {
      id: slideId,
      title: slideTitle,
      elements,
      notes,
      thumbnail: null,
    };
  });
};
