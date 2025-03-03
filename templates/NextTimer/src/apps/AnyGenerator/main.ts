// src/apps/AnyGenerator/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import OneSDK from '@onecomme.com/onesdk';
import '@public/tailwind.css';

// 動的にコンポーネントを取得するためのグローバル変数
window.AppComponent = {
 component: null,
 initApp: null
};

// createApp
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
 console.error('グローバルエラー:', err);
 console.error('コンポーネント:', instance);
 console.error('エラー情報:', info);
};

// OneSDKの初期化を待ってからアプリをマウント
function initApp() {
 try {
  if (!window.AppComponent.component) {
   console.error('コンポーネントが読み込まれていません');
   return;
  }

  // OneSDK > App の順にマウント
  OneSDK.ready().then(() => app.mount('#App'));
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}

// 関数をセット
window.AppComponent.initApp = initApp;
