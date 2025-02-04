// common/commonTypes.ts
import { CharaType } from '../../public/types';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// コメントの追加型定義
export type CommentChara = Comment & {
 chara?: CharaType; // キャラクターデータ
};

export type ConfigType = {
 PLUGIN_UID?: string; // 使用しているプラグイン名
 BOT_USER_ID?: string; // プラグインのcomment.data.userId
 BOT_PARAM_FILTERS?: BotParamFilterType[]; // プラグインで設定したパラメータによるフィルタリング
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: string[]; // 通すユーザーIDリスト
 USER_DISALLOWED_IDS: string[]; // 通さないユーザーIDリスト
 USER_STATUS_FILTERS?: BotParamFilterType[]; // プラグインで設定したユーザーのステータスによるフィルタリング
 USER_WORD_MATCH?: UserWordMatchType[]; // ワードによるフィルタリング
};

export type BotParamFilterType = {
 id: string;
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};

export type UserWordMatchType = {
 id: string; // 適用したときのID
 isGift: boolean; // ギフトで有効にするか
 startsWith: string[]; // isGiftがfalseであるとき、この文字列で始まるコメントを有効にする
 regex?: string[]; // 正規表現でマッチするコメントを有効にする
};
