// src/apps/AnyGenerator/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import OneSDK from '@onecomme.com/onesdk';
import { PingOneSDK } from '@public/common/api/PingOneSDK';
import '@assets/app2.css';

// 動的にコンポーネントを取得するためのグローバル変数
window.initApp = null;

// createApp
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
 console.error('グローバルエラー:', err);
 console.error('コンポーネント:', instance);
 console.error('エラー情報:', info);
};

async function initApp() {
 try {
  // わんコメが動いているかチェック
  if (await PingOneSDK()) OneSDK.ready().then(() => app.mount('#App'));
  else app.mount('#App');
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}

// 関数をセット
window.initApp = initApp;
