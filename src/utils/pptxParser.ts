import JSZip from 'jszip';
import { xml2js } from 'xml-js';

export interface PPTXSlide {
  id: string;
  elements: PPTXElement[];
  relations: Record<string, string>;
}

export interface PPTXElement {
  type: 'text' | 'shape' | 'image';
  id: string;
  position: { x: number, y: number };
  size: { width: number, height: number };
  props: Record<string, any>;
}

/**
 * Parse a PPTX file buffer into a structured format
 * @param fileBuffer ArrayBuffer of the PPTX file
 */
export async function parsePPTX(fileBuffer: ArrayBuffer): Promise<PPTXSlide[]> {
  try {
    console.log('Parsing PPTX file...');
    // Load the PPTX file as a ZIP
    const zip = await JSZip.loadAsync(fileBuffer);
    
    // Extract presentation.xml which contains the main structure
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('text');
    if (!presentationXml) {
      throw new Error('Invalid PPTX: Missing presentation.xml');
    }
    
    // Parse presentation XML to get slide references
    const presentation = xml2js(presentationXml, { compact: true }) as any;
    const slideRefs = presentation['p:presentation']['p:sldIdLst']['p:sldId'] || [];
    
    // Process each slide
    const slides: PPTXSlide[] = [];
    
    // Handle both single slide and multiple slides
    const slideRefsArray = Array.isArray(slideRefs) ? slideRefs : [slideRefs];
    
    for (let i = 0; i < slideRefsArray.length; i++) {
      const slideRef = slideRefsArray[i];
      const rId = slideRef._attributes['r:id'];
      const slideId = slideRef._attributes['id'];
      
      // Extract slide relation to get the actual slide file
      const relsXml = await zip.file('ppt/_rels/presentation.xml.rels')?.async('text');
      if (!relsXml) {
        console.warn(`Could not find relationships for presentation`);
        continue;
      }
      
      const rels = xml2js(relsXml, { compact: true }) as any;
      const slideRelation = findRelation(rels, rId);
      
      if (!slideRelation) {
        console.warn(`Could not find relation for slide ${slideId}`);
        continue;
      }
      
      // Get the slide XML
      const slidePath = `ppt/${slideRelation.target}`;
      const slideXml = await zip.file(slidePath)?.async('text');
      if (!slideXml) {
        console.warn(`Could not find slide file: ${slidePath}`);
        continue;
      }
      
      // Parse slide XML
      const slide = xml2js(slideXml, { compact: true }) as any;
      
      // Extract slide elements
      const elements = extractSlideElements(slide);
      
      // Get slide relationships for images
      const slideRelPath = `${slidePath.substring(0, slidePath.lastIndexOf('/'))}/`
          + `_rels/${slidePath.substring(slidePath.lastIndexOf('/') + 1)}.rels`;
      
      const slideRelXml = await zip.file(slideRelPath)?.async('text');
      const slideRels = slideRelXml ? xml2js(slideRelXml, { compact: true }) as any : null;
      
      // Process images and media
      const relations: Record<string, string> = {};
      
      if (slideRels) {
        const relationshipElements = slideRels['Relationships']['Relationship'];
        const relationshipsArray = Array.isArray(relationshipElements) 
          ? relationshipElements 
          : [relationshipElements];
        
        for (const rel of relationshipsArray) {
          const relId = rel._attributes['Id'];
          const target = rel._attributes['Target'];
          
          // For images, we need to extract the binary data
          if (rel._attributes['Type'].includes('image')) {
            const imagePath = target.startsWith('/') 
              ? target.substring(1) 
              : `ppt/slides/${target}`;
              
            try {
              const imageFile = zip.file(imagePath);
              if (imageFile) {
                const imageData = await imageFile.async('blob');
                const imageUrl = URL.createObjectURL(imageData);
                relations[relId] = imageUrl;
              }
            } catch (error) {
              console.error(`Error extracting image: ${imagePath}`, error);
            }
          } else {
            relations[relId] = target;
          }
        }
      }
      
      slides.push({
        id: slideId,
        elements,
        relations
      });
    }
    
    console.log(`Parsed ${slides.length} slides from PPTX`);
    return slides;
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    throw error;
  }
}

/**
 * Find a relationship by its ID
 */
function findRelation(rels: any, rId: string): { target: string } | undefined {
  const relationships = rels['Relationships']['Relationship'];
  const relationshipsArray = Array.isArray(relationships) ? relationships : [relationships];
  
  for (const rel of relationshipsArray) {
    if (rel._attributes['Id'] === rId) {
      return {
        target: rel._attributes['Target']
      };
    }
  }
  
  return undefined;
}

/**
 * Extract slide elements from slide XML
 */
function extractSlideElements(slide: any): PPTXElement[] {
  const elements: PPTXElement[] = [];
  
  try {
    const slideContent = slide['p:sld']['p:cSld'];
    const spTree = slideContent['p:spTree'];
    
    if (!spTree) {
      console.warn('No shape tree found in slide');
      return elements;
    }
    
    // Process shapes
    if (spTree['p:sp']) {
      const shapes = Array.isArray(spTree['p:sp']) ? spTree['p:sp'] : [spTree['p:sp']];
      
      for (const shape of shapes) {
        const nvSpPr = shape['p:nvSpPr'];
        const spPr = shape['p:spPr'];
        const txBody = shape['p:txBody'];
        
        if (!nvSpPr || !spPr) continue;
        
        const id = nvSpPr['p:cNvPr']?._attributes?.['id'] || `sp-${elements.length + 1}`;
        const name = nvSpPr['p:cNvPr']?._attributes?.['name'] || '';
        
        // Get position and size
        const xfrm = spPr['a:xfrm'];
        if (!xfrm) continue;
        
        const x = parseInt(xfrm['a:off']?._attributes?.['x'] || '0');
        const y = parseInt(xfrm['a:off']?._attributes?.['y'] || '0');
        const width = parseInt(xfrm['a:ext']?._attributes?.['cx'] || '0');
        const height = parseInt(xfrm['a:ext']?._attributes?.['cy'] || '0');
        
        // Get fill properties
        let fill = '#FFFFFF';
        if (spPr['a:solidFill']) {
          const colorElement = spPr['a:solidFill']['a:srgbClr'] || spPr['a:solidFill']['a:schemeClr'];
          if (colorElement) {
            fill = `#${colorElement._attributes['val']}`;
          }
        }
        
        // Extract text content
        let text = '';
        if (txBody) {
          const paragraphs = txBody['a:p'];
          if (paragraphs) {
            const pArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
            
            for (const p of pArray) {
              if (p['a:r']) {
                const runs = Array.isArray(p['a:r']) ? p['a:r'] : [p['a:r']];
                for (const run of runs) {
                  if (run['a:t']) {
                    text += run['a:t']._text || '';
                  }
                }
              }
              text += '\n';
            }
          }
        }
        
        // Add the element
        if (text.trim()) {
          // If it has text, treat it as a text element
          elements.push({
            type: 'text',
            id,
            position: { x: x / 9525, y: y / 9525 }, // Convert EMUs to points (1 point = 9525 EMUs)
            size: { width: width / 9525, height: height / 9525 },
            props: {
              text: text.trim(),
              fill,
              name
            }
          });
        } else {
          // Otherwise, it's a shape
          elements.push({
            type: 'shape',
            id,
            position: { x: x / 9525, y: y / 9525 },
            size: { width: width / 9525, height: height / 9525 },
            props: {
              fill,
              shape: 'rect', // Default shape type
              name
            }
          });
        }
      }
    }
    
    // Process images
    if (spTree['p:pic']) {
      const pictures = Array.isArray(spTree['p:pic']) ? spTree['p:pic'] : [spTree['p:pic']];
      
      for (const pic of pictures) {
        const nvPicPr = pic['p:nvPicPr'];
        const blipFill = pic['p:blipFill'];
        const spPr = pic['p:spPr'];
        
        if (!nvPicPr || !blipFill || !spPr) continue;
        
        const id = nvPicPr['p:cNvPr']?._attributes?.['id'] || `pic-${elements.length + 1}`;
        const name = nvPicPr['p:cNvPr']?._attributes?.['name'] || '';
        
        // Get relationship ID for the image
        const rId = blipFill['a:blip']?._attributes?.['r:embed'];
        
        // Get position and size
        const xfrm = spPr['a:xfrm'];
        if (!xfrm) continue;
        
        const x = parseInt(xfrm['a:off']?._attributes?.['x'] || '0');
        const y = parseInt(xfrm['a:off']?._attributes?.['y'] || '0');
        const width = parseInt(xfrm['a:ext']?._attributes?.['cx'] || '0');
        const height = parseInt(xfrm['a:ext']?._attributes?.['cy'] || '0');
        
        // Add the element
        elements.push({
          type: 'image',
          id,
          position: { x: x / 9525, y: y / 9525 },
          size: { width: width / 9525, height: height / 9525 },
          props: {
            name,
            rId
          }
        });
      }
    }
  } catch (error) {
    console.error('Error extracting slide elements:', error);
  }
  
  return elements;
}

/**
 * Helper function to convert PPTX slide to slides format used by the application
 */
export function convertPPTXToSlides(pptxSlides: PPTXSlide[]): any[] {
  return pptxSlides.map((pptxSlide, index) => {
    const slideElements = pptxSlide.elements.map(element => {
      const baseElement = {
        id: element.id,
        position: element.position,
        size: element.size,
        angle: 0,
        zIndex: 1,
      };
      
      if (element.type === 'text') {
        return {
          ...baseElement,
          type: 'text',
          props: {
            text: element.props.text,
            fontSize: 24, // Default font size
            color: element.props.fill || '#000000',
            fontFamily: 'Arial',
          }
        };
      } else if (element.type === 'shape') {
        return {
          ...baseElement,
          type: 'shape',
          props: {
            shape: element.props.shape || 'rect',
            fill: element.props.fill || '#4287f5',
            stroke: '',
            strokeWidth: 0,
          }
        };
      } else if (element.type === 'image') {
        return {
          ...baseElement,
          type: 'image',
          props: {
            src: element.props.rId ? pptxSlide.relations[element.props.rId] || '' : '',
            name: element.props.name || `Image ${index}`,
          }
        };
      }
      
      return baseElement;
    });
    
    return {
      id: index + 1,
      title: `Slide ${index + 1}`,
      elements: slideElements,
      notes: `Notes for Slide ${index + 1}`,
      thumbnail: '', // Will be generated separately
    };
  });
}
