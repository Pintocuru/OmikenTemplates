// composables/useBingoItems.ts
import { BingoItem } from './types';

export function useBingoItems() {
 // 難易度別
 const rawItems: BingoItem[] = [
  // 配信状況(シンプル版では自己申告も含まれる)
  { text: '初コメ', mode: 'syoken', value: [1, 3, 10, 25, 50], weight: 10 },
  { text: '初コメ', mode: 'syoken', value: [2, 7, 20, 50, 100], weight: 7 },
  { text: '初コメ', mode: 'syoken', value: [5, 15, 30, 80, 200], weight: 3 },
  { text: 'スパチャ金額', value: [1, 2, 5, 10, 50], unit: 100, weight: 7 },
  { text: 'スパチャ回数', value: [1, 2, 3, 5, 25], weight: 7 },
  { text: 'メンバーシップ加入', value: [1, 2, 3, 5, 20], weight: 7 },
  { text: 'メンバーシップ加入', value: [2, 3, 5, 10, 50], weight: 4 },
  { text: 'メンバーシップ加入', value: [3, 5, 8, 15, 100], weight: 1 },
  { text: '同時視聴者数', value: [3, 5, 20, 50, 200], weight: 10 },
  { text: '同時視聴者数', value: [5, 10, 50, 100, 500], weight: 7 },
  { text: '同時視聴者数', value: [10, 20, 100, 150, 1000], weight: 3 },
  { text: '高評価', value: [3, 10, 20, 30, 100], weight: 10 },
  { text: '高評価', value: [5, 20, 40, 70, 200], weight: 7 },
  { text: '高評価', value: [10, 30, 80, 100, 500], weight: 3 },
  { text: '配信がホットトピックに載る', weight: 5 },

  // コメント(特殊)
  { text: '同じ絵文字が X回連続で使われる', value: [3, 5, 5, 5, 20], weight: 5 },
  { text: '同じコメントが X人続けて送られる', value: [3, 5, 5, 5, 20], weight: 5 },
  { text: 'リスナーが誤字をする', weight: 1 },

  // 配信者の行動
  { text: '配信開始から X分経過', value: [5, 10, 15, 20, 30], weight: 7 },
  { text: '配信がX分延長される', value: [15, 15, 15, 30, 60], weight: 5 },
  { text: '他の配信者が来訪/レイドする', weight: 5 },
  { text: 'コラボ配信の約束が決まる', weight: 5 },
  { text: '配信者が笑い続ける(秒)', value: [5, 5, 10, 10, 30], weight: 3 },
  { text: '同じ話題が X分以上続く', value: [10, 15, 15, 15, 30], weight: 5 },
  { text: '配信者が「ちょっと待って」と言う', value: [3, 5, 10, 15, 50], weight: 2 },
  { text: '配信者が「ヤバい」と言う', value: [3, 5, 10, 15, 50], weight: 2 },
  { text: '配信者が「あのー」と言う', value: [3, 5, 10, 15, 50], weight: 3 },
  { text: '配信者が悲鳴を上げる', value: [3, 5, 10, 15, 50], weight: 3 },
  { text: '配信者が歌う', weight: 2 },
  { text: '配信者がリスナーのアイコンを褒める', value: [3, 5, 10, 25, 100], weight: 3 },
  { text: '配信者が飲み物を飲む', weight: 1 },
  { text: 'BGMが変わる', weight: 1 },
  { text: '次回配信の予告がある', weight: 1 },

  // トーク/雑談配信向け
  { text: '配信者が個人的なエピソードを話す', weight: 3 },
  { text: '配信者が愚痴/不満を言う', weight: 2 },
  { text: '配信者が食事/料理の話をする', weight: 3 },
  { text: '配信者がシリアスな話題に触れる', weight: 2 },
  { text: '配信者が時事ネタに触れる', weight: 2 },
  { text: '配信者が趣味について熱く語る', weight: 3 },
  { text: '配信者がオススメを紹介する', weight: 3 },

  // イベント/特殊状況
  { text: 'スーパーチャットのお礼タイムが始まる', weight: 3 },
  { text: 'リスナー参加型企画が始まる', weight: 2 },
  { text: '配信者がASMR的な声を出す', weight: 3 },
  { text: '配信者が記念日/マイルストーンを祝う', weight: 5 },
  { text: '配信者がリスナーからのリクエストに応える', value: [1, 2, 3, 5, 20], weight: 5 },

  // ユーザー(自己申告)
  { text: 'クリップが作られる', value: [1, 1, 2, 3, 10], weight: 5 },
  { text: 'マシュマロが投げられる', value: [2, 5, 8, 10, 50], weight: 5 },
  { text: 'モデレーターがコメント対応する', weight: 1 },
  { text: 'ファンアートがSNSで投稿される', value: [1, 1, 2, 3, 10], weight: 3 }
 ];

 // コメント内容(シンプル版では未使用)
 //{ text: '「かわいい」コメント', value: [5, 8, 12, 15, 20], weight: 5 },
 //{ text: '「草」や「w」のコメント', value: [10, 15, 20, 25, 30], weight: 4 },
 //{ text: '「好き」のコメント', value: [5, 8, 10, 12, 15], weight: 3 },
 //{ text: '「助かる」のコメント', value: [3, 6, 8, 10, 12], weight: 4 },
 //{ text: '絵文字を含むコメント', value: [5, 10, 15, 20, 25], weight: 4 },
 //{ text: 'スタンプの使用', value: [3, 6, 9, 12, 15], weight: 4 },
 //{ text: '「すごい」コメント', value: [8, 12, 15, 18, 20], weight: 3 },

 // 難易度でアイテムをグループ化
 const items: BingoItem[][] = [
  [], // ダミー（難易度は1から始まるため）
  rawItems.filter((item) => (item.difficulty ?? 1) >= 1), // Level1
  rawItems.filter((item) => (item.difficulty ?? 1) >= 2), // Level2
  rawItems.filter((item) => (item.difficulty ?? 1) >= 3), // Level3
  rawItems.filter((item) => (item.difficulty ?? 1) >= 4), // Level4
  rawItems // Level5
 ];

 return {
  items
 };
}
