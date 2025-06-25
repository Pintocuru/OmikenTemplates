function y(i, t) {
 return { ruleId: i, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
class l {
 static DEFAULT_USER_NAME = 'Unknown';
 static WIN_RATE_MULTIPLIER = 100;
 settings = { rankMode: 'wins' };
 gameState = y('WinChan');
 setup(t) {
  (this.settings = t), (this.gameState = y('WinChan'));
 }
 run(t, e) {
  const s = this.gameState,
   n = t == null ? void 0 : t.data.userId;
  if (!n) throw new Error('User ID is required');
  try {
   const a = this.updateUserStats(s.userStats, t, e, n),
    r = this.generateRankings(s, a, e, n),
    c = this.calculatePlaceholders(a[n], r, n);
   return (this.gameState = { ...s, rankings: r, userStats: a }), { placeholders: c, postActions: [] };
  } catch (a) {
   throw (console.error('Game execution error:', a), new Error('ゲーム実行中にエラーが発生しました'));
  }
 }
 updateUserStats(t, e, s, n) {
  const a = { ...(t[n] ?? { userId: n, name: e.data.name, draws: 0 }) },
   { isWin: r, getPoint: c } = s,
   { rankMode: o } = this.settings;
  return (
   r && (a.wins = o === 'point' ? 1 : (a.wins || 0) + 1),
   c > 0 && (a.points = o === 'point' ? c : (a.points || 0) + c),
   o !== 'point' && (a.draws = (a.draws || 0) + 1),
   { ...t, [n]: a }
  );
 }
 generateRankings(t, e, s, n) {
  if (!s.isRank) return t.rankings || [];
  switch (this.settings.rankMode) {
   case 'point':
    return this.generatePointRankings(e, n);
   case 'wins':
   case 'rate':
   case 'totalPoints':
    return this.generateTotalRankings(t, e, n);
   default:
    return (
     console.warn(`Unknown rank mode: ${this.settings.rankMode}. Using total rankings.`),
     this.generateTotalRankings(t, e, n)
    );
  }
 }
 generatePointRankings(t, e) {
  const s = t[e];
  return s
   ? [{ userId: e, name: s.name || l.DEFAULT_USER_NAME, points: s.points || 0, rank: 1 }]
   : (console.warn(`User stats not found for userId: ${e}`), []);
 }
 generateTotalRankings(t, e, s) {
  const n = t.rankings || [],
   a = Object.entries(e).map(([o, p]) => {
    const d = n.find((E) => E.userId === o),
     u = p.draws ?? (d == null ? void 0 : d.draws) ?? 0,
     g = p.wins ?? (d == null ? void 0 : d.wins) ?? 0,
     k = p.points ?? (d == null ? void 0 : d.points) ?? 0;
    return {
     userId: o,
     name: p.name || l.DEFAULT_USER_NAME,
     draws: u,
     wins: g,
     points: k,
     rate: u > 0 ? (g / u) * l.WIN_RATE_MULTIPLIER : 0
    };
   }),
   r = this.getSortKey(),
   c = a
    .sort((o, p) => {
     const d = o[r] ?? 0;
     return (p[r] ?? 0) - d;
    })
    .map((o, p) => ({ ...o, rank: p + 1 }));
  return this.prioritizeCurrentUser(c, s);
 }
 getSortKey() {
  return { wins: 'wins', rate: 'rate', point: 'points', totalPoints: 'points' }[this.settings.rankMode] || 'wins';
 }
 prioritizeCurrentUser(t, e) {
  const s = t.findIndex((r) => r.userId === e);
  if (s === -1) return t;
  const n = [...t],
   [a] = n.splice(s, 1);
  return n.unshift(a), n;
 }
 calculatePlaceholders(t, e, s) {
  const n = String(t.wins ?? 0);
  let a;
  if (this.settings.rankMode === 'point') {
   const r = t.points ?? 0,
    c = e.filter((o) => (o.points ?? 0) > r).length;
   a = String(c + 1);
  } else {
   const r = e.findIndex((c) => c.userId === s);
   a = r >= 0 ? String(r + 1) : '不明';
  }
  return {
   winsCount: n,
   winsRank: a,
   winsRate: (t.draws > 0 ? ((t.wins ?? 0) / t.draws) * l.WIN_RATE_MULTIPLIER : 0).toFixed(1)
  };
 }
}
const R = new l(),
 I = 'Unknown',
 m = { MIN: 0.7, MAX: 1.3 },
 w = 3,
 f = 1,
 M = 8.5,
 S = 2,
 A = 6;
class F {
 gameConfig;
 totalPoints = 0;
 postArray = [];
 constructor(t) {
  (this.gameConfig = t), this.initializeEffects();
 }
 play() {
  return this.playSmallItems(), this.playBigItems(), { points: this.calculateFinalScore(), postArray: this.postArray };
 }
 initializeEffects() {
  this.postArray = [
   { delaySeconds: f, wordParty: '🍒' },
   { delaySeconds: M, wordParty: '!パパッ' }
  ];
 }
 playSmallItems() {
  this.gameConfig.small.forEach((t) => {
   const e = new P(t).draw();
   (this.totalPoints += e.pointsEarned), this.addEmojiEffects(t.party, e.wins);
  });
 }
 playBigItems() {
  let t = w;
  for (; t > 0; ) {
   const e = this.selectBigItem();
   e && ((this.totalPoints += e.points), (t -= e.damage ?? 0), this.addEffect(e.party)), this.addRandomEffects();
  }
 }
 selectBigItem() {
  const t = 100 * Math.random();
  return this.gameConfig.big.find((e) => e.chance > t);
 }
 addRandomEffects() {
  this.gameConfig.big.forEach((t) => {
   t.damage && this.shouldAddRandomEffect(t.damage) && this.addEffect(t.party);
  });
 }
 shouldAddRandomEffect(t) {
  return w - t > Math.random() * A;
 }
 addEmojiEffects(t, e) {
  const s = Math.floor(e / S);
  for (let n = 0; n < s; n++) this.addEffect(t);
 }
 addEffect(t) {
  this.postArray.push({ delaySeconds: f, wordParty: t });
 }
 calculateFinalScore() {
  const t = m.MIN + Math.random() * (m.MAX - m.MIN);
  return Math.ceil(this.totalPoints * t);
 }
}
class P {
 constructor(t) {
  this.item = t;
 }
 draw() {
  let t = 0,
   e = 0;
  const s = this.item.times ?? 0;
  for (let n = 0; n < s; n++) this.isWin() && ((t += this.item.points), e++);
  return { pointsEarned: t, wins: e };
 }
 isWin() {
  return 100 * Math.random() < this.item.chance;
 }
}
const U = new (class {
  settings = { isFruit: 'ON' };
  winChan;
  setup(i) {
   (this.settings = i), (this.winChan = R), this.winChan.setup({ rankMode: 'point' });
  }
  run(i, t) {
   try {
    const { isRank: e, mode: s } = t,
     { isFruit: n } = this.settings,
     a = this.executeGame(s),
     r = this.generateRanking(i, a.points, e);
    return {
     postActions: n ? a.postArray : [],
     placeholders: {
      message: this.createResultMessage(i, a.points),
      points: String(a.points),
      winsRank: r.placeholders.winsRank
     }
    };
   } catch (e) {
    return console.error('ゲーム実行エラー:', e), this.createErrorResult(i);
   }
  }
  executeGame(i) {
   const t = N[i];
   if (!t) throw new Error(`不明なゲームモード: ${i}`);
   return new F(t).play();
  }
  generateRanking(i, t, e) {
   const s = { isWin: 'OFF', getPoint: t, isRank: e };
   return this.winChan.run(i, s);
  }
  createResultMessage(i, t) {
   return `${(i == null ? void 0 : i.data.displayName) ?? I}の得点は${t}!`;
  }
  createErrorResult(i) {
   return { postActions: [], placeholders: { message: this.createResultMessage(i, 0), points: '0', winsRank: '' } };
  }
 })(),
 N = {
  suika: {
   small: [
    { chance: 67, times: 15, points: 1, party: '🍓' },
    { chance: 50, times: 15, points: 3, party: '🍇' },
    { chance: 50, times: 10, points: 10, party: '🍊' },
    { chance: 50, times: 8, points: 20, party: '🦪' },
    { chance: 67, times: 5, points: 50, party: '🍎' }
   ],
   big: [
    { chance: 25, points: 300, damage: 1, party: '🍐' },
    { chance: 25, points: 400, damage: 1, party: '🍍' },
    { chance: 33, points: 500, damage: 2, party: '🍑' },
    { chance: 33, points: 700, damage: 2, party: '🍈' },
    { chance: 50, points: 1e3, damage: 3, party: '🍉' },
    { chance: 100, points: 1e3, damage: 0, party: '🍉' }
   ]
  },
  kabo: {
   small: [
    { chance: 67, times: 15, points: 1, party: '🍓' },
    { chance: 50, times: 15, points: 3, party: '🍇' },
    { chance: 50, times: 10, points: 10, party: '🍊' },
    { chance: 50, times: 8, points: 20, party: '🦪' },
    { chance: 67, times: 5, points: 50, party: '🍎' }
   ],
   big: [
    { chance: 25, points: 150, damage: 0, party: '🍬' },
    { chance: 33, points: 300, damage: 1, party: '🍐' },
    { chance: 33, points: 400, damage: 1, party: '🍍' },
    { chance: 33, points: 500, damage: 2, party: '🍑' },
    { chance: 33, points: 700, damage: 2, party: '🍈' },
    { chance: 50, points: 1e3, damage: 3, party: '🍉' },
    { chance: 50, points: 1e3, damage: 0, party: '🍉' },
    { chance: 100, points: 1200, damage: 0, party: '🎃' }
   ]
  },
  kujira: {
   small: [
    { chance: 50, times: 5, points: 11, party: '!クマノミ' },
    { chance: 50, times: 5, points: 22, party: '!クラゲ' },
    { chance: 50, times: 5, points: 33, party: '!フグ' },
    { chance: 50, times: 5, points: 44, party: '!カニ' },
    { chance: 50, times: 5, points: 55, party: '!マグロ、ご期待ください' }
   ],
   big: [
    { chance: 33, points: 300, damage: 1, party: '!ウミガメ' },
    { chance: 33, points: 350, damage: 1, party: '!マンボウ' },
    { chance: 33, points: 400, damage: 1, party: '!ジンベエザメ' },
    { chance: 33, points: 450, damage: 1, party: '!シャチ' },
    { chance: 100, points: 500, damage: 0, party: '!クジラ' }
   ]
  }
 },
 h = {
  name: 'gousei-suika',
  version: '0.0.3',
  description: '米兜科技 合成大西瓜風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スイカ']
 },
 T = {
  id: h.name,
  name: h.name,
  description: h.description,
  version: h.version,
  author: h.author,
  tags: h.keywords,
  url: '',
  banner: '',
  execute: U,
  settings: [
   {
    id: 'isFruit',
    name: 'フルーツをWordPartyで降らせるか',
    description: 'ON:降らせる(別途専用WordPartyが必要) / OFF:OFF',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  params: [
   {
    id: 'mode',
    name: 'モード',
    description: '降ってくるアイテムや得点が変わります',
    inputType: 'select',
    values: ['スイカゲーム', 'カボチャゲーム', 'クジラゲーム'],
    defaultValue: 'スイカゲーム'
   },
   {
    id: 'isRank',
    name: '結果をランキングに入れるか',
    description: 'OFFなら、ランキングに影響を与えません',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  placeholders: [
   {
    id: 'message',
    name: '標準メッセージ',
    description: 'デフォルトのスイカジェネレーターの返答',
    value: 'userの得点は1500!'
   },
   { id: 'points', name: 'ポイント', description: 'スイカジェネレーターの得点を返します', value: '1500' },
   { id: 'winsRank', name: '順位', description: '今回の順位を返します', value: '3' }
  ]
 };
export { T as default };
