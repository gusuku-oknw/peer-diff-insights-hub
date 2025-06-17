declare module 'pptx-preview' {
  export interface PreviewerOptionsType {
    width?: number;
    height?: number;
  }

  export interface PPTXPreviewer {
    preview(buffer: ArrayBuffer): Promise<void>;
    destroy?(): void;
  }

  export function init(container: HTMLElement, options: PreviewerOptionsType): PPTXPreviewer;
}