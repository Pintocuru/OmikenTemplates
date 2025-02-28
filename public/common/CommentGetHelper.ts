// common/CommentGetHelper.ts
import { CharaType, SendCommentParamsType } from '../type';
import emojiRegex from 'emoji-regex';
import { BotParamFilterType, CommentChara, ConfigNoPlugin } from './commonTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// comment.data.id にあるパラメータをObjectにする
export const getIdParams = (str: string): SendCommentParamsType | false => {
 if (/^[0-9]+[a-zA-Z0-9]*$/.test(str)) return false;

 const params = new URLSearchParams(str.replace(/,/g, '&'));
 const result: SendCommentParamsType = {
  id: params.get('id') || '',
  charaId: ''
 };

 params.forEach((value, key) => {
  result[key] = decodeURIComponent(value);
 });

 return result.id ? result : false;
};

// 簡易的な正規表現
export function matchPattern(text: string, pattern: string): boolean {
 const emojiPattern = emojiRegex();
 if (pattern === ':emoji:') {
  return emojiPattern.test(text); // 絵文字が含まれているかチェック
 }
 if (pattern.startsWith('^')) {
  return text.startsWith(pattern.slice(1)); // `^` を削除して前方一致
 }
 if (pattern.endsWith('$')) {
  return text.endsWith(pattern.slice(0, -1)); // `$` を削除して後方一致
 }
 return text.includes(pattern); // 部分一致
}

export const isValidComment = (
 { data: { userId } }: CommentChara,
 botUserId: string | undefined,
 { param }: SendCommentParamsType,
 filter: BotParamFilterType
): boolean => {
 return (
  // userIdがBOT_USER_IDと同じか
  botUserId === userId &&
  !!param &&
  // paramがPOST_PARAMに含まれているか、NON_POST_PARAMに含まれていないか
  (filter.POST_PARAM.length
   ? filter.POST_PARAM.includes(param)
   : !filter.NON_POST_PARAM.includes(param))
 );
};

// コメントにCharasのデータを付与する
export const charaComment = (
 comment: CommentChara,
 charaId: string,
 Charas: Record<string, CharaType>
): CommentChara => {
 const chara = Object.values(Charas.value).find((c) => c.id === charaId);
 return chara ? { ...comment, chara } : comment;
};

// ---

export const filterUserId = (
 comments: Comment[],
 { USER_ALLOWED_IDS, USER_DISALLOWED_IDS }: ConfigNoPlugin
): Comment[] => {
 return comments.filter(
  ({ data: { userId } }) =>
   (!USER_ALLOWED_IDS?.length || USER_ALLOWED_IDS.includes(userId)) &&
   !USER_DISALLOWED_IDS?.includes(userId)
 );
};

export const filterAccess = (comments: Comment[], config: ConfigNoPlugin): Comment[] => {
 return comments.filter(({ id, data }) => {
  const level = config.USER_ACCESS_LEVEL;
  if (!level) return true; // levelが未定義または0のとき、すべてtrue
  if (id === 'COMMENT_TESTER') return true; // コメントテスターは配信者と同じ扱い

  // 存在しないプロパティは `in` 演算子でチェック
  const isOwner = Boolean(data.isOwner);
  const isModerator = 'isModerator' in data && Boolean(data.isModerator);
  const isMember = 'isMember' in data && Boolean(data.isMember);

  if (level === 4 && isOwner) return true;
  if (level === 3 && (isOwner || isModerator)) return true;
  if (level === 2 && (isOwner || isMember || isModerator)) return true;
  if (level === 1) return true;

  return false;
 });
};

export const filterMatch = (comments: Comment[], config: ConfigNoPlugin): CommentChara[] => {
 return comments
  .map((comment) => {
   if (!config.USER_WORD_MATCH?.length) return comment;

   const matchedWord = config.USER_WORD_MATCH.find((word) => {
    if (typeof word === 'string') return matchPattern(comment.data.comment, word);
    if (word.isGift && comment.data.hasGift) return true;
    if (word.keywords.some((prefix) => matchPattern(comment.data.comment, prefix))) return true;
    if (word.regex?.some((pattern) => new RegExp(pattern).test(comment.data.comment))) return true;
    return false;
   });

   return matchedWord ? { ...comment, userWordMatchId: matchedWord.id } : null;
  })
  .filter((comment): comment is CommentChara => comment !== null);
};
