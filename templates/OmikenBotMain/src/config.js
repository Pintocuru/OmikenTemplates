// src/config.js

const CONFIG = {
 PLUGIN_UID: 'OmikenPlugin01', // 使用しているプラグイン名
 BOT_USER_ID: 'FirstCounter', // プラグインのcomment.data.userId
 POST_PARAM: ['toast'], // postが特定のparamのときに表示
 NON_POST_PARAM: [], // POST_PARAMが空の時、postが特定のparamではないときに表示
 IS_DIFF_MODE: true // 差分モードにするか(true:'diff',false:'all')
};

if (typeof window !== "undefined") window.CONFIG = CONFIG;