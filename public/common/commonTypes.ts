// common/commonTypes.ts
import { CharaType } from '../type';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceType } from '@onecomme.com/onesdk/types/Service';

// コメントの追加型定義
export type CommentChara = Comment & {
 chara?: CharaType; // キャラクターデータ
 userWordMatchId?: string; // USER_WORD_MATCH が適用した際のID
};

export type ConfigType = ConfigNoPlugin | ConfigPlugin;

// プラグインなしの設定
export type ConfigNoPlugin = UserSpecificConfig & {
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 PLUGIN_UID: null; // プラグインなし
};

// プラグインありの設定
export type ConfigPlugin = PluginSpecificConfig & {
 IS_DIFF_MODE: true; // 差分モードのみ
};

// プラグイン関連の設定
type PluginSpecificConfig = {
 PLUGIN_UID: string;
 PLUGIN_RULE_ID: string | null; // Gamesで使う、rulesのid
 BOT_USER_ID?: string; // プラグインのcomment.data.userId
 BOT_PARAM_FILTERS: BotParamFilterType[]; // パラメータによるフィルタリング
 USER_STATUS_FILTERS: BotParamFilterType[]; // ユーザーのステータスによるフィルタリング
};

// ユーザー関連の設定
type UserSpecificConfig = {
 USER_ALLOWED_IDS: string[]; // 通すユーザーIDリスト
 USER_DISALLOWED_IDS: string[]; // 通さないユーザーIDリスト
 USER_ACCESS_LEVEL?: 1 | 2 | 3 | 4; // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
 USER_WORD_MATCH: UserWordMatchType[]; // ワードによるフィルタリング
};

export type BotParamFilterType = {
 id: string; // 適用したときのID
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};

export type UserWordMatchType = {
 id: string; // 適用したときのID
 isGift: boolean; // ギフトで有効にするか
 keywords: string[]; // isGiftがfalseであるとき、この文字列で始まるコメントを有効にする
 regex?: RegExp[]; // 正規表現でマッチするコメントを有効にする
};

// おみくじBOTプラグインでBOT用のconfig
export type ConfigBotType = {
 PLUGIN_UID: string;
 PLUGIN_RULE_ID: string | null; // Gamesで使う、rulesのid
 BOT_USER_ID?: string; // プラグインのcomment.data.userId(Default:'FirstCounter')
 BOT_POST_PARAM: string[]; // paramがPOST_PARAMに含まれているか(!paramなら含まれていないか)
};

// おみくじBOTプラグインでBOT用のconfig
export type ConfigUserType = {
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 ENABLED_SERVICES: 'platforms' | ServiceType; // 'platforms' またはサービスリスト
 ALLOWED_IDS: string[]; // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL?: 1 | 2 | 3 | 4; // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
 IS_GIFT: boolean; // ギフトで有効にするか
 KEYWORDS: string[]; // isGiftがfalseなら、このコメントで判定(正規表現)
};
