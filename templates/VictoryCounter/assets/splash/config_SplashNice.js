// config.js

const WORD_CONFIG = {
 // -------------------------------------------------
 // 一般設定
 // -------------------------------------------------
 TARGET_COUNT: 15, // 目標となる数値
 LOOP_COUNT: false, // 目標達成後、色を変化させるか
 SECOND_NAME_MODE: false, // 隠しモード(trueにすると、Splatoonの二つ名になります)
 // 数値が増えるたびに変化するテキスト
 PROGRESS_TEXTS: [
  'カモン！',
  'ナイス！',
  'ナイス！',
  'クール！',
  'クール！',
  'イカしてる！',
  'イカしてる！',
  'グレイト！',
  'グレイト！',
  'アメイジング！',
  'アメイジング！',
  'ファンタスティック！',
  'ファンタスティック！',
  'スーパースター！',
  'スーパースター！',
  'ウルトラスーパー！'
 ],
 // TARGET_COUNT達成後、ランダムで変化するテキスト
 PROGRESS_TEXTS_AFTER: [],
 // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 PROGRESS_STYLES: [
  {
   textColor: '#0d9466',
   colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
  },
  {
   textColor: '#0b8dc2',
   colorClass: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  {
   textColor: '#b737c4',
   colorClass: 'bg-gradient-to-br from-purple-500 to-pink-500'
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
