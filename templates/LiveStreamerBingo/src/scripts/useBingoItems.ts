// composables/useBingoItems.ts
import { BingoItem } from './types';

export function useBingoItems() {
 // 難易度別 & 固定項目
 const rawItems: BingoItem[] = [
  // 配信状況
  { text: '初コメント', mode: 'syoken', value: [3, 5, 7, 10, 15], weight: 5 },
  { text: '配信開始から X分経過', value: [5, 10, 15, 20, 30], weight: 5 },
  { text: 'スパチャ送信 X回以上', value: [2, 4, 6, 8, 10], weight: 3 },
  { text: '視聴者数 X人以上', value: [30, 50, 70, 100, 150], weight: 4 },
  { text: 'メンバーシップ加入 X人以上', value: [1, 2, 3, 4, 5], difficulty: 4, weight: 2 },

  // コメント内容
  { text: '「かわいい」コメント', target: ['かわいい'], value: [5, 8, 12, 15, 20], weight: 5 },
  {
   text: '「草」や「w」のコメント',
   target: ['草', 'ww++', 'ｗ++'],
   value: [10, 15, 20, 25, 30],
   weight: 4
  },
  { text: '「好き」', value: [5, 8, 10, 12, 15], weight: 3 },
  { text: '「助かる」のコメント X回以上', value: [3, 6, 8, 10, 12], weight: 4 },
  { text: '絵文字を含むコメント X回以上', value: [5, 10, 15, 20, 25], weight: 4 },
  { text: 'スタンプの使用 X回以上', value: [3, 6, 9, 12, 15], difficulty: 2, weight: 4 },
  { text: '「すごい」コメント', value: [8, 12, 15, 18, 20], difficulty: 3, weight: 3 },
  { text: '配信者が笑い続ける時間 X秒以上', value: [5, 10, 15, 20, 30], difficulty: 3, weight: 3 },

  // コメント(特殊)
  { text: '同じ視聴者から連続コメント X回以上', value: [3, 5, 7, 9, 10], difficulty: 3, weight: 3 },
  { text: '同じ絵文字が X回連続で使われる', value: [3, 4, 5, 7, 8], difficulty: 3, weight: 3 },
  { text: '同じコメントが X人から続けて送られる', value: [3, 4, 5, 7, 8], weight: 3 },

  // 配信者の行動
  { text: '同じ話題が X分以上続く', value: [5, 7, 10, 15, 20], difficulty: 3, weight: 3 },
  { text: '配信者が水/飲み物を飲む X回以上', value: [2, 3, 4, 5, 6], weight: 4 },
  { text: 'BGMが変わる', weight: 5 },
  { text: '次回配信の予告がある', difficulty: 2, weight: 4 },

  // ユーザー(自己申告)
  { text: 'モデレーターがコメント対応する', difficulty: 3, weight: 3 },
  { text: 'ファンアートが表示される X回以上', value: [1, 2, 3, 4, 5], difficulty: 4, weight: 2 }
 ];

 // 難易度でアイテムをグループ化
 const items: BingoItem[][] = [
  [], // ダミー（難易度は1から始まるため）
  rawItems.filter((item) => (item.difficulty ?? 1) >= 1), // Level1
  rawItems.filter((item) => (item.difficulty ?? 1) >= 2), // Level2
  rawItems.filter((item) => (item.difficulty ?? 1) >= 3), // Level3
  rawItems.filter((item) => (item.difficulty ?? 1) >= 4), // Level4
  rawItems // Level5
 ];

 const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
 };

 const formatCellText = (item: BingoItem, targetValue?: number): string => {
  if (!targetValue && item.value === null) {
   return item.text; // 固定項目
  }

  return targetValue ? item.text.replace(/X/g, targetValue.toString()) : item.text;
 };

 return {
  items,
  shuffleArray,
  formatCellText
 };
}
