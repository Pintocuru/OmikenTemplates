// config.js

const WORD_CONFIG = {
 // -------------------------------------------------
 // 一般設定
 // -------------------------------------------------
 TARGET_COUNT: 5, // 目標となる数値
 LOOP_COUNT: true, // 目標達成後、色を変化させるか
 // 数値が増えるたびに変化するテキスト
 PROGRESS_TEXTS: [
  '⚔️ いざ、尋常に',
  '⚡ 一刀両断！',
  '🌀 神速斬り！',
  '🔥 炎魔討伐！',
  '✨ 奥義炸裂！'
 ],
 // TARGET_COUNT達成後、ランダムで変化するテキスト
 PROGRESS_TEXTS_AFTER: [
  '⚔️ 妖気斬り！',
  '⚡ 一刀両断！',
  '🌀 神速斬り！',
  '🔥 炎魔討伐！',
  '✨ 奥義炸裂！',
  '☯️ 陰陽調和！',
  '⚡ 雷鳴閃光斬！'
 ],
 // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 PROGRESS_STYLES: [
  {
   textColor: '#000',
   colorClass: 'bg-gradient-to-br from-red-700 via-red-600 to-red-800'
  },
  {
   textColor: '#000',
   colorClass: 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900'
  },
  { textColor: '#000', colorClass: 'bg-gradient-to-br from-stone-700 via-yellow-700 to-amber-800' },
  { textColor: '#000', colorClass: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900' }
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
