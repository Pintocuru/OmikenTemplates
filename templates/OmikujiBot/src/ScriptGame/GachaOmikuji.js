const s = [
  {
   weight: 544,
   content: [
    'ワン',
    'バウ',
    'モー',
    'ピヨ',
    'コケ',
    'ケロ',
    'ブー',
    'モグ',
    'チュン',
    'メェー',
    'チュー',
    'ミャー',
    'クワッ',
    'キュイ',
    'ヒヒン',
    'キャン',
    'クエッ',
    'ガルル',
    'ガオー'
   ],
   prefix: '',
   rarity: 0,
   rarityName: 'N'
  },
  {
   weight: 334,
   content: [
    'ゲコゲコ',
    'ホーホー',
    'カッコー',
    'ウキーッ',
    'ブヒブヒ',
    'ヒヒーン',
    'パオーン',
    'ギャオン',
    'クルッポー',
    'コケコッコー',
    'キュルキュル',
    'ホーホケキョ',
    'ピィーヒョロロ'
   ],
   prefix: '',
   rarity: 1,
   rarityName: 'R'
  },
  {
   weight: 100,
   content: [
    '紅鶴',
    '黒豹',
    '青鯨',
    '銀狼',
    '蒼鷹',
    '虎狼',
    '金熊',
    '斑馬',
    '黒熊',
    '山猫',
    '雪豹',
    '銀狐',
    '海豚',
    '森鹿',
    '雪熊',
    '銀鯱',
    '火狐',
    '水獺',
    '巨象',
    '虎王',
    '獅子',
    '鷹目',
    '稲荷',
    '蝶舞',
    '獏夢'
   ],
   prefix: '【激レア!】',
   rarity: 2,
   rarityName: 'SR'
  },
  {
   weight: 20,
   content: [
    '鳳凰王',
    '麒麟聖',
    '龍神帝',
    '玄亀甲',
    '白虎皇',
    '朱雀炎',
    '青龍天',
    '仙狐霊',
    '天狗翼',
    '九狐幻',
    '八蛇魔'
   ],
   prefix: '【超激レア!!】',
   rarity: 3,
   rarityName: 'SSR'
  },
  { weight: 2, content: ['福沢諭'], prefix: '【伝説の究極レア!!!】', rarity: 4, rarityName: 'LR' }
 ],
 c = new (class {
  settings = { isSound: 'ON' };
  setup(e) {
   this.settings = e;
  }
  run(e, n) {
   const a = this.drawThreeOmikuji(),
    r = (e == null ? void 0 : e.data.displayName) ?? 'Unknown',
    o = this.formatMessage(r, a),
    t = this.createEffects(Math.max(...a.map((d) => d.rarity)));
   return {
    postActions: this.settings.isSound === 'ON' ? t : [],
    placeholders: { message: o, rarity: a[2].rarityName }
   };
  }
  drawThreeOmikuji() {
   const e = s.reduce((a, r) => a + r.weight, 0),
    n = [];
   for (let a = 0; a < 3; a++) {
    let r = Math.random() * e;
    const o = s.findIndex((d) => (r -= d.weight) <= 0),
     t = s[o];
    n.push({
     prefix: t.prefix,
     content: t.content[Math.floor(Math.random() * t.content.length)],
     rarity: t.rarity,
     index: o,
     rarityName: t.rarityName
    });
   }
   return n.sort((a, r) => a.index - r.index);
  }
  formatMessage(e, n) {
   return `${e}の3連おみくじ! ${n.map((a) => `${a.prefix}${a.content}吉!`).join(' ')}`;
  }
  createEffects(e) {
   return [
    ...({
     0: [{ delaySeconds: 0.7, wordParty: '!gacha_A1' }],
     1: [{ delaySeconds: 0.7, wordParty: '!gacha_A1' }],
     2: [
      { delaySeconds: 0.7, wordParty: '!gacha_B1' },
      { delaySeconds: 2.2, wordParty: '!gacha_B2' }
     ],
     3: [
      { delaySeconds: 0.7, wordParty: '!gacha_C1' },
      { delaySeconds: 2.2, wordParty: '!gacha_C2' },
      { delaySeconds: 2.2, wordParty: '!gacha_C3' }
     ],
     4: [
      { delaySeconds: 0.7, wordParty: '!gacha_A1' },
      { delaySeconds: 2.2, wordParty: '!gacha_C2' },
      { delaySeconds: 2.2, wordParty: '!gacha_C3' }
     ]
    }[e] || []),
    { delaySeconds: -1, wordParty: '!gacha_00A' },
    { delaySeconds: 0.8, wordParty: '!gacha_00B' }
   ];
  }
 })(),
 i = {
  name: 'gacha-omikuji',
  version: '0.0.1',
  description: 'ソーシャルゲームのガチャ風おみくじ',
  author: 'Pintocuru',
  keywords: ['おみくじ', 'ソーシャルゲーム', 'gacha']
 },
 y = {
  id: i.name,
  name: i.name,
  description: i.description,
  version: i.version,
  author: i.author,
  tags: i.keywords,
  url: '',
  execute: c,
  settings: [
   {
    id: 'isSound',
    name: 'WordPartyで音を鳴らすか',
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  params: [],
  placeholders: [
   {
    id: 'message',
    name: '標準メッセージ',
    description: 'デフォルトの返答',
    value: 'userの3連おみくじ!ミャー吉!メェー吉!【激レア!】巨象吉!'
   },
   { id: 'rarity', name: 'レアリティ', description: '今回出た中で最も高いレア度', value: '【R】' }
  ]
 };
export { y as default };
