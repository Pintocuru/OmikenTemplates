// src/MainGenerator/utils/config.ts
import { ConfigUserType } from '@common/CommonSchema';

/**
 * アプリケーション設定を読み込む
 * @returns {ConfigUserType} アプリケーション設定
 */
export function getAppConfig(): ConfigUserType {
 return {
  IS_DIFF_MODE: false, // 差分モードにするか(true:'diff',false:'all')
  ENABLED_SERVICES: window.CONFIG?.ENABLED_SERVICES || 'all', // 通すプラットフォーム
  ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
  ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
  IS_GIFT: window.CONFIG?.IS_GIFT || false, // ギフトで有効にするか
  KEYWORDS: window.CONFIG?.KEYWORDS || [] // isGiftがfalseなら、このコメントで判定(正規表現)
 };
}
