// src/apps/AnyGenerator/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import OneSDK from '@onecomme.com/onesdk';
import { PingOneSDK } from '@public/common/api/CheckOneSDK';
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
async function initApp() {
 try {
  if (!window.AppComponent.component) {
   console.error('コンポーネントが読み込まれていません');
   return;
  }

  // OneSDK のサーバーが動いているかチェック
  const isOneSDKAvailable = await PingOneSDK();
  if (isOneSDKAvailable) {
   console.log('OneSDK のサーバーが確認できました。OneSDK.ready() を待ちます。');
   OneSDK.ready()
    .then(() => {
     console.log('OneSDK.ready() が完了しました');
     app.mount('#App');
    })
    .catch((err) => {
     console.error('OneSDK.ready() に失敗しました:', err);
     app.mount('#App'); // 失敗しても Vue をマウント
    });
  } else {
   console.warn('OneSDK が利用できないため、Vue を直接マウントします');
   app.mount('#App');
  }

  // OneSDK > App の順にマウント
  OneSDK.ready().then(() => app.mount('#App'));
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}

// 関数をセット
window.AppComponent.initApp = initApp;
