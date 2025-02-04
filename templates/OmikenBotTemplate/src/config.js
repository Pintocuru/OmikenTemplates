// src/config.js

const CONFIG = {
 PLUGIN_UID: 'OmikenPlugin01', // プラグインのディレクトリ名
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [] // 通さないuserIDリスト
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
