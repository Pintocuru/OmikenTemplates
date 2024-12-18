// src/script.ts
import { ref, onMounted, createApp, h } from 'vue';
import { CharaType } from '../../../public/types';
import OneSDK from '@onecomme.com/onesdk';
import { CommentTemp } from './commentTypes';
import ToastMessage from './ToastMessage.vue';

// 仕様書
// https://onecomme.com/docs/developer/onesdk-js

// プラグイン定数
const PLUGIN_UID = 'OmikenPlugin01';
const botUserId = 'FirstCounter';
const TEMPLATE_NAME = 'toast';

// アプリケーションの主要コンポーネント
const App = {
 setup() {
  // ref
  const botComments = ref<CommentTemp[]>([]);
  const queue: CommentTemp[] = [];
  const Charas = ref<Record<string, CharaType>>({});
  const toastMessageRef = ref(null);

  // キャラクターデータの取得
  const fetchCharas = async () => {
   try {
    const url = `http://localhost:11180/api/plugins/${PLUGIN_UID}?mode=data&type=Charas`;
    const res = await OneSDK.get(url, {});
    Charas.value = res.data.response || {};
   } catch (error) {
    console.error('Failed to fetch Charas:', error);
    Charas.value = {};
   }
  };

  // コメントシステムのセットアップ
  const setupCommentSystem = () => {
   OneSDK.subscribe({
    action: 'comments',
    callback: (newComments: CommentTemp[]) => {
     // 最後のコメントが5秒以上経過してるならまとめて弾く(再読み込み対策)
     const now = Date.now();
     if (now > new Date(newComments[0]?.data.timestamp).getTime() + 5000) return;

     newComments.forEach((comment: CommentTemp) => {
      // userIdとジェネレーター名が同じなら表示  && comment.data.liveId === TEMPLATE_NAME
      if (comment.data.userId === botUserId) {
       ProcessBotComment(comment);
      }
     });
    }
   });
  };

  // キャラの色データを付与してバッファに入れる
  const ProcessBotComment = (comment: CommentTemp) => {
   // CHARACTERからnameが一致するObjectを探し出し、表示させる
   const chara = Object.values(Charas.value).find((c) => c.name === comment.data.name);
   if (chara) {
    comment.css = chara.color;
    queue.push(comment);
   }
  };

  // コメント表示
  const commentDisplay = () => {
   const INTERVAL = 250; // 基本遅延
   const LIFE_TIME = 10000; // 表示時間
   const THRESHOLD = 30; // この文字数以上であれば、表示時間を延長する
   let lastTime = 0;
   const commentTimers = new Map();

   (function update(now = Date.now()) {
    // 新しいコメントの追加
    if (now - lastTime > INTERVAL && queue.length) {
     lastTime = now;
     const comment = queue.shift();
     if (comment) {
      const extraTime = Math.max((comment.data.speechText?.length ?? 0) - THRESHOLD, 0) * 100;
      const totalLifeTime = LIFE_TIME + extraTime;

      // ToastMessageにコメントを表示
      if (toastMessageRef.value) {
       (toastMessageRef.value as any).showComment(comment);
      }

      botComments.value.unshift(comment);
      commentTimers.set(comment.data.id, now + totalLifeTime);
     }
    }

    // 表示時間が過ぎたコメントを削除
    botComments.value = botComments.value.filter((comment) => {
     if (commentTimers.has(comment.data.id) && now > commentTimers.get(comment.data.id)) {
      commentTimers.delete(comment.data.id);
      return false;
     }
     return true;
    });

    // コメントにインデックスとカスタムプロパティを割り当てる
    botComments.value.forEach((comment, index, array) => {
     comment.index = index;
     const brightness = 100 - comment.index * 20;
     const opacity = comment.index === 0 ? 100 : 0;
     comment.css = {
      ...comment.css,
      '--lcv-background-brightness': `${brightness}%`,
      '--lcv-background-opacity': `${opacity}%`
     };
    });

    requestAnimationFrame(update);
   })();
  };

  // コンポーネントのマウント時の処理
  onMounted(async () => {
   // キャラクターデータの取得
   await fetchCharas();

   document.body.removeAttribute('hidden');
   OneSDK.setup({
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    mode: 'diff' // 差分モード
   });
   OneSDK.connect();
   setupCommentSystem();
   commentDisplay();
  });

  // レンダリング用のトーストメッセージコンポーネント
  const renderToastMessage = () =>
   h(ToastMessage, {
    ref: toastMessageRef,
    Charas: Charas.value
   });

  return {
   botComments,
   renderToastMessage
  };
 },
 render() {
  return [
   this.renderToastMessage()
   // 必要に応じて他のコンポーネントを追加
  ];
 }
};

// OneSDKの準備ができたらアプリをマウント
OneSDK.ready().then(() => {
 const app = createApp(App);
 app.mount('#container');
});
