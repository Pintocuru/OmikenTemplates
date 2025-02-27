// config.js

const TIME_CONFIG = {
 // -------------------------------------------------
 // 一般設定
 // -------------------------------------------------
 ALWAYS_VISIBLE: false, // 常時表示させるか(true/false)
 MIN_SECONDS: 10, // タイマーの最低値(秒,最低10秒)
 MAX_SECONDS: 21600, // タイマーの最大値(秒,最大43200秒=12時間)
 AFTER_SHOW: 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: 10, // 秒数を丸める(default=10秒単位)

 // -------------------------------------------------
 // わんコメ設定(わんコメを稼働している時のみ機能します)
 // -------------------------------------------------
 // WordPartyの発火タイミング
 COUNT_PARTY: {
  10: '!count_10',
  20: '!count_20'
 },
 COUNT_PARTY_START: '!count_start', // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: '!count_finish' // タイマー0で発火するWordParty
};

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: 3 // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.TIME_CONFIG = TIME_CONFIG;
