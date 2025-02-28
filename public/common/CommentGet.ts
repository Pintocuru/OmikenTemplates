// common/CommentGet.ts
import { ref } from 'vue';
import { CharaType, DataType } from '../type';
import {
 CommentChara,
 ConfigType,
 ConfigPlugin,
 ConfigNoPlugin,
 BotParamFilterType,
 UserWordMatchType
} from './commonTypes';
import { fetchData } from './ApiHandler';
import {
 charaComment,
 filterAccess,
 filterMatch,
 filterUserId,
 getIdParams,
 isValidComment,
 matchPattern
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
   const validComments = filterBotComments(comments, config, filter);
   // フィルタリングで弾かれなかった場合のみ更新
   if (validComments.length > 0) {
    updateCommentsMap(botCommentsMap.value, filter.id, validComments, config.IS_DIFF_MODE);
   }
  });
 };

 // ユーザーのコメントをidごとに取得
 const userCommentsProcess = (comments: Comment[], config: ConfigNoPlugin) => {
  config.USER_WORD_MATCH?.forEach((filter) => {
   const validComments = filterUserComments(comments, config, filter);
   // フィルタリングで弾かれなかった場合のみ更新
   if (validComments.length > 0) {
    updateCommentsMap(userCommentsMap.value, filter.id, validComments, config.IS_DIFF_MODE);
   }
  });
 };

 /**
  * コメントマップの更新
  * 新しいコメントを既存のマップに追加（重複は除外）
  * IS_DIFF_MODE=trueの場合は上書き、falseの場合は蓄積
  */
 const updateCommentsMap = (
  map: Record<string, CommentChara[]>,
  id: string,
  newComments: CommentChara[],
  isDiffMode: boolean
 ) => {
  // 空ならreturn
  if (newComments.length === 0) return;
  // 差分モードの場合は上書き
  if (isDiffMode) {
   map[id] = [...newComments];
  } else {
   // 蓄積モードの場合は追加（重複除外）
   map[id] = [
    ...(map[id] || []),
    ...newComments.filter(
     (newComment) =>
      !(map[id] || []).some((existingComment) => existingComment.data.id === newComment.data.id)
    )
   ];
  }
 };

 // BOTのコメントを抽出してフィルタリング
 const filterBotComments = (
  comments: Comment[],
  config: ConfigPlugin,
  currentFilter: BotParamFilterType
 ): CommentChara[] => {
  return comments
   .map((comment) => ({
    comment,
    params: getIdParams(comment.data.id)
   }))
   .filter(
    ({ comment, params }) =>
     params && isValidComment(comment, config.BOT_USER_ID, params, currentFilter)
   )
   .map(({ comment, params }) => {
    if (params && 'charaId' in params) {
     return charaComment(comment, params.charaId, Charas.value);
    }
    return null;
   })
   .filter((comment): comment is CommentChara => comment !== null);
 };

 // PLUGIN_UID なしの場合のフィルタリング
 const filterUserComments = (
  comments: Comment[],
  config: ConfigNoPlugin,
  currentFilter: UserWordMatchType
 ): CommentChara[] => {
  // ユーザーIDによるフィルタリング
  const filter1 = filterUserId(comments, config);
  // アクセスレベルによるフィルタリング
  const filter2 = filterAccess(filter1, config);

  // キーワードによるフィルタリング（特定のフィルターに対してのみ）
  const matchedComments: CommentChara[] = [];

  filter2.forEach((comment) => {
   let matched: CommentChara | null = null;

   // 文字列フィルターの場合
   if (typeof currentFilter === 'string') {
    if (matchPattern(comment.data.comment, currentFilter)) {
     matched = { ...comment, userWordMatchId: currentFilter } as CommentChara;
    }
   } else {
    // オブジェクトフィルターの場合
    if (currentFilter.isGift && comment.data.hasGift) {
     matched = { ...comment, userWordMatchId: currentFilter.id } as CommentChara;
    } else if (
     currentFilter.keywords?.some((prefix) => matchPattern(comment.data.comment, prefix))
    ) {
     matched = { ...comment, userWordMatchId: currentFilter.id } as CommentChara;
    } else if (
     currentFilter.regex?.some((pattern) => new RegExp(pattern).test(comment.data.comment))
    ) {
     matched = { ...comment, userWordMatchId: currentFilter.id } as CommentChara;
    }
   }

   // マッチしたコメントのみを追加
   if (matched) {
    matchedComments.push(matched);
   }
  });

  return matchedComments;
 };

 return {
  isInitFlag, // 初期化フラグ
  initOneSDK, // わんコメの購読に必須
  newComments, // すべてのコメント
  botCommentsMap, // プラグインの、FILTERSでフィルタリングされたコメント
  userCommentsMap // USER_ALLOWED_IDS USER_DISALLOWED_IDS でフィルタリングされたコメント
 };
}
