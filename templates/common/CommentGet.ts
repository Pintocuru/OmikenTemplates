// common/CommentGet.ts
import { computed, ref, watch } from 'vue';
import { CharaType, DataType, SendCommentParamsType } from '../../public/types';
import { CommentChara, ConfigType, FilterType } from './commonTypes';
import { fetchData } from './ApiHandler';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function CommentGet(config: ConfigType) {
 const newComments = ref<Comment[]>([]);
 const botCommentsMap = ref<Record<string, CommentChara[]>>({});
 const Charas = ref<Record<string, CharaType>>({});

 // 初期化・コメントの購読
 const initOneSDK = async () => {
  try {
   await OneSDK.setup({
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    mode: config.IS_DIFF_MODE ? 'diff' : 'all'
   });
   await OneSDK.connect();

   // Charasデータ取得
   const { PLUGIN_UID } = config;
   if (PLUGIN_UID) {
    const charasData = await fetchData(PLUGIN_UID, DataType.Charas);
    if (!charasData) throw new Error('Charasデータの取得に失敗しました');
    Charas.value = charasData;
   }

   OneSDK.subscribe({
    action: 'comments',
    callback: (comments: Comment[]) => (newComments.value = comments)
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   throw new Error('OneSDK initialization failed');
  }
 };

 // コメントからbotのコメントのみ抽出する
 const filterComments = computed(() => {
  const { ALLOWED_USER_IDS, DISALLOWED_USER_IDS } = config;

  // 両方のリストが空なら空配列を返す
  if (ALLOWED_USER_IDS.length === 0 && DISALLOWED_USER_IDS.length === 0) return [];

  return newComments.value.filter(({ data: { userId } }) => {
   // ALLOWED_USER_IDS が優先
   if (ALLOWED_USER_IDS.length > 0) return ALLOWED_USER_IDS.includes(userId);
   return !DISALLOWED_USER_IDS.includes(userId);
  });
 });

 // コメントから bot のコメントのみ抽出する
 const getBotComments = (filters: FilterType[]) => {
  watch(
   newComments,
   (comments) => {
    // PLUGIN_UIDがない場合はCharasはnullなのでreturn
    if (!config.PLUGIN_UID) return;

    filters.forEach((filter) => {
     const validComments = filterBotComments(comments, filter);

     // 重複排除してマップを更新
     botCommentsMap.value[filter.id] = [
      ...(botCommentsMap.value[filter.id] || []),
      ...validComments.filter(
       (newComment) =>
        !(botCommentsMap.value[filter.id] || []).some(
         (existingComment) => existingComment.data.id === newComment.data.id
        )
      )
     ];
    });
   },
   { deep: true }
  );
 };

 // コメントから bot のコメントを抽出してフィルタリングする関数
 const filterBotComments = (comments: Comment[], filter: FilterType): CommentChara[] => {
  return comments
   .map((comment) => ({
    comment,
    params: getIdParams(comment.data.id)
   }))
   .filter(({ comment, params }) => params && isValidComment(comment, params, filter))
   .map(({ comment, params }) => {
    if (params && 'charaId' in params) return charaComment(comment, params.charaId);
    return null;
   })
   .filter((comment): comment is CommentChara => comment !== null);
 };

 // comment.data.id にあるパラメータをObjectにする
 const getIdParams = (str: string): SendCommentParamsType | false => {
  if (/^[0-9]+[a-zA-Z0-9]*$/.test(str)) return false;

  const params = new URLSearchParams(str.replace(/,/g, '&'));
  const result: SendCommentParamsType = {
   id: params.get('id') || ''
  };

  params.forEach((value, key) => {
   result[key] = decodeURIComponent(value);
  });

  return result.id ? result : false;
 };

 // 有効コメント判定
 const isValidComment = (comment: CommentChara, params: SendCommentParamsType, filter: FilterType): boolean => {
  // userIdがBOT_USER_IDと同じか
  const isValidUser = config.BOT_USER_ID === comment.data.userId;

  // paramがPOST_PARAMに含まれているか、NON_POST_PARAMに含まれていないかをチェック
  const param = params ? params.param || '' : '';
  const isValidParam =
   filter.POST_PARAM.length > 0 ? filter.POST_PARAM.includes(param) : !filter.NON_POST_PARAM.includes(param);

  return isValidUser && isValidParam;
 };

 // コメントにCharasのデータを付与する
 const charaComment = (comment: CommentChara, charaId: string | undefined): CommentChara => {
  const chara = Object.values(Charas.value).find((c) => c.id === charaId);
  return chara ? { ...comment, chara } : comment;
 };

 return {
  initOneSDK, // わんコメの購読に必須
  newComments, // すべてのコメント
  filterComments, // ALLOWED_USER_IDS DISALLOWED_USER_IDS でフィルタリングされたコメント
  getBotComments, // Botのコメントを取得する際の初期化関数
  botCommentsMap // プラグインの、FILTERSでフィルタリングされたコメント
 };
}
