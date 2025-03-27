// src/configMaker.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './configMaker.vue';
import '../assets/app.css';

// OneSDKの初期化を待ってからアプリをマウント
async function initApp() {
 try {
  const pinia = createPinia();
  const app = createApp(App);
  // グローバルエラーハンドリング
  app.config.errorHandler = (err, instance, info) => {
   console.error('グローバルエラー:', err);
   console.error('コンポーネント:', instance);
   console.error('エラー情報:', info);
  };
  // アプリをマウント
  app.use(pinia);
  app.mount('#App');
 } catch (error) {
  console.error('アプリケーションの初期化に失敗:', error);
 }
}
initApp(); // アプリケーションの初期化
