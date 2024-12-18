// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import OneSDK from '@onecomme.com/onesdk';

// OneSDKの初期化を待ってからアプリをマウント
async function initializeApp() {
 try {
  // OneSDKの準備が整うまで待機
  await OneSDK.ready();

  // アプリケーションの作成とマウント
  const app = createApp(App);

  // グローバルエラーハンドリングの追加（オプション）
  app.config.errorHandler = (err, instance, info) => {
   console.error('グローバルエラー:', err);
   console.error('コンポーネント:', instance);
   console.error('エラー情報:', info);
  };

  // マウントセレクタを #container に変更
  app.mount('#container');

  // 初期化完了後にbodyのhidden属性を削除
  document.body.removeAttribute('hidden');
 } catch (error) {
  console.error('アプリケーションの初期化に失敗:', error);
  // エラー時の処理（ユーザーへの通知など）
 }
}

// アプリケーションの初期化
initializeApp();
