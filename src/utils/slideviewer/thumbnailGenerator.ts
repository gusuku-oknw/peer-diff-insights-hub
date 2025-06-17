/**
 * スライドサムネイル生成ユーティリティ
 * HTMLコンテンツからCanvas経由でサムネイル画像を生成
 */

export interface ThumbnailGeneratorOptions {
  width?: number;
  height?: number;
  quality?: number;
  backgroundColor?: string;
}

/**
 * HTMLコンテンツからサムネイル画像を生成
 */
export const generateThumbnailFromHTML = async (
  htmlContent: string,
  options: ThumbnailGeneratorOptions = {}
): Promise<string> => {
  const {
    width = 320,
    height = 180,
    quality = 0.8,
    backgroundColor = '#ffffff'
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // 軽量な隠されたコンテナを作成
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1920px';
      container.style.height = '1080px';
      container.style.backgroundColor = backgroundColor;
      container.style.padding = '40px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.fontSize = '24px';
      container.style.lineHeight = '1.4';
      container.style.overflow = 'hidden';
      container.innerHTML = htmlContent;

      document.body.appendChild(container);

      // html2canvasのダイナミックインポートを試行
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        (window as any).html2canvas(container, {
          width: 1920,
          height: 1080,
          scale: width / 1920,
          backgroundColor: backgroundColor,
          useCORS: true,
          allowTaint: true,
          logging: false
        }).then((canvas: HTMLCanvasElement) => {
          document.body.removeChild(container);
          
          // Canvasから画像データを取得
          const dataURL = canvas.toDataURL('image/jpeg', quality);
          resolve(dataURL);
        }).catch((error: Error) => {
          document.body.removeChild(container);
          reject(error);
        });
      } else {
        // Fallback: Canvas API を直接使用
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          document.body.removeChild(container);
          throw new Error('Canvas context not available');
        }

        // 背景色を設定
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // 基本的なテキスト描画
        const textContent = container.textContent || 'スライドコンテンツ';
        ctx.fillStyle = '#333333';
        ctx.font = '16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // テキストを複数行に分割して描画
        const words = textContent.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > width - 40 && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) lines.push(currentLine);

        // 最大5行まで表示
        const maxLines = Math.min(5, lines.length);
        const lineHeight = 20;
        const startY = (height - (maxLines * lineHeight)) / 2;

        lines.slice(0, maxLines).forEach((line, index) => {
          ctx.fillText(line, width / 2, startY + (index * lineHeight));
        });

        document.body.removeChild(container);
        const dataURL = canvas.toDataURL('image/jpeg', quality);
        resolve(dataURL);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * スライドデータからサムネイルを生成
 */
export const generateSlidesThumbnails = async (
  slides: Array<{ id: number; html?: string; title?: string }>,
  options: ThumbnailGeneratorOptions = {}
): Promise<Record<number, string>> => {
  const thumbnails: Record<number, string> = {};
  
  for (const slide of slides) {
    try {
      let htmlContent = slide.html || '';
      
      // HTMLが空の場合はタイトルから生成
      if (!htmlContent && slide.title) {
        htmlContent = `
          <div style="text-align: center; padding: 40px;">
            <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">${slide.title}</h1>
            <p style="color: #666; font-size: 24px;">スライド ${slide.id}</p>
          </div>
        `;
      }
      
      // デフォルトコンテンツ
      if (!htmlContent) {
        htmlContent = `
          <div style="text-align: center; padding: 40px;">
            <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">スライド ${slide.id}</h1>
            <p style="color: #666; font-size: 24px;">内容はまだ追加されていません</p>
          </div>
        `;
      }
      
      const thumbnail = await generateThumbnailFromHTML(htmlContent, options);
      thumbnails[slide.id] = thumbnail;
    } catch (error) {
      console.warn(`Failed to generate thumbnail for slide ${slide.id}:`, error);
      // エラー時はプレースホルダー画像を生成
      thumbnails[slide.id] = generatePlaceholderThumbnail(slide.id, options);
    }
  }
  
  return thumbnails;
};

/**
 * プレースホルダーサムネイルを生成
 */
export const generatePlaceholderThumbnail = (
  slideId: number,
  options: ThumbnailGeneratorOptions = {}
): string => {
  const {
    width = 320,
    height = 180,
    backgroundColor = '#f5f5f5'
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(1, '#e0e0e0');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 枠線
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // アイコン描画
  ctx.fillStyle = '#999';
  ctx.font = `${Math.min(width, height) * 0.2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📄', width / 2, height / 2 - 20);

  // スライド番号
  ctx.fillStyle = '#666';
  ctx.font = `${Math.min(width, height) * 0.12}px Arial`;
  ctx.fillText(`スライド ${slideId}`, width / 2, height / 2 + 20);

  return canvas.toDataURL('image/jpeg', 0.8);
};

/**
 * 既存のスライドストアにサムネイルを追加
 */
export const updateSlideThumbnails = async (
  slides: Array<{ id: number; html?: string; title?: string }>,
  updateCallback: (slideId: number, thumbnail: string) => void,
  options: ThumbnailGeneratorOptions = {}
): Promise<void> => {
  // バッチ処理で複数のサムネイルを並行生成
  const batchSize = 3;
  const batches = [];
  
  for (let i = 0; i < slides.length; i += batchSize) {
    batches.push(slides.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    const promises = batch.map(async (slide) => {
      try {
        let htmlContent = slide.html || '';
        
        if (!htmlContent && slide.title) {
          htmlContent = `
            <div style="text-align: center; padding: 40px;">
              <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">${slide.title}</h1>
              <p style="color: #666; font-size: 24px;">スライド ${slide.id}</p>
            </div>
          `;
        }
        
        if (!htmlContent) {
          htmlContent = `
            <div style="text-align: center; padding: 40px;">
              <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">スライド ${slide.id}</h1>
              <p style="color: #666; font-size: 24px;">内容はまだ追加されていません</p>
            </div>
          `;
        }
        
        const thumbnail = await generateThumbnailFromHTML(htmlContent, options);
        updateCallback(slide.id, thumbnail);
      } catch (error) {
        console.warn(`Failed to generate thumbnail for slide ${slide.id}:`, error);
        const placeholder = generatePlaceholderThumbnail(slide.id, options);
        updateCallback(slide.id, placeholder);
      }
    });
    
    await Promise.all(promises);
    
    // 少し待機してブラウザをブロックしないようにする
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};