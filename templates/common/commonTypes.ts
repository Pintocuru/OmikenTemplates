// common/commonTypes.ts
import { CharaType } from '../../public/types';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// コメントの追加型定義
export type CommentChara = Comment & {
 chara?: CharaType; // キャラクターデータ
};

export type ConfigType = {
 PLUGIN_UID: string | null; // 使用しているプラグイン名
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 BOT_USER_ID: string | null; // プラグインのcomment.data.userId
 ALLOWED_USER_IDS: string[]; // 通すユーザーIDリスト
 DISALLOWED_USER_IDS: string[]; // 通さないユーザーIDリスト
 FILTERS: FilterType[];
};

export type FilterType = {
 id: string;
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};
