// composables/useBingoItems.ts
import { BingoItem } from './types';

export function useBingoItems() {
 // 難易度別
 const rawItems: BingoItem[] = [
  // 配信状況(シンプル版では自己申告も含まれる)
  { title: '初コメ(初級)', target: [1, 3, 10, 25, 50], weight: 10 },
  { title: '初コメ(中級)', target: [2, 7, 20, 50, 100], weight: 7 },
  { title: '初コメ(上級)', target: [5, 15, 30, 80, 200], weight: 3 },
  { title: '初コメ(超級)', target: [10, 30, 70, 200, 500], weight: 1 },
  { title: 'スパチャ金額', target: [1, 1, 2, 5, 20], unit: 100, weight: 10 },
  { title: 'スパチャ金額', target: [2, 2, 5, 20, 50], unit: 100, weight: 7 },
  { title: 'スパチャ金額', target: [5, 5, 10, 50, 100], unit: 100, weight: 3 },
  { title: 'スパチャ人数', target: [1, 1, 3, 5, 10], weight: 10 },
  { title: 'スパチャ人数', target: [2, 3, 5, 10, 25], weight: 7 },
  { title: 'スパチャ人数', target: [3, 5, 7, 20, 50], weight: 3 },
  { title: 'メンバーシップ加入', target: [1, 2, 3, 5, 10], weight: 7 },
  { title: 'メンバーシップ加入', target: [2, 3, 5, 10, 25], weight: 4 },
  { title: 'メンバーシップ加入', target: [3, 5, 7, 20, 50], weight: 1 },
  { title: '同時視聴者数', target: [3, 5, 20, 50, 200], weight: 10 },
  { title: '同時視聴者数', target: [5, 10, 50, 100, 500], weight: 7 },
  { title: '同時視聴者数', target: [10, 20, 100, 150, 1000], weight: 3 },
  { title: '高評価', target: [3, 10, 20, 30, 100], weight: 10 },
  { title: '高評価', target: [5, 20, 40, 70, 200], weight: 7 },
  { title: '高評価', target: [10, 30, 80, 100, 500], weight: 3 },
  { title: '配信がホットトピックに載る', weight: 5 },

  // コメント内容
  { title: '「かわいい」コメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: '「好き」コメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: '「すごい」コメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: '「草」「w」コメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: '「助かる」コメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: 'ファンマを含むコメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: '絵文字を含むコメント人数', target: [5, 10, 30, 50, 100], weight: 4 },
  { title: 'スタンプの使用人数', target: [5, 10, 30, 50, 100], weight: 4 },

  // コメント(特殊)
  { title: '同じ絵文字が X回連続で使われる', target: [3, 5, 5, 5, 20], weight: 5 },
  { title: '同じコメントが X人続けて送られる', target: [3, 5, 5, 5, 20], weight: 5 },
  { title: 'リスナーが誤字をする', weight: 1 },

  // 配信者の行動
  { title: '配信開始から X分経過', target: [5, 10, 15, 20, 30], weight: 7 },
  { title: '配信がX分延長される', target: [15, 15, 15, 30, 60], weight: 5 },
  { title: '他の配信者が来訪/レイドする', weight: 5 },
  { title: 'コラボ配信の約束が決まる', weight: 5 },
  { title: '配信者が笑い続ける(秒)', target: [5, 5, 10, 10, 30], weight: 3 },
  { title: '同じ話題が X分以上続く', target: [10, 15, 15, 15, 30], weight: 5 },
  { title: '配信者が「ちょっと待って」と言う', target: [3, 5, 10, 15, 50], weight: 2 },
  { title: '配信者が「ヤバい」と言う', target: [3, 5, 10, 15, 50], weight: 2 },
  { title: '配信者が「あのー」と言う', target: [3, 5, 10, 15, 50], weight: 3 },
  { title: '配信者が悲鳴を上げる', target: [3, 5, 10, 15, 50], weight: 3 },
  { title: '配信者が歌う', weight: 2 },
  { title: '配信者がリスナーのアイコンを褒める', target: [3, 5, 10, 25, 100], weight: 3 },
  { title: '配信者が飲み物を飲む', weight: 1 },
  { title: 'BGMが変わる', weight: 1 },
  { title: '次回配信の予告がある', weight: 1 },

  // トーク/雑談配信向け
  { title: '配信者が個人的なエピソードを話す', weight: 3 },
  { title: '配信者が愚痴/不満を言う', weight: 2 },
  { title: '配信者が食事/料理の話をする', weight: 3 },
  { title: '配信者がシリアスな話題に触れる', weight: 2 },
  { title: '配信者が時事ネタに触れる', weight: 2 },
  { title: '配信者が趣味について熱く語る', weight: 3 },
  { title: '配信者がオススメを紹介する', weight: 3 },

  // イベント/特殊状況
  { title: 'スーパーチャットのお礼タイムが始まる', weight: 3 },
  { title: 'リスナー参加型企画が始まる', weight: 2 },
  { title: '配信者がASMR的な声を出す', weight: 3 },
  { title: '配信者が記念日/マイルストーンを祝う', weight: 5 },
  { title: '配信者がリスナーからのリクエストに応える', target: [1, 2, 3, 5, 20], weight: 5 },

  // ユーザー(自己申告)
  { title: 'クリップが作られる', target: [1, 1, 2, 3, 10], weight: 5 },
  { title: 'マシュマロが投げられる', target: [2, 5, 8, 10, 50], weight: 5 },
  { title: 'モデレーターがコメント対応する', weight: 1 },
  { title: 'ファンアートがSNSで投稿される', target: [1, 1, 2, 3, 10], weight: 3 }
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

 return {
  items
 };
}
