// common/CommentGet.ts
import { ref } from 'vue';
import { CharaType, DataType } from '../type';
import { CommentChara, ConfigType, ConfigPlugin, ConfigNoPlugin } from './commonTypes';
import { fetchData } from './ApiHandler';
import {
 charaComment,
 filterAccess,
 filterMatch,
 filterUserId,
 getIdParams,
 isValidComment
} from './CommentGetHelper';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function CommentGet() {
 // ref/computed
 const newComments = ref<Comment[]>([]);
 const botCommentsMap = ref<Record<string, CommentChara[]>>({});
 const userCommentsMap = ref<Record<string, CommentChara[]>>({});
 const Charas = ref<Record<string, CharaType>>({});
 const isInitFlag = ref<boolean>(true); // 初期化フラグ

 // 初期化・コメントの購読
 const initOneSDK = async (config: ConfigType) => {
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
    callback: (comments: Comment[]) => {
     newComments.value = comments;
     if (PLUGIN_UID) botCommentsProcess(comments, config);
     else userCommentsProcess(comments, config as ConfigNoPlugin);
    }
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   isInitFlag.value = false; // 初期化NGフラグ
   throw new Error('OneSDK initialization failed');
  }
 };

 // BOTのコメントをidごとに取得
 const botCommentsProcess = (comments: Comment[], config: ConfigPlugin) => {
  config.BOT_PARAM_FILTERS?.forEach((filter) => {
   const validComments = filterBotComments(comments, config);
   updateCommentsMap(botCommentsMap.value, filter.id, validComments);
  });
 };

 // ユーザーのコメントをidごとに取得
 const userCommentsProcess = (comments: Comment[], config: ConfigNoPlugin) => {
  config.USER_WORD_MATCH?.forEach((filter) => {
   const validComments = filterUserComments(comments, config);
   updateCommentsMap(userCommentsMap.value, filter.id, validComments);
  });
 };

 const updateCommentsMap = (
  map: Record<string, CommentChara[]>,
  id: string,
  newComments: CommentChara[]
 ) => {
  map[id] = [
   ...(map[id] || []),
   ...newComments.filter(
    (newComment) =>
     !(map[id] || []).some((existingComment) => existingComment.data.id === newComment.data.id)
   )
  ];
 };

 // BOTのコメントを抽出してフィルタリング
 const filterBotComments = (comments: Comment[], config: ConfigPlugin): CommentChara[] => {
  return comments
   .map((comment) => ({
    comment,
    params: getIdParams(comment.data.id)
   }))
   .filter(({ comment, params }) =>
    config.BOT_PARAM_FILTERS?.some(
     (filter) => params && isValidComment(comment, config.BOT_USER_ID, params, filter)
    )
   )
   .map(({ comment, params }) => {
    if (params && 'charaId' in params) return charaComment(comment, params.charaId, Charas.value);
    return null;
   })
   .filter((comment): comment is CommentChara => comment !== null);
 };

 // PLUGIN_UID なしの場合のフィルタリング
 const filterUserComments = (comments: Comment[], config: ConfigNoPlugin): CommentChara[] => {
  const filter1 = filterUserId(comments, config);
  const filter2 = filterAccess(filter1, config);
  return filterMatch(filter2, config);
 };

 return {
  isInitFlag, // 初期化フラグ
  initOneSDK, // わんコメの購読に必須
  newComments, // すべてのコメント
  botCommentsMap, // プラグインの、FILTERSでフィルタリングされたコメント
  userCommentsMap // USER_ALLOWED_IDS USER_DISALLOWED_IDS でフィルタリングされたコメント
 };
}
