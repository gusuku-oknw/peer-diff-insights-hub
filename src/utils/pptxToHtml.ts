import JSZip from 'jszip';
import { xml2js } from 'xml-js';

interface SlideElement {
  type: 'text' | 'shape' | 'image';
  content?: string;
  style?: Record<string, string>;
  attributes?: Record<string, string>;
}

interface ParsedSlide {
  id: number;
  elements: SlideElement[];
  notes?: string;
}

export async function convertPPTXToHTML(buffer: ArrayBuffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const slides = await parseSlides(zip);
    return generateHTML(slides);
  } catch (error) {
    console.error('Error converting PPTX to HTML:', error);
    throw new Error('Failed to convert PPTX to HTML');
  }
}

async function parseSlides(zip: JSZip): Promise<ParsedSlide[]> {
  const slides: ParsedSlide[] = [];
  
  // Process each slide file
  for (let i = 1; i <= 50; i++) { // Check up to 50 slides
    const slideFilePath = `ppt/slides/slide${i}.xml`;
    const slideFile = zip.file(slideFilePath);
    
    if (!slideFile) break;
    
    try {
      const slideXml = await slideFile.async('text');
      const slideData = xml2js(slideXml, {
        compact: false,
        ignoreComment: true,
        ignoreDeclaration: true
      });
      
      const elements = extractSlideElements(slideData);
      slides.push({
        id: i,
        elements,
        notes: '' // Could extract notes from notes files
      });
    } catch (error) {
      console.warn(`Failed to parse slide ${i}:`, error);
    }
  }
  
  return slides;
}

function extractSlideElements(slideData: any): SlideElement[] {
  const elements: SlideElement[] = [];
  
  // Extract text elements
  const textElements = extractTextElements(slideData);
  elements.push(...textElements);
  
  // Extract shape elements
  const shapeElements = extractShapeElements(slideData);
  elements.push(...shapeElements);
  
  return elements;
}

function extractTextElements(slideData: any): SlideElement[] {
  const textElements: SlideElement[] = [];
  
  // Find all text body elements
  const textBodies = findAllElements(slideData, 'p:txBody');
  
  textBodies.forEach((textBody: any, index: number) => {
    const paragraphs = findAllElements(textBody, 'a:p');
    let fullText = '';
    const styles: Record<string, string> = {};
    
    paragraphs.forEach((para: any) => {
      const runs = findAllElements(para, 'a:r');
      
      runs.forEach((run: any) => {
        const textEl = findElement(run, 'a:t');
        const runPr = findElement(run, 'a:rPr');
        
        if (textEl && textEl.elements && textEl.elements[0] && textEl.elements[0].text) {
          const text = textEl.elements[0].text;
          
          // Extract text formatting
          if (runPr) {
            const formatting = extractTextFormatting(runPr);
            Object.assign(styles, formatting);
          }
          
          fullText += text + ' ';
        }
      });
      
      fullText += '\n';
    });
    
    if (fullText.trim()) {
      textElements.push({
        type: 'text',
        content: fullText.trim(),
        style: styles
      });
    }
  });
  
  return textElements;
}

function extractShapeElements(slideData: any): SlideElement[] {
  const shapeElements: SlideElement[] = [];
  
  // Find shape elements
  const shapes = findAllElements(slideData, 'p:sp');
  
  shapes.forEach((shape: any, index: number) => {
    const spPr = findElement(shape, 'p:spPr');
    const nvSpPr = findElement(shape, 'p:nvSpPr');
    
    if (spPr) {
      const styles = extractShapeStyles(spPr);
      const attributes: Record<string, string> = {};
      
      // Extract shape name if available
      if (nvSpPr) {
        const cNvPr = findElement(nvSpPr, 'p:cNvPr');
        if (cNvPr && cNvPr.attributes && cNvPr.attributes.name) {
          attributes.name = cNvPr.attributes.name;
        }
      }
      
      shapeElements.push({
        type: 'shape',
        style: styles,
        attributes
      });
    }
  });
  
  return shapeElements;
}

function extractTextFormatting(runPr: any): Record<string, string> {
  const styles: Record<string, string> = {};
  
  // Font size
  if (runPr.attributes && runPr.attributes.sz) {
    styles.fontSize = `${parseInt(runPr.attributes.sz) / 100}pt`;
  }
  
  // Bold
  if (runPr.attributes && runPr.attributes.b === '1') {
    styles.fontWeight = 'bold';
  }
  
  // Italic
  if (runPr.attributes && runPr.attributes.i === '1') {
    styles.fontStyle = 'italic';
  }
  
  // Color
  const solidFill = findElement(runPr, 'a:solidFill');
  if (solidFill) {
    const srgbClr = findElement(solidFill, 'a:srgbClr');
    if (srgbClr && srgbClr.attributes && srgbClr.attributes.val) {
      styles.color = `#${srgbClr.attributes.val}`;
    }
  }
  
  return styles;
}

function extractShapeStyles(spPr: any): Record<string, string> {
  const styles: Record<string, string> = {};
  
  // Extract fill
  const solidFill = findElement(spPr, 'a:solidFill');
  if (solidFill) {
    const srgbClr = findElement(solidFill, 'a:srgbClr');
    if (srgbClr && srgbClr.attributes && srgbClr.attributes.val) {
      styles.backgroundColor = `#${srgbClr.attributes.val}`;
    }
  }
  
  // Extract outline
  const ln = findElement(spPr, 'a:ln');
  if (ln) {
    if (ln.attributes && ln.attributes.w) {
      styles.borderWidth = `${parseInt(ln.attributes.w) / 12700}px`;
    }
    
    const lineSolidFill = findElement(ln, 'a:solidFill');
    if (lineSolidFill) {
      const srgbClr = findElement(lineSolidFill, 'a:srgbClr');
      if (srgbClr && srgbClr.attributes && srgbClr.attributes.val) {
        styles.borderColor = `#${srgbClr.attributes.val}`;
        styles.borderStyle = 'solid';
      }
    }
  }
  
  return styles;
}

function generateHTML(slides: ParsedSlide[]): string {
  const css = `
    <style>
      .pptx-container {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .slide {
        border: 1px solid #ddd;
        margin-bottom: 30px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .slide-header {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #007bff;
      }
      .slide-content {
        line-height: 1.6;
      }
      .text-element {
        margin-bottom: 15px;
      }
      .shape-element {
        display: inline-block;
        padding: 10px;
        margin: 5px;
        border-radius: 4px;
      }
      .slide-notes {
        margin-top: 15px;
        padding: 10px;
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        font-style: italic;
      }
    </style>
  `;
  
  let html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PPTX Preview</title>
      ${css}
    </head>
    <body>
      <div class="pptx-container">
        <h1>プレゼンテーション プレビュー</h1>
  `;
  
  slides.forEach((slide, index) => {
    html += `
      <div class="slide">
        <div class="slide-header">スライド ${slide.id}</div>
        <div class="slide-content">
    `;
    
    slide.elements.forEach((element, elemIndex) => {
      if (element.type === 'text' && element.content) {
        const styleStr = element.style ? Object.entries(element.style)
          .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
          .join('; ') : '';
        
        html += `
          <div class="text-element" style="${styleStr}">
            ${escapeHtml(element.content).replace(/\n/g, '<br>')}
          </div>
        `;
      } else if (element.type === 'shape') {
        const styleStr = element.style ? Object.entries(element.style)
          .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
          .join('; ') : '';
        
        const name = element.attributes?.name || `図形 ${elemIndex + 1}`;
        html += `
          <div class="shape-element" style="${styleStr}">
            ${escapeHtml(name)}
          </div>
        `;
      }
    });
    
    if (slide.notes) {
      html += `
        <div class="slide-notes">
          <strong>ノート:</strong> ${escapeHtml(slide.notes)}
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </body>
    </html>
  `;
  
  return html;
}

// Helper functions
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

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeHtml(text: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  // Fallback for SSR or non-browser environments
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}