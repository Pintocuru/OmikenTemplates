// OmikujiData のサンプルデータ
import { OmikujiData } from '@/OmikujiTypes';

export const omikujiSampleData: OmikujiData = {
 // =============================================================================
 // コメントルール
 // =============================================================================
 comments: {
  comment_rule_1: {
   id: 'comment_rule_1',
   name: '新規視聴者歓迎おみくじ',
   description: '新しい視聴者がコメントした時のおみくじ',
   isEnabled: true,
   order: 1,
   editorColor: '#FF6B6B',
   scriptId: null,
   ruleType: 'comments',
   threshold: {
    conditions: ['comment'],
    syoken: [],
    access: [],
    gift: [],
    count: {
     comparison: 'max',
     unit: 'lc',
     value: 1
    },
    comment: ['おみくじ']
   },
   omikuji: [
    {
     name: '大吉',
     description: '最高の運勢！',
     weight: 10,
     placeholderIds: ['greeting', 'lucky_message'],
     postActions: [
      {
       iconKey: 'star',
       delaySeconds: 2,
       wordParty: 'celebration',
       messageContent: '🌟 <<greeting>> 大吉が出ました！ <<lucky_message>>',
       messageToast: '大吉のおみくじを投稿しました'
      }
     ]
    },
    {
     name: '中吉',
     description: 'まずまずの運勢',
     weight: 30,
     placeholderIds: ['greeting', 'normal_message'],
     postActions: [
      {
       iconKey: 'smile',
       delaySeconds: 1,
       wordParty: 'normal',
       messageContent: '😊 <<greeting>> 中吉です！ <<normal_message>>',
       messageToast: '中吉のおみくじを投稿しました'
      }
     ]
    },
    {
     name: '小吉',
     description: '少し良い運勢',
     weight: 40,
     placeholderIds: ['greeting', 'encourage_message'],
     postActions: [
      {
       iconKey: 'thumbs_up',
       delaySeconds: 1,
       wordParty: 'encourage',
       messageContent: '👍 <<greeting>> 小吉ですね。 <<encourage_message>>',
       messageToast: '小吉のおみくじを投稿しました'
      }
     ]
    },
    {
     name: '凶',
     description: '注意が必要な運勢',
     weight: 20,
     placeholderIds: ['greeting', 'warning_message'],
     postActions: [
      {
       iconKey: 'warning',
       delaySeconds: 3,
       wordParty: 'caution',
       messageContent: '⚠️ <<greeting>> 凶が出ました... <<warning_message>>',
       messageToast: '凶のおみくじを投稿しました'
      }
     ]
    }
   ]
  },
  comment_rule_2: {
   id: 'comment_rule_2',
   name: '質問応答おみくじ',
   description: '質問系コメントに対するおみくじ回答',
   isEnabled: true,
   order: 2,
   editorColor: '#4ECDC4',
   scriptId: 'question_script_001',
   ruleType: 'comments',
   threshold: {
    conditions: ['comment'],
    syoken: [],
    access: [],
    gift: [],
    count: {
     comparison: 'max',
     unit: 'lc',
     value: 1
    },
    comment: ['test']
   },
   omikuji: [
    {
     name: '明確な答え',
     description: 'はっきりとした回答',
     weight: 40,
     placeholderIds: ['clear_answer', 'confidence'],
     postActions: [
      {
       iconKey: 'lightbulb',
       delaySeconds: 1,
       wordParty: 'answer',
       messageContent: '💡 <<clear_answer>> <<confidence>>',
       messageToast: '明確な回答を投稿しました'
      }
     ]
    },
    {
     name: '曖昧な答え',
     description: '少し曖昧な回答',
     weight: 35,
     placeholderIds: ['vague_answer', 'maybe'],
     postActions: [
      {
       iconKey: 'question',
       delaySeconds: 2,
       wordParty: 'maybe',
       messageContent: '🤔 <<vague_answer>> <<maybe>>',
       messageToast: '曖昧な回答を投稿しました'
      }
     ]
    },
    {
     name: '謎かけ',
     description: '謎かけで返答',
     weight: 25,
     placeholderIds: ['riddle', 'hint'],
     postActions: [
      {
       iconKey: 'mystery',
       delaySeconds: 4,
       wordParty: 'riddle',
       messageContent: '🎭 <<riddle>> <<hint>>',
       messageToast: '謎かけを投稿しました'
      }
     ]
    }
   ]
  }
 },

 // =============================================================================
 // タイマールール
 // =============================================================================
 timers: {
  timer_rule_1: {
   id: 'timer_rule_1',
   name: '定期運勢チェック',
   description: '30分おきに運勢をお知らせ',
   isEnabled: true,
   order: 1,
   editorColor: '#45B7D1',
   scriptId: null,
   ruleType: 'timers',
   intervalSeconds: 1800, // 30分
   omikuji: [
    {
     name: '今の運勢',
     description: '現在の運勢状況',
     weight: 100,
     placeholderIds: ['time_greeting', 'current_fortune', 'advice'],
     postActions: [
      {
       iconKey: 'clock',
       delaySeconds: 0,
       wordParty: 'time_check',
       messageContent: '⏰ <<time_greeting>> <<current_fortune>> <<advice>>',
       messageToast: '定期運勢チェックを投稿しました'
      }
     ]
    }
   ]
  },
  timer_rule_2: {
   id: 'timer_rule_2',
   name: '毎時の豆知識',
   description: '1時間ごとに豆知識を投稿',
   isEnabled: false,
   order: 2,
   editorColor: '#96CEB4',
   scriptId: 'trivia_script_001',
   ruleType: 'timers',
   intervalSeconds: 3600, // 1時間
   omikuji: [
    {
     name: '動物の豆知識',
     description: '動物に関する面白い事実',
     weight: 30,
     placeholderIds: ['animal_fact', 'surprise_emoji'],
     postActions: [
      {
       iconKey: 'animal',
       delaySeconds: 1,
       wordParty: 'trivia',
       messageContent: '🐾 <<surprise_emoji>> <<animal_fact>>',
       messageToast: '動物の豆知識を投稿しました'
      }
     ]
    },
    {
     name: '宇宙の豆知識',
     description: '宇宙に関する興味深い話',
     weight: 30,
     placeholderIds: ['space_fact', 'wonder_emoji'],
     postActions: [
      {
       iconKey: 'star',
       delaySeconds: 2,
       wordParty: 'space',
       messageContent: '🌌 <<wonder_emoji>> <<space_fact>>',
       messageToast: '宇宙の豆知識を投稿しました'
      }
     ]
    },
    {
     name: '歴史の豆知識',
     description: '歴史の面白いエピソード',
     weight: 40,
     placeholderIds: ['history_fact', 'time_emoji'],
     postActions: [
      {
       iconKey: 'book',
       delaySeconds: 1,
       wordParty: 'history',
       messageContent: '📚 <<time_emoji>> <<history_fact>>',
       messageToast: '歴史の豆知識を投稿しました'
      }
     ]
    }
   ]
  }
 },

 // =============================================================================
 // プレースホルダー
 // =============================================================================
 placeholders: {
  // 挨拶系
  greeting: {
   id: 'greeting',
   name: '挨拶',
   description: '様々な挨拶表現',
   placeholderIds: [],
   values: [
    { weight: 25, content: 'こんにちは！' },
    { weight: 25, content: 'いらっしゃいませ！' },
    { weight: 20, content: 'ようこそ！' },
    { weight: 15, content: 'お疲れ様です！' },
    { weight: 15, content: 'はじめまして！' }
   ]
  },

  // メッセージ系
  lucky_message: {
   id: 'lucky_message',
   name: '幸運メッセージ',
   description: '幸運を表すメッセージ',
   placeholderIds: ['lucky_action'],
   values: [
    { weight: 30, content: '今日は素晴らしい一日になりそうです！ <<lucky_action>>' },
    { weight: 25, content: '幸運が舞い込んできそうな予感です！ <<lucky_action>>' },
    { weight: 25, content: 'ラッキーな出来事が待っているかも！ <<lucky_action>>' },
    { weight: 20, content: '運気上昇中です！ <<lucky_action>>' }
   ]
  },

  normal_message: {
   id: 'normal_message',
   name: '通常メッセージ',
   description: '普通の状況でのメッセージ',
   placeholderIds: [],
   values: [
    { weight: 30, content: '程よく頑張っていきましょう。' },
    { weight: 25, content: 'マイペースで進んでいけば大丈夫です。' },
    { weight: 25, content: '今日も一歩ずつ前進しましょう。' },
    { weight: 20, content: '無理せず自分らしく過ごしてくださいね。' }
   ]
  },

  encourage_message: {
   id: 'encourage_message',
   name: '励ましメッセージ',
   description: '励ましや応援のメッセージ',
   placeholderIds: [],
   values: [
    { weight: 30, content: 'きっと良いことがありますよ！' },
    { weight: 25, content: '頑張って続けていれば報われます。' },
    { weight: 25, content: '諦めずに進んでいけば道は開けます。' },
    { weight: 20, content: 'あなたならきっとうまくいきます！' }
   ]
  },

  warning_message: {
   id: 'warning_message',
   name: '注意メッセージ',
   description: '注意や気をつけるべきことのメッセージ',
   placeholderIds: [],
   values: [
    { weight: 30, content: '今日は慎重に行動してくださいね。' },
    { weight: 25, content: 'でも大丈夫、きっと乗り越えられます。' },
    { weight: 25, content: '注意深く進めば問題ありません。' },
    { weight: 20, content: 'ピンチをチャンスに変えましょう！' }
   ]
  },

  // アクション系
  lucky_action: {
   id: 'lucky_action',
   name: '幸運のアクション',
   description: '幸運を呼び込むための行動提案',
   placeholderIds: [],
   values: [
    { weight: 20, content: '笑顔を心がけてみてください。' },
    { weight: 20, content: '新しいことにチャレンジしてみるのも良いかも。' },
    { weight: 20, content: '周りの人に感謝の気持ちを伝えてみましょう。' },
    { weight: 20, content: '自然に触れる時間を作ってみてください。' },
    { weight: 20, content: '好きなことに時間を使ってリフレッシュしましょう。' }
   ]
  },

  // 質問応答系
  clear_answer: {
   id: 'clear_answer',
   name: '明確な回答',
   description: 'はっきりとした答え',
   placeholderIds: [],
   values: [
    { weight: 25, content: 'はい、その通りです！' },
    { weight: 25, content: '間違いありません。' },
    { weight: 25, content: '確実にそうですね。' },
    { weight: 25, content: '絶対にそうです！' }
   ]
  },

  vague_answer: {
   id: 'vague_answer',
   name: '曖昧な回答',
   description: '少し曖昧な答え',
   placeholderIds: [],
   values: [
    { weight: 25, content: 'うーん、そうかもしれませんね。' },
    { weight: 25, content: '可能性はありそうです。' },
    { weight: 25, content: 'どちらとも言えませんが...' },
    { weight: 25, content: '微妙なところですね。' }
   ]
  },

  confidence: {
   id: 'confidence',
   name: '自信度',
   description: '回答の確信度を表現',
   placeholderIds: [],
   values: [
    { weight: 40, content: '自信を持って言えます！' },
    { weight: 35, content: 'きっとそうでしょう。' },
    { weight: 25, content: 'おそらく正解です。' }
   ]
  },

  maybe: {
   id: 'maybe',
   name: 'かもしれない表現',
   description: '不確実性を表現する言葉',
   placeholderIds: [],
   values: [
    { weight: 30, content: 'かもしれませんね。' },
    { weight: 25, content: 'だと思います。' },
    { weight: 25, content: 'の可能性が高いです。' },
    { weight: 20, content: 'でしょうね。' }
   ]
  },

  riddle: {
   id: 'riddle',
   name: '謎かけ',
   description: '謎かけやなぞなぞ',
   placeholderIds: [],
   values: [
    { weight: 25, content: '答えは風の中にあります...' },
    { weight: 25, content: '真実は鏡の向こう側に...' },
    { weight: 25, content: '解答は星に聞いてみてください...' },
    { weight: 25, content: '答えはあなたの心の中に...' }
   ]
  },

  hint: {
   id: 'hint',
   name: 'ヒント',
   description: '謎解きのヒント',
   placeholderIds: [],
   values: [
    { weight: 25, content: 'ヒント：よく考えてみてくださいね。' },
    { weight: 25, content: 'ヒント：答えは意外と身近にあります。' },
    { weight: 25, content: 'ヒント：逆から考えてみると...' },
    { weight: 25, content: 'ヒント：答えは一つではないかも？' }
   ]
  },

  // 時間系
  time_greeting: {
   id: 'time_greeting',
   name: '時間の挨拶',
   description: '時間に応じた挨拶',
   placeholderIds: [],
   values: [
    { weight: 25, content: 'お疲れ様です！' },
    { weight: 25, content: '定刻のお時間です。' },
    { weight: 25, content: '時間が経つのは早いですね。' },
    { weight: 25, content: 'いかがお過ごしでしょうか？' }
   ]
  },

  current_fortune: {
   id: 'current_fortune',
   name: '現在の運勢',
   description: '今の運勢状況',
   placeholderIds: [],
   values: [
    { weight: 20, content: '今の運気は上昇中です！' },
    { weight: 20, content: '運勢は安定しています。' },
    { weight: 20, content: '少し運気が停滞気味ですが...' },
    { weight: 20, content: '転機が近づいている予感です。' },
    { weight: 20, content: '今日の運勢は波がありそうです。' }
   ]
  },

  advice: {
   id: 'advice',
   name: 'アドバイス',
   description: '運勢に基づくアドバイス',
   placeholderIds: [],
   values: [
    { weight: 20, content: '積極的に行動してみてください。' },
    { weight: 20, content: '今は様子を見る時期かもしれません。' },
    { weight: 20, content: '周りの人との協力が鍵になりそうです。' },
    { weight: 20, content: '直感を信じて進んでみましょう。' },
    { weight: 20, content: 'バランスを大切に過ごしてください。' }
   ]
  },

  // 豆知識系
  animal_fact: {
   id: 'animal_fact',
   name: '動物の豆知識',
   description: '動物に関する面白い事実',
   placeholderIds: [],
   values: [
    { weight: 20, content: 'パンダの指は実は6本あります！' },
    { weight: 20, content: 'フラミンゴが片足立ちするのは体温保持のためです。' },
    { weight: 20, content: 'コアラは1日20時間も眠ります。' },
    { weight: 20, content: 'ペンギンには膝があります！' },
    { weight: 20, content: 'ゾウは鼻だけで4万以上の筋肉を持っています。' }
   ]
  },

  space_fact: {
   id: 'space_fact',
   name: '宇宙の豆知識',
   description: '宇宙に関する興味深い話',
   placeholderIds: [],
   values: [
    { weight: 20, content: '一日は実際には23時間56分4秒です。' },
    { weight: 20, content: '金星は太陽系で一番熱い惑星です。' },
    { weight: 20, content: '木星には67個以上の衛星があります。' },
    { weight: 20, content: '宇宙では音は伝わりません。' },
    { weight: 20, content: '太陽の光が地球に届くまで約8分かかります。' }
   ]
  },

  history_fact: {
   id: 'history_fact',
   name: '歴史の豆知識',
   description: '歴史の面白いエピソード',
   placeholderIds: [],
   values: [
    { weight: 20, content: 'クレオパトラはピラミッド建設よりも現代に近い時代を生きていました。' },
    { weight: 20, content: '万里の長城は月からは見えません。' },
    { weight: 20, content: 'ナポレオンは実は平均身長でした。' },
    { weight: 20, content: 'バイキングの兜には角はありませんでした。' },
    { weight: 20, content: '古代エジプト人はすでに歯磨き粉を使っていました。' }
   ]
  },

  // 絵文字系
  surprise_emoji: {
   id: 'surprise_emoji',
   name: '驚き絵文字',
   description: '驚きを表現する絵文字',
   placeholderIds: [],
   values: [
    { weight: 25, content: '😲' },
    { weight: 25, content: '🤯' },
    { weight: 25, content: '😱' },
    { weight: 25, content: '🙀' }
   ]
  },

  wonder_emoji: {
   id: 'wonder_emoji',
   name: '不思議絵文字',
   description: '不思議さを表現する絵文字',
   placeholderIds: [],
   values: [
    { weight: 25, content: '✨' },
    { weight: 25, content: '🌟' },
    { weight: 25, content: '🔮' },
    { weight: 25, content: '🌠' }
   ]
  },

  time_emoji: {
   id: 'time_emoji',
   name: '時間絵文字',
   description: '時間や歴史を表現する絵文字',
   placeholderIds: [],
   values: [
    { weight: 25, content: '⏳' },
    { weight: 25, content: '🕰️' },
    { weight: 25, content: '📜' },
    { weight: 25, content: '🏛️' }
   ]
  }
 }
};
