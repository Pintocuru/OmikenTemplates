// config.js

const WORD_CONFIG = {
 generator: {
  // -------------------------------------------------
  // 一般設定
  // -------------------------------------------------
  TARGET: 5, // 目標となる数値
  IS_LOOP: false, // 目標達成後、色を変化させるか
  // countが初期値のテキスト・カラー
  TEXTS_FIRST: '勝利をつかめ！',
  STYLES_FIRST: {
   textColor: '#06b6d4', // Cyan
   colorClass: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500'
  },
  // 数値が増えるたびに変化するテキスト
  TEXTS: ['ナイスプレイ！', 'すごい！', '絶好調！', '超のつく大ファン！'],
  // TARGET_COUNT達成後、ランダムで変化するテキスト
  TEXTS_AFTER: [
   '上位3位確定！',
   '燃えてるぞ！',
   '大好き！',
   'アストロビーン！',
   'エネルギー満タン！',
   'おバカなガチョウ！',
   'かっこつけて落下！',
   'クラーケンに挑戦！',
   'こっちこないで！',
   'サンザンダーランド！',
   'しっぽハンタ―！',
   'ジョイビーン！',
   'スライムクライマー！',
   'スライムスイマー！',
   'ただいま探検中！',
   'ダイナミック・デュオ！',
   'つかみ魔！',
   'タマゴ泥棒！',
   'デジトライアル中！',
   'バウンドガイ！',
   'ハグ大好き卿！',
   'ハンマークラン！',
   'ヒヤヒヤ曲芸師！',
   'ブラストボーラー！',
   'フリーハグ！',
   'ベイクドビーンズ！',
   'ペンギンチェイサー！',
   'ホットドッグギャング！',
   'レーザービーン！',
   '王冠コレクター！',
   '金メダルが目標！',
   '見て見てー！',
   '雪玉サバイバー！',
   '全力でつかみます！',
   '桃色一筋！',
   '美しいぶよぶよ！',
   '魅せプレイヤー！',
   '理想のスクワッド！',
   '遊泳不可！'
  ],
  STYLES: [
   {
    textColor: '#06b6d4', // Cyan
    colorClass: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500'
   },
   {
    textColor: '#10b981', // Emerald
    colorClass: 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500'
   },
   {
    textColor: '#ec4899', // Pink
    colorClass: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-500'
   },
   {
    textColor: '#8b5cf6', // Purple
    colorClass: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500'
   },
   {
    textColor: '#d4af37', // Gold
    colorClass: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600'
   }
  ],
  EASTER_MODE: false // 隠しモード(trueにすると、Splatoonの二つ名になります)
 },
 counter: {
  // -------------------------------------------------
  // わんコメ設定(わんコメを稼働している時のみ機能します)
  // -------------------------------------------------
  // WordPartyの発火タイミング
  PARTY: {
   10: '!count_10',
   20: '!count_20'
  },
  PARTY_EVENT: '!count_event', // カウント増加時に発火するWordParty
  PARTY_SUCCESS: '!count_success', // TARGET_COUNT達成時に発火するWordParty

  // -------------------------------------------------
  // 特殊な設定(これらを変更すると挙動が変わります)
  // -------------------------------------------------
  multiplier: 1, // 値を掛け算する
  countMode: 'comment' // カウントモード
 }
};

const CONFIG = {
 ENABLED_SERVICES: [], // 適用するプラットフォーム('!'でネガティブ、'platforms'で配信サイトのみ)
 ALLOWED_IDS: [], // 適用するユーザーIDリスト('!'でネガティブ)
 ACCESS_LEVEL: 3, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['👑', '優勝', '勝利'] // インクリメントするキーワード
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
