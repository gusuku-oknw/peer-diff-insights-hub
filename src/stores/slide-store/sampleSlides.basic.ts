import { Slide } from '@/types/slide.types';

// 基本的なサンプルスライド（最小限）
export const createBasicSampleSlides = (): Slide[] => [
  {
    id: 1,
    title: "タイトルスライド",
    content: "プレゼンテーション開始",
    html: `
      <div style="text-align: center; padding: 80px;">
        <h1 style="color: #1e40af; font-size: 64px; margin-bottom: 40px;">プレゼンテーション</h1>
        <p style="color: #666; font-size: 32px;">2025年 事業報告</p>
      </div>
    `,
    elements: [],
    notes: "タイトルスライドです"
  },
  {
    id: 2,
    title: "概要",
    content: "事業の概要説明",
    html: `
      <div style="padding: 60px;">
        <h2 style="color: #1e40af; font-size: 48px; margin-bottom: 40px;">事業概要</h2>
        <ul style="font-size: 28px; line-height: 1.8;">
          <li>新規事業の立ち上げ</li>
          <li>既存事業の拡大</li>
          <li>デジタル変革の推進</li>
        </ul>
      </div>
    `,
    elements: [],
    notes: "概要スライドです"
  },
  {
    id: 3,
    title: "結果",
    content: "四半期の結果",
    html: `
      <div style="padding: 60px;">
        <h2 style="color: #1e40af; font-size: 48px; margin-bottom: 40px;">Q4結果</h2>
        <div style="font-size: 32px; line-height: 2;">
          <p>売上: <strong style="color: #059669;">15% 増加</strong></p>
          <p>利益: <strong style="color: #059669;">20% 増加</strong></p>
          <p>顧客数: <strong style="color: #059669;">500社 追加</strong></p>
        </div>
      </div>
    `,
    elements: [],
    notes: "結果報告です"
  }
];