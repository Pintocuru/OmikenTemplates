// src/config.js

const CONFIG = {
 ALLOWED_IDS: [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: 1, // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
 IS_GIFT: false, // ギフトで有効にするか
 KEYWORDS: [] // isGiftがfalseなら、このコメントで判定(正規表現)
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
