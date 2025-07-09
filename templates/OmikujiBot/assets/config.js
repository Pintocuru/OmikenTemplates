// src/config.js

const CONFIG = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ENABLED_SERVICES: 'all',
 THRESHOLD: {
  conditions: [], // user / access / gift / comment のうち判定するプロパティ
  user: [], // 通すユーザーIDリスト(!IDでネガティブ)
  access: [], // ユーザーの役職
  gift: [], // ギフトの有無
  comment: [] // コメントを参照する
 }
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
