// src/config.js

const CONFIG = {
 PLUGIN_UID: 'OmikenPlugin01', // プラグインのディレクトリ名
 ALLOWED_USER_IDS: [], // 通すuserIDリスト
 DISALLOWED_USER_IDS: [] // 通さないuserIDリスト
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
