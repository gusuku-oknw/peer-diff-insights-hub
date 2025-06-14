
import { Canvas } from 'fabric';

interface OptimizationConfig {
  enableVirtualization: boolean;
  maxVisibleElements: number;
  renderOnIdle: boolean;
  useWorkerRendering: boolean;
}

class CanvasOptimizer {
  private canvas: Canvas | null = null;
  private config: OptimizationConfig;
  private renderQueue: (() => void)[] = [];
  private isRendering = false;
  private observedElements = new Set<string>();
  
  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableVirtualization: true,
      maxVisibleElements: 50,
      renderOnIdle: true,
      useWorkerRendering: false,
      ...config
    };
  }
  
  setCanvas(canvas: Canvas) {
    this.canvas = canvas;
    this.setupOptimizations();
  }
  
  private setupOptimizations() {
    if (!this.canvas) return;
    
    // レンダリング最適化
    this.canvas.renderOnAddRemove = false;
    this.canvas.skipTargetFind = false;
    this.canvas.imageSmoothingEnabled = true;
    
    // バッチレンダリングの設定
    this.setupBatchRendering();
    
    // メモリリークの防止
    this.setupMemoryManagement();
  }
  
  private setupBatchRendering() {
    if (!this.canvas) return;
    
    // レンダリングキューを使用したバッチ処理
    this.canvas.on('after:render', () => {
      this.processPendingOperations();
    });
  }
  
  private setupMemoryManagement() {
    if (!this.canvas) return;
    
    // 定期的なガベージコレクション促進
    setInterval(() => {
      this.cleanupUnusedResources();
    }, 30000); // 30秒ごと
  }
  
  queueRender(operation: () => void) {
    this.renderQueue.push(operation);
    
    if (!this.isRendering) {
      this.scheduleRender();
    }
  }
  
  private scheduleRender() {
    if (this.config.renderOnIdle) {
      requestIdleCallback(() => this.processPendingOperations(), { timeout: 100 });
    } else {
      requestAnimationFrame(() => this.processPendingOperations());
    }
  }
  
  private processPendingOperations() {
    if (this.isRendering || this.renderQueue.length === 0) return;
    
    this.isRendering = true;
    
    const startTime = performance.now();
    const maxProcessingTime = 16; // 16ms制限でフレームレート維持
    
    while (this.renderQueue.length > 0 && (performance.now() - startTime) < maxProcessingTime) {
      const operation = this.renderQueue.shift();
      if (operation) {
        operation();
      }
    }
    
    if (this.canvas) {
      this.canvas.renderAll();
    }
    
    this.isRendering = false;
    
    // まだキューに残りがあれば次のフレームで処理
    if (this.renderQueue.length > 0) {
      this.scheduleRender();
    }
  }
  
  optimizeElementVisibility(elements: any[], viewport: { x: number; y: number; width: number; height: number }) {
    if (!this.config.enableVirtualization) return elements;
    
    // ビューポート内の要素のみを表示
    const visibleElements = elements.filter(element => {
      const { position, size } = element;
      return this.isElementInViewport(position, size, viewport);
    });
    
    // 最大表示数制限
    return visibleElements.slice(0, this.config.maxVisibleElements);
  }
  
  private isElementInViewport(
    position: { x: number; y: number },
    size: { width: number; height: number },
    viewport: { x: number; y: number; width: number; height: number }
  ): boolean {
    return !(
      position.x + size.width < viewport.x ||
      position.x > viewport.x + viewport.width ||
      position.y + size.height < viewport.y ||
      position.y > viewport.y + viewport.height
    );
  }
  
  preloadImageResources(imageSources: string[]) {
    const loadPromises = imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });
    
    return Promise.allSettled(loadPromises);
  }
  
  private cleanupUnusedResources() {
    if (!this.canvas) return;
    
    // 使用されていないテクスチャやオブジェクトをクリーンアップ
    const objects = this.canvas.getObjects();
    objects.forEach(obj => {
      if (obj && typeof (obj as any).dispose === 'function') {
        // 画面外の要素で長時間使用されていないものを削除
        const lastUsed = (obj as any).lastUsedTimestamp || 0;
        if (Date.now() - lastUsed > 300000) { // 5分以上未使用
          (obj as any).dispose();
        }
      }
    });
    
    // ブラウザのガベージコレクションを促進
    if (window.gc) {
      window.gc();
    }
  }
  
  enableHighPerformanceMode() {
    if (!this.canvas) return;
    
    // 高パフォーマンスモードの設定
    this.canvas.selection = false;
    this.canvas.hoverCursor = 'default';
    this.canvas.moveCursor = 'default';
    this.canvas.renderOnAddRemove = false;
    
    // アニメーションの無効化
    this.canvas.centeredScaling = false;
    this.canvas.centeredRotation = false;
  }
  
  disableHighPerformanceMode() {
    if (!this.canvas) return;
    
    // 通常モードに戻す
    this.canvas.selection = true;
    this.canvas.hoverCursor = 'move';
    this.canvas.moveCursor = 'move';
    this.canvas.renderOnAddRemove = true;
    this.canvas.centeredScaling = true;
    this.canvas.centeredRotation = true;
  }
  
  getPerformanceReport() {
    return {
      queueLength: this.renderQueue.length,
      isRendering: this.isRendering,
      observedElements: this.observedElements.size,
      config: this.config
    };
  }
}

export const canvasOptimizer = new CanvasOptimizer();
