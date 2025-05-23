
import JSZip from 'jszip';
import { xml2js } from 'xml-js';
import { Slide, SlideElement } from '@/stores/slideStore';

// Parse PPTX file
export async function parsePPTX(file: File): Promise<Slide[]> {
  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    
    // Extract presentation.xml
    const presentationXml = await content.file('ppt/presentation.xml')?.async('text');
    if (!presentationXml) {
      throw new Error('Could not find presentation.xml');
    }
    
    // Parse presentation.xml
    const presentation = xml2js(presentationXml, { compact: true });
    
    // Get slide count
    const slideCount = presentation.p_Presentation.p_SldIdLst.p_sldId.length;
    
    // Extract and parse each slide
    const slides: Slide[] = [];
    
    for (let i = 1; i <= slideCount; i++) {
      const slideXml = await content.file(`ppt/slides/slide${i}.xml`)?.async('text');
      if (slideXml) {
        const parsedSlide = parseSlide(slideXml, i);
        slides.push(parsedSlide);
      }
    }
    
    return slides;
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    throw error;
  }
}

// Parse individual slide XML
function parseSlide(slideXml: string, slideNumber: number): Slide {
  try {
    const slideJs = xml2js(slideXml, { compact: true });
    
    // Extract slide elements
    const elements: SlideElement[] = [];
    let title = `Slide ${slideNumber}`;
    
    // Parse shapes, text, etc.
    const spTree = slideJs.p_sld.p_cSld.p_spTree;
    
    if (spTree && spTree.p_sp) {
      const shapes = Array.isArray(spTree.p_sp) ? spTree.p_sp : [spTree.p_sp];
      
      shapes.forEach((shape: any, index: number) => {
        // Try to extract text
        if (shape.p_txBody && shape.p_txBody.a_p && shape.p_txBody.a_p.a_r) {
          const textParagraphs = Array.isArray(shape.p_txBody.a_p) ? shape.p_txBody.a_p : [shape.p_txBody.a_p];
          
          let text = '';
          textParagraphs.forEach((paragraph: any) => {
            const runs = Array.isArray(paragraph.a_r) ? paragraph.a_r : [paragraph.a_r];
            runs.forEach((run: any) => {
              if (run.a_t && run.a_t._text) {
                text += run.a_t._text + ' ';
              }
            });
          });
          
          // Use first text element as slide title if it's the first element
          if (index === 0) {
            title = text.trim();
          }
          
          elements.push({
            id: `text-${Date.now()}-${index}`,
            type: 'text',
            props: {
              text: text.trim(),
              fontSize: 24, // Default size
              color: '#000000', // Default color
              fontFamily: 'Arial'
            },
            position: { x: 800, y: 300 + (index * 50) },
            size: { width: 600, height: 50 },
            angle: 0,
            zIndex: index + 1
          });
        }
      });
    }
    
    // Create slide object
    return {
      id: slideNumber,
      title,
      elements,
      notes: "Imported from PPTX file",
      thumbnail: null
    };
  } catch (error) {
    console.error('Error parsing slide XML:', error);
    return {
      id: slideNumber,
      elements: [],
      notes: "Error parsing slide",
      thumbnail: null
    };
  }
}
