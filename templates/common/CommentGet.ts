// common/CommentGet.ts
import { ref, watch } from 'vue';
import {
 CharaType,
 DataType,
 GameType,
 OmikenType,
 ScriptsType,
 SendCommentParamsType,
 VisitType
} from '../../public/types/index';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// コメントの追加型定義
export type CommentTemp = Comment & {
 chara?: CharaType; // キャラクターデータ
};

// プラグインからデータ取得
type DataTypeMap = {
 [DataType.Omiken]: OmikenType;
 [DataType.Presets]: Readonly<Record<string, OmikenType>>;
 [DataType.Charas]: Record<string, CharaType>;
 [DataType.Scripts]: Record<string, ScriptsType>;
 [DataType.Visits]: Record<string, VisitType>;
 [DataType.Games]: Record<string, GameType>;
};

export type ConfigType = {
 PLUGIN_UID: string; // 使用しているプラグイン名
 IS_DIFF_MODE: boolean; // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_USER_IDS: string[]; // 通すユーザーIDリスト
 DISALLOWED_USER_IDS: string[]; // 通さないユーザーIDリスト
 FILTERS: FilterType[];
};

type FilterType = {
 id: string;
 POST_PARAM: string[];
 NON_POST_PARAM: string[];
};

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

export function CommentGet(config: ConfigType) {
 const newComments = ref<CommentTemp[]>([]);
 const botCommentsMap = ref<Record<string, CommentTemp[]>>({});

 // 初期化・コメントの購読
 const initOneSDK = async () => {
  try {
   await OneSDK.setup({
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    mode: config.IS_DIFF_MODE ? 'diff' : 'all'
   });

   await OneSDK.connect();

   OneSDK.subscribe({
    action: 'comments',
    callback: (comments: CommentTemp[]) => (newComments.value = comments)
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   throw new Error('OneSDK initialization failed');
  }
 };

 // コメントからbotのコメントのみ抽出する
 const getBotComments = async () => {
  const charasData = await fetchData(DataType.Charas);
  if (!charasData) throw new Error('Charasデータの取得に失敗しました');

  const Charas = ref<Record<string, CharaType>>(charasData);

  watch(
   newComments,
   (comments) => {
    if (!Array.isArray(comments)) return;

    config.FILTERS.forEach((filter) => {
     const validComments = comments
      .map((comment) => ({
       comment,
       params: getIdParams(comment.data.id)
      }))
      .filter(({ comment, params }) => params && isValidComment(comment, params, filter))
      .map(({ comment, params }) => {
       if (params && 'charaId' in params) return charaComment(comment, params.charaId, Charas.value);
       return null;
      })
      .filter((comment): comment is CommentTemp => comment !== null);

     botCommentsMap.value[filter.id] = [...(botCommentsMap.value[filter.id] || []), ...validComments];
    });
   },
   { deep: true }
  );
 };

 // comment.data.id にあるパラメータをObjectにする
 const getIdParams = (str: string): SendCommentParamsType | false => {
  if (/^[0-9]+[a-zA-Z0-9]*$/.test(str)) return false;

  const params = new URLSearchParams(str.replace(/,/g, '&'));
  const result: SendCommentParamsType = {
   id: params.get('id') || '',
   charaId: params.get('charaId') || ''
  };

  params.forEach((value, key) => {
   result[key] = decodeURIComponent(value);
  });

  return result.id ? result : false;
 };

 // 有効コメント判定
 const isValidComment = (comment: CommentTemp, params: SendCommentParamsType, filter: FilterType): boolean => {
  // コメントのユーザーIDが許可リストか拒否リストにあるかをチェック
  const userId = comment.data.userId;
  const isValidUser =
   (config.ALLOWED_USER_IDS.length === 0 || config.ALLOWED_USER_IDS.includes(userId)) &&
   !config.DISALLOWED_USER_IDS.includes(userId);

  // paramがPOST_PARAMに含まれているか、NON_POST_PARAMに含まれていないかをチェック
  const param = params ? params.param || '' : '';
  const isValidParam =
   filter.POST_PARAM.length > 0 ? filter.POST_PARAM.includes(param) : !filter.NON_POST_PARAM.includes(param);

  return isValidUser && isValidParam;
 };

 // コメントにCharasのデータを付与する
 const charaComment = (comment: CommentTemp, charaId: string, charas: Record<string, CharaType>): CommentTemp => {
  const chara = Object.values(charas).find((c) => c.id === charaId);
  return chara ? { ...comment, chara } : comment;
 };

 // プラグインからデータを読み込み
 const fetchData = async <T extends DataType>(type: T) => {
  try {
   const url = `http://localhost:11180/api/plugins/${config.PLUGIN_UID}?mode=data&type=${type}`;
   const response = await OneSDK.get(url, {});
   return response.status === 200 ? JSON.parse(response.data.response) : null;
  } catch (error) {
   console.error(`${type}データの取得に失敗:`, error);
   return null;
  }
 };

 return {
  initOneSDK,
  newComments,
  getBotComments,
  botCommentsMap,
  fetchData
 };
}
