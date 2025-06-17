import { init } from 'pptx-preview';

export interface PPTXSlideData {
  id: number;
  html: string;
  notes?: string;
}

export interface PPTXConversionResult {
  slides: PPTXSlideData[];
  totalSlides: number;
  htmlContent: string;
}

export async function convertPPTXWithPreview(buffer: ArrayBuffer): Promise<PPTXConversionResult> {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary container for rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.height = '600px';
      document.body.appendChild(tempContainer);

      // Initialize pptx previewer
      const pptxPreviewer = init(tempContainer, {
        width: 800,
        height: 600
      });

      // Preview the PPTX file
      pptxPreviewer.preview(buffer).then(() => {
        try {
          // Extract slides from the rendered content
          const slideElements = tempContainer.querySelectorAll('[data-slide-index]');
          const slides: PPTXSlideData[] = Array.from(slideElements).map((element, index) => ({
            id: index + 1,
            html: element.innerHTML,
            notes: '' // pptx-preview doesn't expose notes directly
          }));

          const htmlContent = generateFullHTML(slides);

          // Clean up
          document.body.removeChild(tempContainer);

          resolve({
            slides,
            totalSlides: slides.length,
            htmlContent
          });
        } catch (extractError) {
          document.body.removeChild(tempContainer);
          reject(new Error(`Failed to extract slides: ${extractError}`));
        }
      }).catch((previewError: Error) => {
        document.body.removeChild(tempContainer);
        reject(new Error(`Failed to preview PPTX: ${previewError.message}`));
      });
    } catch (error) {
      reject(new Error(`Failed to initialize pptx-preview: ${error}`));
    }
  });
}

export async function renderPPTXToContainer(
  buffer: ArrayBuffer, 
  containerId: string,
  options?: {
    width?: number;
    height?: number;
    onSlideChange?: (slideIndex: number) => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    // Initialize pptx previewer
    const pptxPreviewer = init(container, {
      width: options?.width || 800,
      height: options?.height || 600
    });

    // Preview the PPTX file
    await pptxPreviewer.preview(buffer);
    
    // Set up slide change listener if provided
    if (options?.onSlideChange) {
      // Note: pptx-preview might not support slide change callbacks
      // This would depend on the actual API
      console.warn('onSlideChange callback is not implemented for pptx-preview');
    }
  } catch (error) {
    console.error('Error rendering PPTX to container:', error);
    if (options?.onError) {
      options.onError(error as Error);
    }
    throw new Error('Failed to render PPTX to container');
  }
}

function generateFullHTML(slides: PPTXSlideData[]): string {
  const css = `
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .pptx-container {
        max-width: 1000px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .pptx-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .pptx-header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .pptx-header p {
        margin: 5px 0 0 0;
        opacity: 0.9;
        font-size: 14px;
      }
      .slide-container {
        border-bottom: 1px solid #e1e5e9;
        background: white;
      }
      .slide-container:last-child {
        border-bottom: none;
      }
      .slide-header {
        background: #f8f9fa;
        padding: 15px 20px;
        border-bottom: 1px solid #e1e5e9;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .slide-number {
        font-weight: 600;
        color: #495057;
        font-size: 16px;
      }
      .slide-badge {
        background: #007bff;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }
      .slide-content {
        padding: 20px;
        min-height: 400px;
        background: white;
      }
      .slide-notes {
        background: #f8f9fa;
        border-top: 1px solid #e1e5e9;
        padding: 15px 20px;
        margin: 0;
      }
      .slide-notes h4 {
        margin: 0 0 10px 0;
        color: #6c757d;
        font-size: 14px;
        font-weight: 600;
      }
      .slide-notes p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
        line-height: 1.5;
      }
      .navigation {
        background: #f8f9fa;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #e1e5e9;
      }
      .nav-info {
        color: #6c757d;
        font-size: 14px;
      }
      /* pptx-preview generated content styling */
      .pptx-slide {
        width: 100%;
        height: auto;
        border: none;
      }
      /* Ensure pptx-preview content is responsive */
      .slide-content > * {
        max-width: 100%;
        height: auto;
      }
    </style>
  `;

  let html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PPTX Preview - Enhanced</title>
      ${css}
    </head>
    <body>
      <div class="pptx-container">
        <div class="pptx-header">
          <h1>PowerPoint プレゼンテーション</h1>
          <p>pptx-preview.js により生成 - ${slides.length} スライド</p>
        </div>
  `;

  slides.forEach((slide, index) => {
    html += `
      <div class="slide-container">
        <div class="slide-header">
          <span class="slide-number">スライド ${slide.id}</span>
          <span class="slide-badge">${index + 1} / ${slides.length}</span>
        </div>
        <div class="slide-content">
          ${slide.html}
        </div>
        ${slide.notes ? `
          <div class="slide-notes">
            <h4>発表者ノート</h4>
            <p>${slide.notes}</p>
          </div>
        ` : ''}
      </div>
    `;
  });

  html += `
        <div class="navigation">
          <p class="nav-info">
            合計 ${slides.length} スライド - pptx-preview.js を使用して変換
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Fallback to original converter if pptx-preview fails
export async function convertPPTXWithFallback(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await convertPPTXWithPreview(buffer);
    return result.htmlContent;
  } catch (error) {
    console.warn('pptx-preview failed, falling back to original converter:', error);
    // Import the original converter as fallback
    const { convertPPTXToHTML } = await import('./pptxToHtml');
    return await convertPPTXToHTML(buffer);
  }
}