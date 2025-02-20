// src/config.js

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [] // 通さないuserIDリスト
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;

// src/config.js

const CONFIG = {
 // ユーザーカウントのテスト。0で本番。
 TEST_USER_COUNT: 0,
 // リストに表示させないID
 // リスナーリストにIDが書いてあるので、それをコピーしてください
 USER_DISALLOWED_IDS: [''],
 // カラーモード
 COLOR_NUMBER: 1,
 // 表示モード
 SVG_MODE: 1,
 // ユーザーリストを表示するか(true:表示する/false:表示しない)
 IS_VISIBLE_USERS: true,
 // キリ番(0でOFF)
 KIRIBAN: 0,

 /* 時間経過後に表示する時間(秒) */
 AFTER_SHOW: 5,
 /* 秒数を丸める(default=10秒単位) */
 SECOND_ADJUST: 10
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
