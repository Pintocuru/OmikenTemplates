// common/subscribe/GetUserComments.ts
import { ref, Ref, watch } from 'vue';
import { ConfigUserType } from '../commonTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import emojiRegex from 'emoji-regex';

export function GetUserComments(newComments: Ref<Comment[]>, config: ConfigUserType) {
 const processor = new UserCommentsProcess(config);
 // userComments を ref として定義
 const userComments = ref<Comment[]>([]);

 // newComments の変更を監視
 watch(
  newComments,
  (comments) => {
   // 空でなければ更新
   const processed = processor.process(comments, userComments.value);
   if (processed !== null) userComments.value = processed;
  },
  { immediate: true }
 );

 return {
  userComments
 };
}

export class UserCommentsProcess {
 constructor(private readonly config: ConfigUserType) {}

 // ユーザーのコメントをconfig に沿ってフィルタリング
 process(comments: Comment[], existingComments: Comment[] = []): Comment[] | null {
  const validComments = comments
   .filter(this.isUserIdAllowed.bind(this))
   .filter(this.hasRequiredAccessLevel.bind(this))
   .filter(this.matchesFilterCriteria.bind(this));

  if (validComments.length === 0) return null;

  // DIFF_MODEに基づいて結果を返す
  return this.config.IS_DIFF_MODE
   ? validComments // 上書きモードでは新しいコメントのみ返す
   : this.mergeComments(existingComments, validComments); // 追加モードでは既存のものと結合
 }

 // 新しいコメントを既存のコメントに追加（重複排除）
 private mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
  const existingIds = new Set(existingComments.map((c) => c.data.id));
  return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))];
 }

 // 個別のコメントに対するユーザーIDフィルタリング
 isUserIdAllowed(comment: Comment): boolean {
  const { ALLOWED_IDS } = this.config;
  const disallowedIds = ALLOWED_IDS.filter((id) => id.startsWith('!')).map((id) => id.substring(1));
  const allowedIds = ALLOWED_IDS.filter((id) => !id.startsWith('!'));

  const { userId } = comment.data;
  return (!allowedIds.length || allowedIds.includes(userId)) && !disallowedIds.includes(userId);
 }

 // 個別のコメントに対するアクセスレベルフィルタリング
 hasRequiredAccessLevel(comment: Comment): boolean {
  const { id, data } = comment;
  const level = this.config.ACCESS_LEVEL;

  if (!level) return true;
  if (id === 'COMMENT_TESTER') return true;

  const isOwner = Boolean(data.isOwner);
  const isModerator = 'isModerator' in data && Boolean(data.isModerator);
  const isMember = 'isMember' in data && Boolean(data.isMember);

  return (
   level === 1 ||
   (level === 2 && (isOwner || isMember || isModerator)) ||
   (level === 3 && (isOwner || isModerator)) ||
   (level === 4 && isOwner)
  );
 }

 // 個別のコメントに対するフィルタリング条件のマッチング
 matchesFilterCriteria(comment: Comment): boolean {
  // ギフトチェック
  if (this.config.IS_GIFT && comment.data.hasGift) return true;

  // キーワードチェック（正規表現を適用）
  if (this.config.KEYWORDS?.some((keyword) => this.matchPattern(comment.data.comment, keyword)))
   return true;

  return false;
 }

 // 正規表現マッチング
 private matchPattern(text: string, pattern: string): boolean {
  // 絵文字専用パターン
  if (pattern === ':emoji:') return emojiRegex().test(text);

  try {
   // 正規表現パターン
   return new RegExp(pattern).test(text);
  } catch (err) {
   // 無効な正規表現の場合はログに出力してfalseを返す
   console.error(`Invalid regex pattern: ${pattern}`, err);
   return false;
  }
 }
}
