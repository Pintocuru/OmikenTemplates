// src/config.js

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: 1, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 AFTER_SHOW: 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: 10 // 秒数を丸める(default=10秒単位)
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
