// src/composables/FunkCommentGetting.ts
import { ref } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { CharaType, DataType } from '@/../../public/types';
import { CommentTemp } from './commentTypes';

export function FunkCommentGetting(botUserId: string, pluginUid: string) {
 // ref
 const Charas = ref<Record<string, CharaType>>({});
 const botComments = ref<CommentTemp[]>([]);

 // 初期化
 async function initOneSDK() {
  // キャラクターデータの取得
  Charas.value = await fetchDatas(DataType.Charas);
  // OneSDKの初期化
  OneSDK.setup({
   permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
   mode: 'diff'
  });
  OneSDK.connect();
 }

 // コメントの購読
 function commentListener() {
  OneSDK.subscribe({
   action: 'comments',
   callback: (newComments: CommentTemp[]) => {
    newComments
     // 5秒以上経過したコメントは無視
     .filter((comment) => Date.now() < new Date(comment.data.timestamp).getTime() + 5000)
     // プラグインのコメントのみ適用
     .filter((comment) => comment.data.userId === botUserId)
     .forEach((comment) => {
      const commentPlus = commentCssPlus(comment);
      if (commentPlus) botComments.value.unshift(commentPlus);
     });
   }
  });
 }

 // コメント処理(CSSの付与等)
 function commentCssPlus(comment: CommentTemp): CommentTemp | null {
  const chara = Object.values(Charas.value).find((c) => c.name === comment.data.name);
  // 万が一キャラクターデータがなければnull
  if (!chara) {
   console.warn(`キャラクターが見つかりません: ${comment.data.name}`);
   return null;
  }
  comment.css = chara.color; // コメントの色を付与
  return comment;
 }

 // プラグインからデータ取得
 async function fetchDatas(types: DataType) {
  try {
   const url = `http://localhost:11180/api/plugins/${pluginUid}?mode=data&type=${types}`;
   const response = await OneSDK.get(url, {});
   return response.data.response || {};
  } catch (error) {
   console.error('データの取得に失敗:', error);
   return {};
  }
 }

 return {
  botComments,
  initOneSDK,
  commentListener
 };
}
