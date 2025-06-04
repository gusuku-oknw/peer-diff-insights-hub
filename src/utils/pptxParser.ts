
import JSZip from 'jszip';
import { Slide } from '@/stores/slide';
import { xml2js } from 'xml-js';

// Parse a PPTX file and extract slides
export async function parsePPTX(buffer: ArrayBuffer): Promise<any[]> {
  try {
    // Use JSZip to unzip the PPTX file
    const zip = await JSZip.loadAsync(buffer);
    
    // Extract presentation.xml for metadata
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('text');
    if (!presentationXml) {
      throw new Error('Could not find presentation.xml in the PPTX file');
    }
    
    // Parse presentation XML
    const presentationData = xml2js(presentationXml, {
      compact: false,
      ignoreComment: true,
      ignoreDeclaration: true
    });
    
    // Extract slide information
    const slides: any[] = [];
    const slideFiles: string[] = [];
    
    // Get presentation element
    const presentationEl = findElement(presentationData, 'p:presentation');
    if (!presentationEl) {
      throw new Error('Could not find p:presentation element');
    }
    
    // Get sldIdLst element that contains slide references
    const slideIdList = findElement(presentationEl, 'p:sldIdLst');
    if (!slideIdList && slideIdList.elements) {
      throw new Error('Could not find slide list');
    }
    
    // Extract each slide
    const slidePromises = [];
    
    // Process each slide file
    for (let i = 1; i <= 20; i++) { // Try up to 20 slides (arbitrary limit)
      const slideFilePath = `ppt/slides/slide${i}.xml`;
      const slideFile = zip.file(slideFilePath);
      
      if (slideFile) {
        const slidePromise = slideFile.async('text').then(slideXml => {
          // Parse slide XML
          const slideData = xml2js(slideXml, {
            compact: false,
            ignoreComment: true,
            ignoreDeclaration: true
          });
          
          // Get slide content and add to slides array
          const slideContent = extractSlideContent(slideData);
          slides.push({
            id: i,
            content: slideContent,
            notes: '' // We would need to extract notes from notesMaster XML
          });
        });
        
        slidePromises.push(slidePromise);
      }
    }
    
    await Promise.all(slidePromises);
    
    // Sort slides by ID
    slides.sort((a, b) => a.id - b.id);
    
    return slides;
    
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    throw new Error('Failed to parse PPTX file');
  }
}

// Helper function to find an element by name in XML parsed data
function findElement(data: any, name: string): any {
  if (!data || !data.elements) return null;
  
  for (const element of data.elements) {
    if (element.name === name) {
      return element;
    }
    
    const found = findElement(element, name);
    if (found) return found;
  }
  
  return null;
}

// Extract content from a slide XML
function extractSlideContent(slideData: any): any {
  const slideEl = findElement(slideData, 'p:sld');
  if (!slideEl) return {};
  
  // Extract text content
  const texts = extractTexts(slideEl);
  
  // Extract shapes
  const shapes = extractShapes(slideEl);
  
  // Extract images (would need to handle embedded images)
  
  return {
    texts,
    shapes,
    // Additional content would go here
  };
}

// Extract text elements from slide
function extractTexts(slideEl: any): any[] {
  const texts: any[] = [];
  
  // Find all text elements (usually in p:txBody elements)
  const textBodies = findAllElements(slideEl, 'p:txBody');
  
  textBodies.forEach((textBody: any, index: number) => {
    const paragraphs = findAllElements(textBody, 'a:p');
    let fullText = '';
    
    paragraphs.forEach((para: any) => {
      const runs = findAllElements(para, 'a:r');
      
      runs.forEach((run: any) => {
        const textEl = findElement(run, 'a:t');
        if (textEl && textEl.elements && textEl.elements[0] && textEl.elements[0].text) {
          fullText += textEl.elements[0].text + ' ';
        }
      });
      
      fullText += '\n';
    });
    
    if (fullText.trim()) {
      texts.push({
        id: `text-${index}`,
        type: 'text',
        content: fullText.trim(),
        // Would extract position, size, formatting, etc. from XML
        position: { x: 400, y: 300 + index * 50 },
        size: { width: 400, height: 50 }
      });
    }
  });
  
  return texts;
}

// Extract shape elements from slide
function extractShapes(slideEl: any): any[] {
  const shapes: any[] = [];
  
  // Find shape elements
  const spPrs = findAllElements(slideEl, 'a:spPr');
  
  spPrs.forEach((spPr: any, index: number) => {
    // Extract shape type, position, size, etc.
    shapes.push({
      id: `shape-${index}`,
      type: 'shape',
      // Would extract actual shape type, position, size from XML
      position: { x: 200, y: 300 + index * 50 },
      size: { width: 100, height: 100 }
    });
  });
  
  return shapes;
}

// Helper to find all elements with a specific name
function findAllElements(data: any, name: string): any[] {
  const results: any[] = [];
  
  function search(node: any) {
    if (!node || !node.elements) return;
    
    for (const element of node.elements) {
      if (element.name === name) {
        results.push(element);
      }
      search(element);
    }
  }
  
  search(data);
  return results;
}

// Convert parsed PPTX data to our application's slide format
export function convertPPTXToSlides(pptxSlides: any[]): Slide[] {
  return pptxSlides.map((pptxSlide, index) => {
    const slideElements = [];
    
    // Convert texts to slide elements
    if (pptxSlide.content && pptxSlide.content.texts) {
      pptxSlide.content.texts.forEach((text: any, i: number) => {
        slideElements.push({
          id: `imported-text-${index}-${i}`,
          type: 'text',
          props: {
            text: text.content || 'Imported Text',
            fontSize: 24,
            color: '#000000',
            fontFamily: 'Arial',
          },
          position: text.position || { x: 800, y: 200 + i * 80 },
          size: text.size || { width: 400, height: 50 },
          angle: 0,
          zIndex: i + 1
        });
      });
    }
    
    // Convert shapes to slide elements
    if (pptxSlide.content && pptxSlide.content.shapes) {
      pptxSlide.content.shapes.forEach((shape: any, i: number) => {
        slideElements.push({
          id: `imported-shape-${index}-${i}`,
          type: 'shape',
          props: {
            shape: 'rect', // Default to rectangle
            fill: '#3b82f6',
            stroke: '',
            strokeWidth: 0
          },
          position: shape.position || { x: 400, y: 400 + i * 80 },
          size: shape.size || { width: 100, height: 100 },
          angle: 0,
          zIndex: pptxSlide.content.texts?.length + i + 1 || i + 1
        });
      });
    }
    
    return {
      id: index + 1,
      title: `Imported Slide ${index + 1}`,
      elements: slideElements,
      notes: pptxSlide.notes || '',
      thumbnail: null
    };
  });
}
