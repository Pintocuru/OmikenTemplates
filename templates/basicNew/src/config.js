// src/config.js

const CONFIG = {
 PLUGIN_UID: 'OmikenPlugin02', // 使用しているプラグイン名
 BOT_USER_ID: 'FirstCounter', // プラグインのcomment.data.userId
 ALLOWED_USER_IDS: [], // 通すuserIDリスト
 DISALLOWED_USER_IDS: [] // 通さないuserIDリスト
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
