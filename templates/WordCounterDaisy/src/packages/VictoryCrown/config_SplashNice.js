// config.js

const WORD_CONFIG = {
 generator: {
  // -------------------------------------------------
  // 一般設定
  // -------------------------------------------------
  TARGET: 15, // 目標となる数値
  IS_LOOP: false, // 目標達成後、色を変化させるか
  // countが初期値のテキスト・カラー
  TEXTS_FIRST: 'カモン！',
  STYLES_FIRST: {
   textColor: '#0d9466', // Green
   colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
  },
  // 数値が増えるたびに変化するテキスト
  TEXTS: [
   'ナイス！',
   'クール！',
   'イカしてる！',
   'グレイト！',
   'アメイジング！',
   'ファンタスティック！',
   'スーパースター！',
   'ウルトラスーパー！'
  ],
  // TARGET_COUNT達成後、ランダムで変化するテキスト
  TEXTS_AFTER: [],
  STYLES: [
   {
    textColor: '#c70064', // Deep Magenta
    colorClass: 'bg-gradient-to-br from-pink-700 via-rose-300 to-red-700'
   },
   {
    textColor: '#008c4a', // Deep Neon Green
    colorClass: 'bg-gradient-to-br from-green-800 via-emerald-200 to-teal-700'
   },
   {
    textColor: '#0050a5', // Deep Blue
    colorClass: 'bg-gradient-to-br from-cyan-800 via-blue-300 to-indigo-700'
   },
   {
    textColor: '#b35500', // Deep Orange
    colorClass: 'bg-gradient-to-br from-orange-700 via-amber-300 to-yellow-600'
   },
   {
    textColor: '#7d007d', // Dark Purple
    colorClass: 'bg-gradient-to-br from-indigo-800 via-purple-300 to-fuchsia-900'
   },
   {
    textColor: '#8a7300', // Deep Yellow
    colorClass: 'bg-gradient-to-br from-yellow-700 via-amber-300 to-orange-800'
   }
  ],
  EASTER_MODE: false // 隠しモード(trueにすると、Splatoonの二つ名になります)
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
  multiplier: 1, // 値を掛け算する
  countMode: 'comment' // カウントモード
 }
};

const CONFIG = {
 ENABLED_SERVICES: [], // 適用するプラットフォーム('!'でネガティブ、'platforms'で配信サイトのみ)
 ALLOWED_IDS: [], // 適用するユーザーIDリスト('!'でネガティブ)
 ACCESS_LEVEL: 3, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['👑', '優勝', '勝利'] // インクリメントするキーワード
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
