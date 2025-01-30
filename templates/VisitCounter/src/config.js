// src/config.js

const CONFIG = {
 // ユーザーカウントのテスト。0で本番。
 TEST_USER_COUNT: 0,
 // リストに表示させないID
 // リスナーリストにIDが書いてあるので、それをコピーしてください
 DISALLOWED_USER_IDS: [''],
 // カラーモード
 COLOR_NUMBER: 1,
 // 表示モード
 SVG_MODE: 1,
 // ユーザーリストを表示するか(true:表示する/false:表示しない)
 IS_VISIBLE_USERS: true,
 // キリ番(0でOFF)
 KIRIBAN: 0
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
