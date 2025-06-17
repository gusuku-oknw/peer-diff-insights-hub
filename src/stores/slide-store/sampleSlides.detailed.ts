import { Slide } from '@/types/slide.types';

// 詳細なサンプルスライド（追加コンテンツ）
export const createDetailedSampleSlides = (): Slide[] => [
  {
    id: 4,
    title: "市場分析",
    content: "市場動向と競合分析",
    html: `
      <div style="padding: 60px;">
        <h2 style="color: #1e40af; font-size: 48px; margin-bottom: 40px;">市場分析</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-size: 24px;">
          <div>
            <h3 style="color: #dc2626; margin-bottom: 20px;">市場動向</h3>
            <ul style="line-height: 1.6;">
              <li>デジタル化の加速</li>
              <li>リモートワークの定着</li>
              <li>サステナビリティ重視</li>
            </ul>
          </div>
          <div>
            <h3 style="color: #dc2626; margin-bottom: 20px;">競合状況</h3>
            <ul style="line-height: 1.6;">
              <li>新規参入企業の増加</li>
              <li>価格競争の激化</li>
              <li>差別化の重要性</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    elements: [],
    notes: "市場分析スライドです"
  },
  {
    id: 5,
    title: "今後の戦略",
    content: "2025年の戦略方向性",
    html: `
      <div style="padding: 60px;">
        <h2 style="color: #1e40af; font-size: 48px; margin-bottom: 40px;">今後の戦略</h2>
        <div style="font-size: 28px; line-height: 2;">
          <div style="margin-bottom: 30px;">
            <h3 style="color: #059669;">1. 技術革新</h3>
            <p style="margin-left: 40px;">AI・機械学習の活用拡大</p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #059669;">2. グローバル展開</h3>
            <p style="margin-left: 40px;">アジア・太平洋地域への進出</p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #059669;">3. 人材育成</h3>
            <p style="margin-left: 40px;">DX人材の積極採用・育成</p>
          </div>
        </div>
      </div>
    `,
    elements: [],
    notes: "戦略スライドです"
  },
  {
    id: 6,
    title: "まとめ",
    content: "プレゼンテーションの総括",
    html: `
      <div style="text-align: center; padding: 80px;">
        <h2 style="color: #1e40af; font-size: 48px; margin-bottom: 60px;">まとめ</h2>
        <div style="font-size: 32px; line-height: 2; max-width: 800px; margin: 0 auto;">
          <p style="margin-bottom: 40px;">🎯 目標を上回る成果を達成</p>
          <p style="margin-bottom: 40px;">🚀 新たな成長機会を獲得</p>
          <p style="margin-bottom: 40px;">💡 革新的な戦略で未来へ</p>
        </div>
        <p style="font-size: 28px; color: #666; margin-top: 60px;">ご清聴ありがとうございました</p>
      </div>
    `,
    elements: [],
    notes: "まとめスライドです"
  }
];