import JSZip from 'jszip';
import { xml2js, js2xml } from 'xml-js';

// Parse PPTX file and extract slide data
export async function parsePPTX(fileBuffer: ArrayBuffer) {
  try {
    // Load the PPTX as a ZIP file
    const zip = await JSZip.loadAsync(fileBuffer);
    
    // Get presentation.xml which contains the overall structure
    const presentationXml = await zip.file("ppt/presentation.xml")?.async("text");
    if (!presentationXml) {
      throw new Error("Invalid PPTX: Missing presentation.xml");
    }
    
    // Convert XML to JavaScript object
    const presentationData = xml2js(presentationXml, { compact: true });
    
    // Extract slides information
    const slideRefs = presentationData?.['p:presentation']?.['p:sldIdLst']?.['p:sldId'] || [];
    const slideIds = Array.isArray(slideRefs) 
      ? slideRefs.map(ref => ref._attributes?.['r:id'])
      : [slideRefs._attributes?.['r:id']].filter(Boolean);
    
    // Process each slide
    const slides = [];
    for (let i = 0; i < slideIds.length; i++) {
      // Slide XML path follows pattern ppt/slides/slide1.xml, slide2.xml, etc.
      const slideXml = await zip.file(`ppt/slides/slide${i + 1}.xml`)?.async("text");
      if (slideXml) {
        const slideData = xml2js(slideXml, { compact: true });
        slides.push(slideData);
      }
    }
    
    console.log(`Parsed ${slides.length} slides from PPTX`);
    return slides;
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw error;
  }
}

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
