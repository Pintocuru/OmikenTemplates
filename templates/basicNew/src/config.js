// src/config.js

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: 1 // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
