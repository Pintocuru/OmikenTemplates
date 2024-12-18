import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CharaType } from '../../../public/types';

export type CommentTemp = Comment & {
 css: CharaType['color']; // コメントの色
 index: number; // 並び順
};

export interface ProcessedComment {
 id: string;
 content: string;
 name: string;
 textColor: string;
 backgroundColor: string;
 profileImage: string | null;
 lifeTime: number;
 timestamp?: number;
}