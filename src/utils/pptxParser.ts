
import JSZip from 'jszip';
import { xml2js, js2xml } from 'xml-js';
import { Slide, SlideElement } from '@/stores/slideStore';

// Parse PPTX file and extract slides
export async function parsePPTX(fileBuffer: ArrayBuffer): Promise<any[]> {
  try {
    // Load the PPTX file as a zip
    const zip = new JSZip();
    const pptxZip = await zip.loadAsync(fileBuffer);
    
    // Extract slides from the PPTX
    const slides: any[] = [];
    const slidesDir = 'ppt/slides/';
    
    // Get all slide XML files
    const slideFiles = Object.keys(pptxZip.files).filter(
      (fileName) => fileName.startsWith(slidesDir) && fileName.endsWith('.xml')
    );
    
    // Sort slide files by number
    slideFiles.sort((a, b) => {
      const aNum = parseInt(a.replace(slidesDir + 'slide', '').replace('.xml', ''));
      const bNum = parseInt(b.replace(slidesDir + 'slide', '').replace('.xml', ''));
      return aNum - bNum;
    });
    
    // Process each slide
    for (let i = 0; i < slideFiles.length; i++) {
      const slideFile = slideFiles[i];
      const slideContent = await pptxZip.files[slideFile].async('text');
      
      // Convert XML to JS object
      const slideObj = xml2js(slideContent, { compact: true });
      
      // Extract slide ID
      const slideId = i + 1;
      
      // Add slide to array
      slides.push({
        id: slideId,
        content: slideObj,
        raw: slideContent
      });
    }
    
    console.log("Parsed PPTX slides:", slides.length);
    return slides;
    
  } catch (error) {
    console.error("Error parsing PPTX file:", error);
    throw new Error("Failed to parse PPTX file");
  }
}

// Convert parsed PPTX slides to our application's slide format
export function convertPPTXToSlides(pptxSlides: any[]): Slide[] {
  try {
    // Convert PPTX slides to application slides
    const appSlides: Slide[] = pptxSlides.map((pptxSlide, index) => {
      // Extract elements from the slide
      const elements: SlideElement[] = extractElementsFromSlide(pptxSlide);
      
      // Create slide object
      return {
        id: index + 1,
        title: `Imported Slide ${index + 1}`,
        elements: elements,
        notes: extractNotesFromSlide(pptxSlide) || "",
        thumbnail: ""
      };
    });
    
    return appSlides;
  } catch (error) {
    console.error("Error converting PPTX slides:", error);
    throw new Error("Failed to convert PPTX slides");
  }
}

// Extract elements (text, shapes, images) from a slide
function extractElementsFromSlide(slide: any): SlideElement[] {
  const elements: SlideElement[] = [];
  let zIndex = 1;
  
  try {
    // This is a simplified implementation
    // In a real implementation, you would parse the XML structure of the slide
    // and extract all shapes, text boxes, images, etc.
    
    // For now, create a placeholder text element
    elements.push({
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      props: {
        text: `Imported Slide ${slide.id}`,
        fontSize: 36,
        color: '#333333',
        fontFamily: 'Arial',
        fontWeight: 'bold',
      },
      position: { x: 800, y: 300 },
      size: { width: 500, height: 60 },
      angle: 0,
      zIndex: zIndex++,
    });
    
    // Add a shape
    elements.push({
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'shape',
      props: {
        shape: 'rect',
        fill: '#4287f5',
        stroke: '#2054a8',
        strokeWidth: 2,
      },
      position: { x: 200, y: 400 },
      size: { width: 300, height: 200 },
      angle: 0,
      zIndex: zIndex++,
    });
    
  } catch (error) {
    console.error("Error extracting elements from slide:", error);
  }
  
  return elements;
}

// Extract presenter notes from a slide
function extractNotesFromSlide(slide: any): string {
  try {
    // In a real implementation, you would parse the notes XML file for this slide
    return "Imported slide notes would appear here";
  } catch (error) {
    console.error("Error extracting notes from slide:", error);
    return "";
  }
}
