// common/commonTypes.ts
import { CharaType } from '../../public/types';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// コメントの追加型定義
export type CommentChara = Comment & {
 chara?: CharaType; // キャラクターデータ
 userWordMatchId?: string; // USER_WORD_MATCH が適用した際のID
};

export type ConfigType = ConfigNoPlugin | ConfigPlugin;

// プラグインがない場合の型
export type ConfigNoPlugin = {
 PLUGIN_UID?: null; // プラグインなし
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: string[]; // 通すユーザーIDリスト
 USER_DISALLOWED_IDS: string[]; // 通さないユーザーIDリスト
 USER_WORD_MATCH: string[] | UserWordMatchType[]; // ワードによるフィルタリング
 BOT_USER_ID?: never;
 BOT_PARAM_FILTERS?: never;
 USER_STATUS_FILTERS?: never;
};

// プラグインがある場合の型
export type ConfigPlugin = {
 PLUGIN_UID: string; // プラグインあり
 IS_DIFF_MODE: true; // 差分モードのみ
 BOT_USER_ID?: string; // プラグインのcomment.data.userId
 BOT_PARAM_FILTERS: BotParamFilterType[]; // パラメータによるフィルタリング
 USER_STATUS_FILTERS: BotParamFilterType[]; // ユーザーのステータスによるフィルタリング
 USER_ALLOWED_IDS?: never;
 USER_DISALLOWED_IDS?: never;
 USER_WORD_MATCH?: never;
};

export type BotParamFilterType = {
 id: string;
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};

export type UserWordMatchType = {
 id: string; // 適用したときのID
 isGift: boolean; // ギフトで有効にするか
 keywords: string[]; // isGiftがfalseであるとき、この文字列で始まるコメントを有効にする
 regex?: string[]; // 正規表現でマッチするコメントを有効にする
};
