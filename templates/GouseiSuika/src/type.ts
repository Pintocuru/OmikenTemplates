// src/type.ts
import { GameType, UserStatsType, VisitType } from '@type/index';

export interface SuikaGameType extends GameType {
 rankings: UserRankingType[];
 rankingHistory?: RankingHistory[];
 totalPoint: number;
}

// ランキングデータ定義
export interface UserRankingType extends Partial<UserStatsType> {
 userId: string;
 name?: string;
 rank?: number;
 rate?: number;
}

// ランキング履歴定義
type RankingHistory = {
 date: string;
 age: number;
 rankings: UserRankingType[];
};

export interface SuikaVisitType {
 userId: string;
 name: string;
 draws: number;
 isRanking: boolean;
}
