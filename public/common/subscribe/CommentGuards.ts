// CommentGuards.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function useCommentGuards() {
 // 共通の型ガード関数
 function hasProperty<T extends keyof any, V>(
  comment: Comment,
  key: T,
  typeGuard: (value: any) => value is V
 ): comment is Comment & { data: { [K in T]: V } } {
  return key in comment.data && typeGuard((comment.data as any)[key]);
 }

 // 型ガード: membership を持つか
 const hasMembership = (comment: Comment) =>
  hasProperty(
   comment,
   'membership',
   (value): value is { sub: string; primary: string } =>
    typeof value === 'object' &&
    value !== null &&
    typeof value.sub === 'string' &&
    typeof value.primary === 'string'
  );

 // 型ガード: isModerator を持つか
 function isModerator(comment: Comment): comment is Comment & { data: { isModerator: boolean } } {
  return hasProperty(
   comment,
   'isModerator',
   (value): value is boolean => typeof value === 'boolean'
  );
 }

 // 型ガード: isMember を持つか
 function isMember(comment: Comment): comment is Comment & { data: { isMember: boolean } } {
  return hasProperty(comment, 'isMember', (value): value is boolean => typeof value === 'boolean');
 }

 // 型ガード: paidText を持つか
 function hasPaidText(comment: Comment): comment is Comment & { data: { paidText: string } } {
  return hasProperty(
   comment,
   'paidText',
   (value): value is string => typeof value === 'string' && value.trim() !== ''
  );
 }

 return {
  hasMembership,
  isModerator,
  isMember,
  hasPaidText
 };
}
