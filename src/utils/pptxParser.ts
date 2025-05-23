
import * as JSZip from 'jszip';
import { xml2js } from 'xml-js';
import { SlideElement, Slide } from '@/stores/slideStore';

// Function to parse a PPTX file
export async function parsePPTX(fileData: ArrayBuffer): Promise<any[]> {
  try {
    // Load the PPTX file with JSZip
    const zip = new JSZip();
    const pptx = await zip.loadAsync(fileData);
    
    // Parse presentation.xml to get global information
    const presentationXml = await pptx.file("ppt/presentation.xml")?.async("string");
    if (!presentationXml) throw new Error("Presentation file not found in PPTX");
    
    // Convert XML to JS object
    const presentation = xml2js(presentationXml, { compact: false, spaces: 4 });
    
    // Find the number of slides
    const presentationElement = presentation.elements?.[0];
    const sldIdLst = presentationElement?.elements?.find((el: any) => 
      el.name === 'p:sldIdLst' || el.name === 'sldIdLst'
    );
    
    if (!sldIdLst?.elements) {
      throw new Error("No slides found in presentation");
    }
    
    // Get all slide IDs
    const slideIds = sldIdLst.elements
      .filter((el: any) => el.name === 'p:sld' || el.name === 'sld')
      .map((el: any) => el.attributes?.id || el.attributes?.['r:id']);
    
    // Load each slide
    const slides = [];
    
    for (let i = 0; i < slideIds.length; i++) {
      const slideIndex = i + 1;
      const slideFile = await pptx.file(`ppt/slides/slide${slideIndex}.xml`)?.async("string");
      
      if (slideFile) {
        const slideXml = xml2js(slideFile, { compact: false, spaces: 4 });
        const slideElement = slideXml.elements?.[0];
        
        // Basic slide data
        const slideData = {
          id: slideIndex,
          elements: [],
          notes: "",
          title: `Slide ${slideIndex}`
        };
        
        // Try to extract slide content - this is a simplified version
        // Real implementation would need to handle shapes, text boxes, images, etc.
        const cSld = slideElement?.elements?.find((el: any) => 
          el.name === 'p:cSld' || el.name === 'cSld'
        );
        
        if (cSld) {
          // Extract title if available
          const titleElement = extractTitleFromSlide(cSld);
          if (titleElement) {
            slideData.title = titleElement;
          }
          
          // In a real implementation, you'd extract more elements here
        }
        
        // Try to get notes if available
        try {
          const notesFile = await pptx.file(`ppt/notesSlides/notesSlide${slideIndex}.xml`)?.async("string");
          if (notesFile) {
            const notesText = extractNotesFromXml(notesFile);
            if (notesText) {
              slideData.notes = notesText;
            }
          }
        } catch (e) {
          console.log(`No notes found for slide ${slideIndex}`);
        }
        
        slides.push(slideData);
      }
    }
    
    return slides;
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw error;
  }
}

// Function to extract title from slide
function extractTitleFromSlide(cSld: any): string | null {
  try {
    // Find shape tree
    const spTree = cSld.elements?.find((el: any) => 
      el.name === 'p:spTree' || el.name === 'spTree'
    );
    
    if (!spTree?.elements) return null;
    
    // Find title shape
    for (const shape of spTree.elements) {
      if (shape.name === 'p:sp' || shape.name === 'sp') {
        // Look for nvSpPr > nvPr > ph with type="title"
        const nvSpPr = shape.elements?.find((el: any) => 
          el.name === 'p:nvSpPr' || el.name === 'nvSpPr'
        );
        
        if (nvSpPr) {
          const nvPr = nvSpPr.elements?.find((el: any) => 
            el.name === 'p:nvPr' || el.name === 'nvPr'
          );
          
          if (nvPr) {
            const ph = nvPr.elements?.find((el: any) => 
              el.name === 'p:ph' || el.name === 'ph'
            );
            
            if (ph && ph.attributes?.type === 'title') {
              // This is a title shape, find the text
              const txBody = shape.elements?.find((el: any) => 
                el.name === 'p:txBody' || el.name === 'txBody'
              );
              
              if (txBody) {
                return extractTextFromTxBody(txBody);
              }
            }
          }
        }
      }
    }
    
    return null;
  } catch (e) {
    console.error("Error extracting title:", e);
    return null;
  }
}

// Extract text from txBody element
function extractTextFromTxBody(txBody: any): string {
  try {
    const textParts: string[] = [];
    
    // Find all paragraph elements
    const paragraphs = txBody.elements?.filter((el: any) => 
      el.name === 'a:p' || el.name === 'p'
    );
    
    if (!paragraphs) return "";
    
    // Extract text runs from each paragraph
    for (const paragraph of paragraphs) {
      const runs = paragraph.elements?.filter((el: any) => 
        el.name === 'a:r' || el.name === 'r'
      );
      
      if (runs) {
        for (const run of runs) {
          const textElement = run.elements?.find((el: any) => 
            el.name === 'a:t' || el.name === 't'
          );
          
          if (textElement && textElement.elements?.[0]?.text) {
            textParts.push(textElement.elements[0].text);
          }
        }
      }
    }
    
    return textParts.join(" ");
  } catch (e) {
    console.error("Error extracting text:", e);
    return "";
  }
}

// Extract notes from notes XML
function extractNotesFromXml(notesXml: string): string {
  try {
    const notesObj = xml2js(notesXml, { compact: false, spaces: 4 });
    const notesElement = notesObj.elements?.[0];
    
    // Find the notes text container
    const cSld = notesElement?.elements?.find((el: any) => 
      el.name === 'p:cSld' || el.name === 'cSld'
    );
    
    if (!cSld) return "";
    
    const spTree = cSld.elements?.find((el: any) => 
      el.name === 'p:spTree' || el.name === 'spTree'
    );
    
    if (!spTree) return "";
    
    // Look for shapes that contain notes text
    const shapes = spTree.elements?.filter((el: any) => 
      el.name === 'p:sp' || el.name === 'sp'
    );
    
    if (!shapes) return "";
    
    // Extract text from all shapes
    const notesTextParts: string[] = [];
    
    for (const shape of shapes) {
      const txBody = shape.elements?.find((el: any) => 
        el.name === 'p:txBody' || el.name === 'txBody'
      );
      
      if (txBody) {
        const text = extractTextFromTxBody(txBody);
        if (text) {
          notesTextParts.push(text);
        }
      }
    }
    
    return notesTextParts.join("\n");
  } catch (e) {
    console.error("Error extracting notes:", e);
    return "";
  }
}

// Convert PPTX slides to our application's slide format
export function convertPPTXToSlides(pptxSlides: any[]): Slide[] {
  return pptxSlides.map((pptxSlide, index) => {
    // Create a basic slide with minimal content
    const slide: Slide = {
      id: pptxSlide.id || index + 1,
      title: pptxSlide.title || `Slide ${index + 1}`,
      elements: [],
      notes: pptxSlide.notes || ""
    };
    
    // If the PPTX slide has a title, add it as a text element
    if (pptxSlide.title) {
      slide.elements.push({
        id: `title-${slide.id}`,
        type: 'text',
        props: { 
          text: pptxSlide.title,
          fontSize: 40,
          color: '#1e40af',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 100 },
        size: { width: 600, height: 60 },
        angle: 0,
        zIndex: 1,
      });
    }
    
    // In a real implementation, you would convert all elements from the PPTX
    // slide format to your application's format
    
    return slide;
  });
}
