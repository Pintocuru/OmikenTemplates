// src/Modules/api/PostOneComme.ts
import { SendCommentType, SendTestCommentType } from '../../type';
import { SETTINGS } from '../settings';

/**
 * わんコメAPIへの各種投稿機能を提供するモジュール
 *
 * 主な機能：
 * - 通常コメントの投稿
 * - テストコメントの投稿（コメントテスター）
 * - WordPartyリアクションの投稿
 * - 音声合成（Speech）の投稿
 *
 * 全ての投稿は遅延実行に対応
 */

/**
 * わんコメに通常のコメントを投稿
 *
 * @param {SendCommentType} request - 投稿するコメントデータ
 * @param {number} [delaySeconds=0] - 投稿を遅延させる秒数
 * @returns {Promise<void>} 投稿完了のPromise
 */
export async function postComment(
 request: SendCommentType,
 delaySeconds: number = 0
): Promise<void> {
 return delayFetchPost(
  '/comments',
  request,
  delaySeconds,
  'わんコメへのコメント投稿に失敗しました'
 );
}

/**
 * コメントテスター機能を使用してテストコメントを投稿
 * システムメッセージやエラー通知などに使用
 *
 * @param {string} comment - 投稿するコメント内容
 * @param {string} [username='error'] - 表示するユーザー名（デフォルト: 'error'）
 * @param {number} [delaySeconds=0] - 投稿を遅延させる秒数
 * @returns {Promise<void>} 投稿完了のPromise
 */
export async function postSystemMessage(
 comment: string,
 username: string = 'error',
 delaySeconds: number = 0
): Promise<void> {
 // テストコメント用の標準設定
 const request: SendTestCommentType = {
  platform: 'youtube', // プラットフォーム（固定）
  hasGift: false, // ギフトなし
  unit: '', // 通貨単位なし
  price: 1000, // デフォルト価格
  giftType: 'none', // ギフトタイプなし
  newComment: false, // 新規コメントフラグ
  repeater: false, // リピーターフラグ
  subscribe: false, // 購読者フラグ
  speech: true, // 音声読み上げ有効
  username, // 指定されたユーザー名
  comment // 投稿内容
 };

 return delayFetchPost(
  '/comments/test',
  request,
  delaySeconds,
  'テストコメントの投稿に失敗しました'
 );
}

/**
 * WordPartyにリアクションを投稿
 * 配信画面上にリアクションとして表示される
 *
 * @param {string} content - リアクション内容
 * @param {number} [delaySeconds=0] - 投稿を遅延させる秒数
 * @returns {Promise<void>} 投稿完了のPromise
 */
export async function postWordParty(content: string, delaySeconds: number = 0): Promise<void> {
 return delayFetchPost(
  '/reactions',
  {
   reactions: [
    {
     key: content, // リアクション内容
     value: 1 // リアクションの重み（固定値）
    }
   ]
  },
  delaySeconds,
  'WordPartyリアクションの投稿に失敗しました'
 );
}

/**
 * 音声合成（Speech）にテキストを投稿
 * 指定したテキストが音声で読み上げられる
 *
 * @param {string} content - 読み上げるテキスト
 * @param {number} [delaySeconds=0] - 投稿を遅延させる秒数
 * @returns {Promise<void>} 投稿完了のPromise
 */
export async function postSpeech(content: string, delaySeconds: number = 0): Promise<void> {
 return delayFetchPost('/speech', { text: content }, delaySeconds, '音声合成の投稿に失敗しました');
}

/**
 * 遅延実行付きのHTTP POST リクエストを実行
 *
 * 機能：
 * - 指定された秒数だけ遅延してからリクエスト実行
 * - 基本遅延時間（SETTINGS.basicDelaySeconds）を自動で加算
 * - HTTPステータスコードによるエラーハンドリング
 *
 * @param {string} endpoint - APIエンドポイント（/から始まるパス）
 * @param {any} data - 送信するデータ
 * @param {number} delaySeconds - 遅延秒数
 * @param {string} errorMessage - エラー時のメッセージ
 * @returns {Promise<void>} リクエスト完了のPromise
 *
 * @private
 */
function delayFetchPost(
 endpoint: string,
 data: any,
 delaySeconds: number,
 errorMessage: string
): Promise<void> {
 // test
 /**
  *
  * 
  * TODO:fetch ではなく、OneSDK.post を使ってラクをしたい
  * OneSDK.post　に　headers　は不要
  await OneSDK.post('http://localhost:11180/api/comments', {
  service: { id: '26c434d4-db3b-4975-9061-093cf7cdb5b2' },
  comment: {
   userId: 'BotUserIDname',
   id: Date.now() + Math.random().toString().slice(2, 12),
   name: 'test',
   comment: '',
   profileImage: ''
  }
 });

  */

 return new Promise((resolve, reject) => {
  // 遅延実行のセットアップ
  setTimeout(
   async () => {
    try {
     // HTTP POSTリクエストを実行
     const response = await fetch(`${SETTINGS.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
     });

     // HTTPステータスコードをチェック
     // fetch APIは4xx/5xxエラーでも例外を投げないため、明示的にチェックが必要
     if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
     }

     // 成功時は正常終了
     resolve();
    } catch (error) {
     // エラーログを出力して例外を再スロー
     console.error(errorMessage, error);
     reject(error);
    }
   },
   // 指定された遅延時間 + 基本遅延時間（ミリ秒に変換）
   (delaySeconds + SETTINGS.basicDelaySeconds) * 1000
  );
 });
}
