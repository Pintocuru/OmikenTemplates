// types.d.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CharaType, DrawsBase, GameType } from '../../../public/types';

export interface GameDataType extends GameType {
 rankings: Ranking[];
 rankingHistory?: RankingHistory[];
}

// ランキングデータ
export interface Ranking extends DrawsBase {
 userId: string;
 name: string;
 rate: number;
}

export type RankingHistory = {
 date: string;
 rankings: Ranking[];
};

export interface Props {
 rankings: Ranking[];
 currentUserId?: string;
}

// ---

// 共通

// AxiosResponseの代わりに使用する型
export interface AxiosResponse<T = any> {
 data: T;
 status: number;
 statusText: string;
 headers: Record<string, string>;
 config: object;
 request?: any;
}

export type CommentTemp = Comment & {
 css?: CharaType['color']; // コメントの色
 index?: number; // 並び順
};
