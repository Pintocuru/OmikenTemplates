// src/config.js

const CONFIG = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_IDS: [], // 通すユーザーIDリスト(!IDでネガティブ)
 ENABLED_SERVICES: 'all', // 通すプラットフォーム
 ACCESS_LEVEL: 1, // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
 IS_GIFT: false, // ギフトで有効にするか
 KEYWORDS: [] // isGiftがfalseなら、このコメントで判定(正規表現)
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
