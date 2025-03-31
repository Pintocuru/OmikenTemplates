// src/apps/controller/main.ts
import { createApp } from 'vue';
import App from './App.vue';

// アプリをマウント
async function initApp() {
 try {
  const app = createApp(App);
  // グローバルエラーハンドリング
  app.config.errorHandler = (err, instance, info) => {
   console.error('グローバルエラー:', err);
   console.error('コンポーネント:', instance);
   console.error('エラー情報:', info);
  };
  // アプリをマウント
  app.mount('#App');
 } catch (error) {
  console.error('アプリケーションの初期化に失敗:', error);
 }
}
initApp(); // アプリケーションの初期化
