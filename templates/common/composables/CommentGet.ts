// common/composables/CommentGet.ts
import { ref, watch } from 'vue';
import { CharaType, DataType, GameType, OmikenType, ScriptsType, VisitType } from '../../../public/types/index';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// コメントの追加型定義
export type CommentTemp = Comment & {
 css?: CharaType['color']; // コメントの色
 index?: number; // 並び順
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

export type configType = {
 PLUGIN_UID: 'OmikenPlugin01'; // 文字列リテラル型
 BOT_USER_ID: 'FirstCounter'; // 文字列リテラル型
 POST_PARAM: string[]; // 文字列の配列
 NON_POST_PARAM: string[]; // 文字列の配列
 IS_DIFF_MODE: boolean; // 真偽値
};

export function CommentGet(config: configType) {
 const COMMENT_EXPIRY_MS = 5000;
 // 購読したコメント
 const newComments = ref<CommentTemp[]>([]);
 const botComments = ref<CommentTemp[]>([]);
 const Charas = ref<Record<string, CharaType>>({});

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

  Charas.value = charasData;

  watch(
   newComments,
   (comments) => {
    if (!Array.isArray(comments)) return;

    const validComments = comments
     .filter(isValidComment)
     .map(charaComment)
     .filter((comment): comment is CommentTemp => comment !== null);

    botComments.value = [...validComments, ...botComments.value];
   },
   { deep: true }
  );
 };

 // botのコメントかどうかを判定
 const isValidComment = (comment: CommentTemp): boolean => {
  // 5秒以上経過したコメントは無視
  const isRecent = Date.now() < new Date(comment.data.timestamp).getTime() + COMMENT_EXPIRY_MS;
  // プラグインのコメントのみ適用
  const isBotComment = comment.data.userId === config.BOT_USER_ID;
  // 引数が設定と当てはまるか
  const param = comment.data.liveId; // liveIdをparamとして使用
  const isValidParam =
   config.POST_PARAM.length > 0 ? config.POST_PARAM.includes(param) : !config.NON_POST_PARAM.includes(param);
  return isRecent && isBotComment && isValidParam;
 };

 // コメントにCharasのデータを付与する
 const charaComment = (comment: CommentTemp): CommentTemp => {
  const chara = Object.values(Charas.value).find((c) => c.name === comment.data.name);
  if (!chara) {
   console.warn(`キャラクターが見つかりません: ${comment.data.name}`);
   return comment;
  }
  return { ...comment, css: chara.color };
 };

 // プラグインからデータを読み込み
 const fetchData = async <T extends DataType>(type: T): Promise<DataTypeMap[T] | null> => {
  try {
   const url = `http://localhost:11180/api/plugins/${config.PLUGIN_UID}?mode=data&type=${type}`;
   const response = await OneSDK.get(url, {});

   if (response.status !== 200) {
    throw new Error(`Unexpected status code: ${response.status}`);
   }

   return JSON.parse(response.data.response);
  } catch (error) {
   console.error(`${type}データの取得に失敗:`, error);
   return null;
  }
 };

 return {
  initOneSDK,
  newComments,
  getBotComments,
  botComments,
  fetchData
 };
}
