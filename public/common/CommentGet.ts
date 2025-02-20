// common/CommentGet.ts
import { ref, computed } from 'vue';
import { CharaType, DataType, SendCommentParamsType } from './types';
import { CommentChara, ConfigType, BotParamFilterType } from './commonTypes';
import { fetchData } from './ApiHandler';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import emojiRegex from 'emoji-regex';

export function CommentGet(config: ConfigType) {
 const newComments = ref<Comment[]>([]);
 const botCommentsMap = ref<Record<string, CommentChara[]>>({});
 const Charas = ref<Record<string, CharaType>>({});
 const isInitFlag = ref<boolean>(true); // 初期化フラグ

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
    callback: (comments: Comment[]) => {
     newComments.value = comments;
     if (config.PLUGIN_UID && config.BOT_PARAM_FILTERS) {
      processPluginComments(comments);
     }
    }
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   // 初期化NGフラグ
   isInitFlag.value = false;
   throw new Error('OneSDK initialization failed');
  }
 };

 const processPluginComments = (comments: Comment[]) => {
  config.BOT_PARAM_FILTERS?.forEach((filter) => {
   const validComments = filterCommentsLogic(comments);

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
 };

 const filterComments = computed<CommentChara[]>(() => {
  return filterCommentsLogic(newComments.value);
 });

 const filterCommentsLogic = (comments: Comment[]): CommentChara[] => {
  const { PLUGIN_UID } = config;

  // PLUGIN_UID がある場合はBOTのコメントを抽出してフィルタリング
  if (PLUGIN_UID) {
   return comments
    .map((comment) => ({
     comment,
     params: getIdParams(comment.data.id)
    }))
    .filter(({ comment, params }) => {
     return config.BOT_PARAM_FILTERS?.some(
      (filter) => params && isValidComment(comment, params, filter)
     );
    })
    .map(({ comment, params }) => {
     if (params && 'charaId' in params) {
      return charaComment(comment, params.charaId);
     }
     return null;
    })
    .filter((comment): comment is CommentChara => comment !== null);
  }

  // PLUGIN_UID なしの場合のフィルタリング
  return (
   comments
    // USER_ALLOWED_IDS / USER_DISALLOWED_IDS のフィルタリング
    .filter(({ data: { userId } }) => {
     if (config.USER_ALLOWED_IDS?.length && !config.USER_ALLOWED_IDS.includes(userId)) {
      return false;
     }
     if (config.USER_DISALLOWED_IDS?.includes(userId)) {
      return false;
     }
     return true;
    })
    .map((comment) => {
     // USER_WORD_MATCH がないならそのまま返す
     if (!config.USER_WORD_MATCH?.length) return comment;

     // 適用された UserWordMatchType の ID を取得
     const matchedWord = config.USER_WORD_MATCH.find((word) => {
      if (typeof word === 'string') return matchPattern(comment.data.comment, word);

      const { isGift, keywords, regex } = word;
      if (isGift && comment.data.hasGift) return true;
      if (keywords.some((prefix) => matchPattern(comment.data.comment, prefix))) return true;
      if (regex?.some((pattern) => new RegExp(pattern).test(comment.data.comment))) return true;

      return false;
     });

     return matchedWord
      ? {
         ...comment,
         userWordMatchId: typeof matchedWord === 'string' ? undefined : matchedWord.id
        }
      : null;
    })
    .filter((comment): comment is CommentChara => comment !== null)
  );
 };

 //
 function matchPattern(text: string, pattern: string): boolean {
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
 const isValidComment = (
  comment: CommentChara,
  params: SendCommentParamsType,
  filter: BotParamFilterType
 ): boolean => {
  // userIdがBOT_USER_IDと同じか
  const isValidUser = config.BOT_USER_ID === comment.data.userId;

  // paramがPOST_PARAMに含まれているか、NON_POST_PARAMに含まれていないかをチェック
  const param = params ? params.param || '' : '';
  const isValidParam =
   filter.POST_PARAM.length > 0
    ? filter.POST_PARAM.includes(param)
    : !filter.NON_POST_PARAM.includes(param);

  return isValidUser && isValidParam;
 };

 // コメントにCharasのデータを付与する
 const charaComment = (comment: CommentChara, charaId: string | undefined): CommentChara => {
  const chara = Object.values(Charas.value).find((c) => c.id === charaId);
  return chara ? { ...comment, chara } : comment;
 };

 return {
  isInitFlag, // 初期化フラグ
  initOneSDK, // わんコメの購読に必須
  newComments, // すべてのコメント
  filterComments, // USER_ALLOWED_IDS USER_DISALLOWED_IDS でフィルタリングされたコメント
  botCommentsMap // プラグインの、FILTERSでフィルタリングされたコメント
 };
}
