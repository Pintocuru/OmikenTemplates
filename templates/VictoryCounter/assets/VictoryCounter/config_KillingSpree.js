// config.js

const WORD_CONFIG = {
 // -------------------------------------------------
 // 一般設定
 // -------------------------------------------------
 TARGET_COUNT: 15, // 目標となる数値
 LOOP_COUNT: false, // 目標達成後、色を変化させるか
 // 数値が増えるたびに変化するテキスト
 PROGRESS_TEXTS: [
  'NO KILLS',
  'FIRST BLOOD',
  'DOUBLE KILL',
  'TRIPLE KILL',
  'MULTI KILL',
  'MULTI KILL',
  'KILLING SPREE!',
  'KILLING SPREE!',
  'KILLING SPREE!',
  'RAMPAGE!',
  'RAMPAGE!',
  'DOMINATING!',
  'DOMINATING!',
  'UNSTOPPABLE!',
  'UNSTOPPABLE!',
  'GODLIKE!'
 ],
 // TARGET_COUNT達成後、ランダムで変化するテキスト
 PROGRESS_TEXTS_AFTER: [],
 // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 PROGRESS_STYLES: [
  // 初期ランク - 暗めの色調
  {
   textColor: '#4b5563',
   colorClass: 'bg-gradient-to-br from-gray-600 to-gray-800' // 新兵/初心者
  },
  {
   textColor: '#9ca3af',
   colorClass: 'bg-gradient-to-br from-gray-400 to-gray-600' // 上等兵/経験者
  },
  {
   textColor: '#9ca3af',
   colorClass: 'bg-gradient-to-br from-gray-400 to-gray-600' // 上等兵/経験者
  },
  // 中間ランク - 攻撃的な赤系統
  {
   textColor: '#dc2626',
   colorClass: 'bg-gradient-to-br from-red-600 to-red-800' // 軍曹/ベテラン
  },
  {
   textColor: '#dc2626',
   colorClass: 'bg-gradient-to-br from-red-600 to-red-800' // 軍曹/ベテラン
  },
  {
   textColor: '#ef4444',
   colorClass: 'bg-gradient-to-br from-red-500 to-red-700' // 上級軍曹/エキスパート
  },
  {
   textColor: '#ef4444',
   colorClass: 'bg-gradient-to-br from-red-500 to-red-700' // 上級軍曹/エキスパート
  },
  {
   textColor: '#ef4444',
   colorClass: 'bg-gradient-to-br from-red-500 to-red-700' // 上級軍曹/エキスパート
  },
  // 上級ランク - 情熱を示すオレンジから黄色
  {
   textColor: '#f97316',
   colorClass: 'bg-gradient-to-br from-orange-500 to-orange-700' // 少尉/マスター
  },
  {
   textColor: '#f97316',
   colorClass: 'bg-gradient-to-br from-orange-500 to-orange-700' // 少尉/マスター
  },
  {
   textColor: '#d97706',
   colorClass: 'bg-gradient-to-br from-amber-600 to-amber-800' // 大尉/エリート
  },
  {
   textColor: '#d97706',
   colorClass: 'bg-gradient-to-br from-amber-600 to-amber-800' // 大尉/エリート
  },
  // 最高ランク - 高貴な紫と金
  {
   textColor: '#f59e0b',
   colorClass: 'bg-gradient-to-br from-amber-500 to-yellow-600' // 少佐/チャンピオン
  },
  {
   textColor: '#f59e0b',
   colorClass: 'bg-gradient-to-br from-amber-500 to-yellow-600' // 少佐/チャンピオン
  },
  {
   textColor: '#8b5cf6',
   colorClass: 'bg-gradient-to-br from-indigo-500 to-purple-600' // 将軍/レジェンド
  }
 ],

 // -------------------------------------------------
 // わんコメ設定(わんコメを稼働している時のみ機能します)
 // -------------------------------------------------
 // WordPartyの発火タイミング
 COUNT_PARTY: {
  10: '!count_10',
  20: '!count_20'
 },
 COUNT_PARTY_EVENT: '!count_event' // カウント増加時に発火するWordParty
};

const CONFIG = {
 ALLOWED_IDS: [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: 3, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['👑', '🔪', '🔫', '', ''] // 通すキーワード
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
