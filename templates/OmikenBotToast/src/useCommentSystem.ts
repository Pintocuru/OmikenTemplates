// src/composables/useCommentSystem.ts
import { ref, computed, onUnmounted } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { CharaType } from '../../../public/types';
import { CommentTemp, ProcessedComment } from './commentTypes';

export function useCommentSystem(botUserId: string, pluginUid: string) {
 const charas = ref<Record<string, CharaType>>({});
 const processedComments = ref<ProcessedComment[]>([]);
 const commentQueue = ref<CommentTemp[]>([]);

 // キャラクターデータ取得
 async function fetchCharacters() {
  try {
   const url = `http://localhost:11180/api/plugins/${pluginUid}?mode=data&type=Charas`;
   const response = await OneSDK.get(url, {});
   charas.value = response.data.response || {};
  } catch (error) {
   console.error('キャラクターデータの取得に失敗:', error);
   charas.value = {};
  }
 }

 // コメント処理のロジック
 function processComment(comment: CommentTemp): ProcessedComment | null {
  const chara = Object.values(charas.value).find((c) => c.name === comment.data.name);

  if (!chara) {
   console.warn(`キャラクターが見つかりません: ${comment.data.name}`);
   return null;
  }

  return {
   id: comment.data.id,
   content: comment.data.speechText || '',
   name: chara.name,
   textColor: chara.color?.['--lcv-text-color'] || 'white',
   backgroundColor: chara.color?.['--lcv-background-color'] || 'rgba(0, 0, 0, 0.7)',
   profileImage: comment.data.profileImage || null,
   lifeTime: calculateLifeTime(comment)
  };
 }

 // コメント表示時間計算
 function calculateLifeTime(comment: CommentTemp): number {
  const BASE_DURATION = 10000;
  const CHAR_THRESHOLD = 30;
  const extraTime = Math.max((comment.data.speechText?.length ?? 0) - CHAR_THRESHOLD, 0) * 100;
  return BASE_DURATION + extraTime;
 }

 // コメントシステムのセットアップ
 function setupCommentListener() {
  const subscription = OneSDK.subscribe({
   action: 'comments',
   callback: (newComments: CommentTemp[]) => {
    const now = Date.now();

    // 5秒以上経過したコメントは無視
    const recentComments = newComments.filter((comment) => now <= new Date(comment.data.timestamp).getTime() + 5000);

    // ボットユーザーのコメントのみ処理
    recentComments
     .filter((comment) => comment.data.userId === botUserId)
     .forEach((comment) => {
      const processedComment = processComment(comment);
      if (processedComment) {
       processedComments.value.unshift(processedComment);
      }
     });
   }
  });

  return () => {
   // クリーンアップ関数
   OneSDK.unsubscribe(subscription);
  };
 }

 // コメント自動削除
 function startCommentCleaner() {
  const cleanupInterval = setInterval(() => {
   const now = Date.now();
   processedComments.value = processedComments.value.filter((comment) => now - comment.timestamp < comment.lifeTime);
  }, 1000);

  return () => clearInterval(cleanupInterval);
 }

 // OneSDKの初期化
 async function initializeOneSDK() {
  await fetchCharacters();

  OneSDK.setup({
   permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
   mode: 'diff'
  });

  OneSDK.connect();
 }

 // コンポーネントのライフサイクルフック
 const unsubscribeComment = setupCommentListener();
 const stopCommentCleaner = startCommentCleaner();

 onUnmounted(() => {
  unsubscribeComment();
  stopCommentCleaner();
 });

 return {
  processedComments,
  initializeOneSDK
 };
}
