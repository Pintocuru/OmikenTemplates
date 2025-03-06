// config.js

const WORD_CONFIG = {
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
 ACCESS_LEVEL: 1, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['おはよう', 'おはみこ', '', '', ''] // 通すuserIDリスト
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
