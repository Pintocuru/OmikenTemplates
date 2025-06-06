// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import OneSDK from '@onecomme.com/onesdk';
//import '@tailwind/tailwind.css';
import '../../common/tailwind.css';

// OneSDKの初期化を待ってからアプリをマウント
async function initApp() {
 try {
  const app = createApp(App);
  // グローバルエラーハンドリング
  app.config.errorHandler = (err, instance, info) => {
   console.error('グローバルエラー:', err);
   console.error('コンポーネント:', instance);
   console.error('エラー情報:', info);
  };
  // OneSDKの準備ができたらアプリをマウント
  OneSDK.ready().then(() => app.mount('#container'));
 } catch (error) {
  console.error('アプリケーションの初期化に失敗:', error);
 }
}
initApp(); // アプリケーションの初期化
