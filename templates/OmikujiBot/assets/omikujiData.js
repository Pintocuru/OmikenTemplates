// @ts-check
/** @type {import('../src/types/OmikujiTypesSchema').OmikujiDataType} */
const omikujiData = {
 comments: {
  1750735467199: {
   id: '1750735467199',
   name: 'おみくじ',
   description:
    '本職巫女さん手製。ゆっくり霊夢の、真面目なおみくじ。時々ゆっくり魔理沙も占います。',
   isEnabled: true,
   order: 2,
   editorColor: '#3B82F6',
   scriptId: null,
   scriptParams: null,
   ruleType: 'comments',
   threshold: {
    conditions: ['comment'],
    syoken: [],
    access: [],
    gift: [],
    count: {
     comparison: 'min',
     unit: 'lc',
     value: 1
    },
    comment: ['おみくじ', 'omikuji', 'omikuzi', '御神籤']
   },
   omikuji: [
    {
     name: 'おみくじ:大吉',
     description: '',
     weight: 15,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_01',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:happy',
       delaySeconds: 1,
       wordParty: '!レベルアップ',
       messageContent: '<<user>>さんの運勢は【大吉】<<omikuji01>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:吉',
     description: '',
     weight: 20,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_02',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:happy',
       delaySeconds: 1,
       wordParty: '!シャキーン2',
       messageContent: '<<user>>さんの運勢は【吉】<<omikuji02>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:中吉',
     description: '',
     weight: 20,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_03',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 1,
       wordParty: '!シーン切り替え1',
       messageContent: '<<user>>さんの運勢は【中吉】<<omikuji03>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:小吉',
     description: '',
     weight: 15,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_04',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 1,
       wordParty: '!シーン切り替え1',
       messageContent: '<<user>>さんの運勢は【小吉】<<omikuji04>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:末吉',
     description: '',
     weight: 15,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_05',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:wink',
       delaySeconds: 1,
       wordParty: '!間抜け1',
       messageContent: '<<user>>さんの運勢は【末吉】<<omikuji05>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:凶',
     description: '',
     weight: 10,
     postActions: [
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:default',
       delaySeconds: 0,
       wordParty: '!omikuji_06',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'reimu',
       iconKey: 'reimu:sad',
       delaySeconds: 1,
       wordParty: '!呪いの旋律',
       messageContent: '<<user>>さんの運勢は【凶】<<omikuji06>>',
       messageToast: ''
      }
     ]
    },
    {
     name: 'おみくじ:残念賞',
     description: '',
     weight: 5,
     postActions: [
      {
       characterKey: 'marisa',
       iconKey: 'marisa:sleepy',
       delaySeconds: -1,
       wordParty: '!omikuji_huru',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'marisa',
       iconKey: 'marisa:sleepy',
       delaySeconds: 0,
       wordParty: '!omikuji_07',
       messageContent: '',
       messageToast: ''
      },
      {
       characterKey: 'marisa',
       iconKey: 'marisa:sleepy',
       delaySeconds: 1,
       wordParty: '!ビシッとツッコミ1',
       messageContent: '<<user>>さんの運勢は【残念賞】<<omikuji07>>',
       messageToast: ''
      }
     ]
    }
   ]
  }
 },
 timers: {},
 placeholders: {
  omikuji01: {
   id: 'omikuji01',
   name: 'おみくじ:大吉',
   order: 0,
   values: [
    {
     weight: 1,
     content: '人との縁が幸運を呼び込みそう。感謝の気持ちを忘れないことが大事よ。'
    },
    {
     weight: 1,
     content: '健康運が特に好調ね。心身ともに充実した日々になるわ。'
    },
    {
     weight: 1,
     content: '努力が実を結び、幸運が訪れるって。積極的に行動すると良いことがあるわ。'
    },
    {
     weight: 1,
     content: '新しい挑戦が成功をもたらす予感。勇気を出して一歩踏み出してみて。'
    },
    {
     weight: 1,
     content: '良い知らせが届くかも。ポジティブな気持ちを持ち続けてね。'
    },
    {
     weight: 1,
     content: '困難な状況も乗り越えられるわ。自信を持って進んで大丈夫よ。'
    }
   ]
  },
  omikuji02: {
   id: 'omikuji02',
   name: 'おみくじ:吉',
   order: 1,
   values: [
    {
     weight: 1,
     content: '積極的に行動すると運気は上がるわ。新しい挑戦はチャンスよ。'
    },
    {
     weight: 1,
     content: '周囲の人々に感謝の気持ちを忘れずにね。'
    },
    {
     weight: 1,
     content: '今後の展望は明るめね。夢に向かって突き進めばいいことがあるわ。'
    },
    {
     weight: 1,
     content: '仲間との協力が成功への鍵よ。チームワークを大切にしてね。'
    },
    {
     weight: 1,
     content: '小さな努力が大きな成果を生むわ。コツコツと続けることが大事よ。'
    },
    {
     weight: 1,
     content: 'ポジティブな考えが良い結果を招くわ。前向きに考え続けてね。'
    }
   ]
  },
  omikuji03: {
   id: 'omikuji03',
   name: 'おみくじ:中吉',
   order: 2,
   values: [
    {
     weight: 1,
     content: '思いがけない幸運があるかも。チャンスを逃さないようにね。'
    },
    {
     weight: 1,
     content: '周囲の人との協力が大切よ。助けを求めることを恐れないで。'
    },
    {
     weight: 1,
     content: '自分の直感を信じていいわ。大きな成長が待ってるそうよ。'
    },
    {
     weight: 1,
     content: '新しいスキルを学ぶと良いわ。自分を磨くチャンスが来てるわよ。'
    },
    {
     weight: 1,
     content: '楽しい出来事が増えるわ。笑顔を忘れずにね。'
    },
    {
     weight: 1,
     content: '計画をしっかり立てることで、成功への道が開けるわ。'
    }
   ]
  },
  omikuji04: {
   id: 'omikuji04',
   name: 'おみくじ:小吉',
   order: 3,
   values: [
    {
     weight: 1,
     content: 'いまは焦らず、一歩ずつ進むことね。努力すれば、願いは叶うと出ているわ。'
    },
    {
     weight: 1,
     content: 'いまは慎重に行動が必要な時。きっと吉へと導かれるわ。慌てない事が大切よ。'
    },
    {
     weight: 1,
     content: '健康面に注意して。規則正しい生活が運気を呼び込むわ。'
    },
    {
     weight: 1,
     content: '周囲のサポートを受け入れることで、運気が上昇するわ。'
    },
    {
     weight: 1,
     content: '小さな喜びを大切にね。それが大きな幸せに繋がるわ。'
    },
    {
     weight: 1,
     content: 'ゆっくりとした進展があるわ。焦らずに自分のペースで進んでね。'
    }
   ]
  },
  omikuji05: {
   id: 'omikuji05',
   name: 'おみくじ:末吉',
   order: 4,
   values: [
    {
     weight: 1,
     content: '油断が思わぬ結果に繋がるわ。慎重に行動して。'
    },
    {
     weight: 1,
     content: '今は試練の時期ね。乗り越えれば、大きな成長が待ってるわ。'
    },
    {
     weight: 1,
     content: '新しいことより、今の事を見直すといい事があるわ。'
    },
    {
     weight: 1,
     content: '計画を練り直すことで、より良い結果が得られるわ。'
    },
    {
     weight: 1,
     content: '周囲の意見に耳を傾けることが、成功の鍵になるわ。'
    },
    {
     weight: 1,
     content: '自己改善に取り組むことで運が開けるわ。自分を見つめ直す時間を作ってね。'
    }
   ]
  },
  omikuji06: {
   id: 'omikuji06',
   name: 'おみくじ:凶',
   order: 5,
   values: [
    {
     weight: 1,
     content: '運気はやや下がり気味。慎重に行動するといいわ。'
    },
    {
     weight: 1,
     content: '周囲の人とのトラブルに注意して。喧嘩になったら、頭を冷やすことね。'
    },
    {
     weight: 1,
     content: '健康面に注意が必要ね。体調管理をしっかり。乳酸菌とってるぅ？'
    },
    {
     weight: 1,
     content: '計画が思い通りに進まないかも。焦らず、柔軟に対応してね。'
    },
    {
     weight: 1,
     content: '信頼できる人に相談すると、助け舟が出るわよ。'
    },
    {
     weight: 1,
     content: '無理をせず、休息を取ることが大切よ。リラックスする時間を作ってね。'
    }
   ]
  },
  omikuji07: {
   id: 'omikuji07',
   name: 'おみくじ:残念賞',
   order: 6,
   values: [
    {
     weight: 1,
     content: '笑いすぎに注意だぜ。腹筋が崩壊するかもしれないぜ。'
    },
    {
     weight: 1,
     content: '終わったわ、風が強すぎるぜ。強すぎてお亡くなりだぜ。'
    },
    {
     weight: 1,
     content: '高嶋ちさ子さんも、長嶋一茂さんも、石原良純さんも、残念！'
    },
    {
     weight: 1,
     content: 'ニューヨークが新しくなくなったら、ただのヨークだぜ。残念ッ！'
    },
    {
     weight: 1,
     content: '剥いても剥いても中身がない野菜？答えは玉ねぎだぜ。残念でした。また来てね。'
    },
    {
     weight: 1,
     content: '知ってる？「コンクリート」っていう漢字があるんだぜ。しかも1文字で。'
    },
    {
     weight: 1,
     content: 'バスケ中にゴリラが横切っても誰も気づかないぜ。インビジブル・ゴリラ実験って言うぜ。'
    },
    {
     weight: 1,
     content: '女子高生とか好きだからって理由で先生になっちゃいけないぜ。奥さんは美人だぜ。'
    }
   ]
  }
 },
 scriptSettings: {
  BomberSpin: {}
 },
 characters: {
  reimu: {
   id: 'reimu',
   name: 'ゆっくり霊夢',
   displayName: 'ゆっくり霊夢',
   description: '優しい振る舞いで人気者のゆっくり霊夢。じゃんけんはとても強い。',
   version: '0.0.1',
   author: 'Pintocuru',
   order: 101,
   tags: ['Yukkuri', 'Reimu'],
   url: 'https://nagipon-sozai.studio.site/',
   isIconDisplay: true,
   frameId: 'OmikenReimu',
   color: {
    nameColor: '#FFC107',
    textColor: '#ECEFF1',
    backgroundColor: '#FF4081'
   },
   image: {
    default: 'reimu/Default.png',
    happy: 'reimu/joy01.png',
    excited: 'reimu/joy04.png',
    laughing: 'reimu/relax01.png',
    blushing: 'reimu/shy02.png',
    surprised: 'reimu/surprise03.png',
    sad: 'reimu/sad01.png',
    angry: 'reimu/anger01.png',
    thinking: 'reimu/fun02.png',
    wink: 'reimu/relax03.png',
    singing: 'reimu/joy03.png',
    sleepy: 'reimu/contempt02.png'
   }
  },
  marisa: {
   id: 'marisa',
   name: 'ゆっくり魔理沙',
   displayName: 'ゆっくり魔理沙',
   description: '花とキノコが好きな、ゆっくり魔理沙。じゃんけんはちょっと弱い。',
   version: '0.0.1',
   author: 'Pintocuru',
   order: 102,
   tags: ['Yukkuri', 'Marisa'],
   url: 'https://nagipon-sozai.studio.site/',
   isIconDisplay: true,
   frameId: 'OmikenMarisa',
   color: {
    nameColor: '#FFE082',
    textColor: '#333333',
    backgroundColor: '#FF8F00'
   },
   image: {
    default: 'marisa/Default.png',
    happy: 'marisa/joy01.png',
    excited: 'marisa/joy04.png',
    laughing: 'marisa/relax01.png',
    blushing: 'marisa/shy02.png',
    surprised: 'marisa/surprise03.png',
    sad: 'marisa/sad01.png',
    angry: 'marisa/anger01.png',
    thinking: 'marisa/fun02.png',
    wink: 'marisa/relax03.png',
    singing: 'marisa/joy03.png',
    sleepy: 'marisa/contempt02.png'
   }
  }
 }
};

if (typeof window !== 'undefined') window.omikujiData = omikujiData;
