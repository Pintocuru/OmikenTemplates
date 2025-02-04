// src/config.js

const CONFIG = {
 USER_ALLOWED_IDS: [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: [], // 通さないuserIDリスト
 WORD_MATCH: [
  {
   id: 'suika', // スイカゲームを適用
   isGift: false, // ギフトで有効にするか
   startsWith: ['', '', '', '', ''], // 有効ワード
   regex: [] // 正規表現でマッチするコメント
  }
 ] // ワードによるフィルタリング
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
