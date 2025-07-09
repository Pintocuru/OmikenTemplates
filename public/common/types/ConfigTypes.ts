// common/types/ConfigTypes.ts
import { CharaType } from '../../type';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceType } from '@onecomme.com/onesdk/types/Service';
import { ConfigUserThreshold } from './ThresholdTypes';

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
 THRESHOLD: ConfigUserThreshold; // 条件設定
};

export type BotParamFilterType = {
 id: string; // 適用したときのID
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};

// おみくじBOTプラグインでBOT用のconfig
export type ConfigBotType = {
 PLUGIN_UID: string;
 PLUGIN_RULE_ID: string | null; // Gamesで使う、rulesのid
 BOT_USER_ID?: string; // プラグインのcomment.data.userId(Default:'FirstCounter')
 BOT_POST_PARAM: string[]; // paramがPOST_PARAMに含まれているか(!paramなら含まれていないか)
};

// subscribe/GetUserComments.ts 用の Config
export type ConfigUserType = {
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 ENABLED_SERVICES: 'all' | 'platforms' | ServiceType; // 'all'/'platforms'/サービスリスト
 THRESHOLD: ConfigUserThreshold; // 条件設定
};
