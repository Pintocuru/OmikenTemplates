// common/subscribe/GetBotComments.ts
import { computed, readonly, ref, Ref } from 'vue';
import { CharaType, DataType, SendCommentParamsType } from '../../type';
import { fetchData } from '../ApiHandler';
import { CommentChara, ConfigBotType } from '../commonTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function GetBotComments(newComments: Ref<Comment[]>, config: ConfigBotType) {
 const charas = ref<Record<string, CharaType>>({});
 const processor = new BotCommentsProcessor(config, charas);
 // Charas データを初期化
 const initCharas = async () => {
  try {
   const { PLUGIN_UID } = config;
   const charasData = await fetchData(PLUGIN_UID, DataType.Charas);
   if (!charasData) throw new Error('Charasデータの取得に失敗しました');
   charas.value = charasData;
  } catch (err) {
   console.error('Failed to GetBotComments:', err);
   throw err;
  }
 };

 // BOTコメントを計算
 const botComments = computed(() => {
  return processor.process(newComments.value);
 });

 return {
  botComments: readonly(botComments),
  initCharas
 };
}

export class BotCommentsProcessor {
 constructor(
  private readonly config: ConfigBotType,
  private readonly Charas: Ref<Record<string, CharaType>>
 ) {}

 // コメントからBOTのコメントをフィルタリングする
 process(comments: Comment[]): CommentChara[] | null {
  const validComments = this.filterComments(comments);
  return validComments.length > 0 ? validComments : null;
 }

 // BOTのコメントを抽出してフィルタリング
 private filterComments(comments: Comment[]): CommentChara[] {
  return comments
   .map((comment) => ({
    comment,
    params: this.getIdParams(comment.data.id)
   }))
   .filter(({ comment, params }) => params && this.isValidComment(comment.data.userId, params))
   .map(({ comment, params }) => {
    if (params && 'charaId' in params) {
     return this.attachCharaData(comment, params.charaId);
    }
    return null;
   })
   .filter((comment): comment is CommentChara => comment !== null);
 }

 // comment.data.id にあるパラメータをObjectにする
 private getIdParams(str: string): SendCommentParamsType | false {
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
 }

 // Validate comment based on user ID and parameters
 private isValidComment(userId: string, { param }: SendCommentParamsType): boolean {
  const { BOT_USER_ID = 'FirstCounter', BOT_POST_PARAM } = this.config;
  if (BOT_USER_ID !== userId || !param) return false;

  const includeConditions = BOT_POST_PARAM.filter((f) => !f.startsWith('!'));
  const excludeConditions = BOT_POST_PARAM.filter((f) => f.startsWith('!')).map((f) =>
   f.substring(1)
  );

  const isIncluded = includeConditions.length ? includeConditions.includes(param) : true;
  const isNotExcluded = excludeConditions.length ? !excludeConditions.includes(param) : true;

  return isIncluded && isNotExcluded;
 }

 // コメントにCharasのデータを付与する
 private attachCharaData(comment: CommentChara, charaId: string): CommentChara {
  const chara = Object.values(this.Charas.value).find((c) => c.id === charaId);
  return chara ? { ...comment, chara } : comment;
 }
}
