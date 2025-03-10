// config.js

const WORD_CONFIG = {
 generator: {
  // -------------------------------------------------
  // 一般設定
  // -------------------------------------------------
  TARGET: 15, // 目標となる数値
  IS_LOOP: false, // 目標達成後、色を変化させるか
  // countが初期値のテキスト・カラー
  TEXTS_FIRST: 'NO KILLS',
  STYLES_FIRST: {
   textColor: '#4b5563',
   colorClass: 'bg-gradient-to-br from-gray-600 to-gray-800' // 新兵/初心者
  },
  // 数値が増えるたびに変化するテキスト
  TEXTS: [
   'FIRST BLOOD',
   'FIRST BLOOD',
   'DOUBLE KILL',
   'TRIPLE KILL',
   'MULTI KILL',
   'MULTI KILL',
   'MULTI KILL',
   'KILLING SPREE!',
   'KILLING SPREE!',
   'KILLING SPREE!',
   'RAMPAGE!',
   'RAMPAGE!',
   'DOMINATING!',
   'DOMINATING!',
   'DOMINATING!',
   'UNSTOPPABLE!',
   'UNSTOPPABLE!',
   'GODLIKE!',
   'GODLIKE!'
  ],
  // TARGET_COUNT達成後、ランダムで変化するテキスト
  TEXTS_AFTER: [
   'LEGENDARY!',
   'MYTHICAL!',
   'TRANSCENDENT!',
   'ASCENDED!',
   'IMMORTAL!',
   'DIVINE!',
   'INHUMAN REACTIONS!',
   'BEYOND GODLIKE!',
   'OMNIPOTENT!',
   'UNFATHOMABLE POWER!',
   'ABSOLUTE DESTRUCTION!',
   'YOU ARE THE FINAL BOSS!'
  ],
  STYLES: [
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
    textColor: '#ef4444',
    colorClass: 'bg-gradient-to-br from-red-500 to-red-700' // 上級軍曹/エキスパート
   },
   // 上級ランク - 情熱を示すオレンジから黄色
   {
    textColor: '#f97316',
    colorClass: 'bg-gradient-to-br from-orange-500 to-orange-700' // 少尉/マスター
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
    textColor: '#5a189a', // 青みの強い紫
    colorClass: 'bg-gradient-to-br from-violet-700 via-blue-600 to-indigo-900 animate-gradient' // クールで神秘的な紫
   }
  ]
 },
 counter: {
  // -------------------------------------------------
  // わんコメ設定(わんコメを稼働している時のみ機能します)
  // -------------------------------------------------
  // WordPartyの発火タイミング
  PARTY: {
   10: '!count_10',
   20: '!count_20'
  },
  PARTY_EVENT: '!count_event', // カウント増加時に発火するWordParty
  PARTY_SUCCESS: '!count_success', // TARGET_COUNT達成時に発火するWordParty

  // -------------------------------------------------
  // 特殊な設定(これらを変更すると挙動が変わります)
  // -------------------------------------------------
  COUNT_MODE: 'comment' // カウントモード
 }
};

const CONFIG = {
 ALLOWED_IDS: [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: 3, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['👑', '優勝', '勝利'] // インクリメントするキーワード
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
