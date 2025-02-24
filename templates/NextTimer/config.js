// src/config.js

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: 1 // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
};

// スナイプタイマー用設定
const TIME_CONFIG = {
 //
 ALWAYS_VISIBLE: true, // 常時表示させるか
 AFTER_SHOW: 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: 10, // 秒数を丸める(default=10秒単位)

 // WordPartyの発火タイミング
 COUNT_PARTY: {
  30: 'halfway',
  60: 'start'
 },
 COUNT_PARTY_START: 'start', // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: 'finish' // タイマー0で発火するWordParty
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.TIME_CONFIG = TIME_CONFIG;
