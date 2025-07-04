function m(e, a) {
 return { ruleId: e, totalDraws: 0, userStats: {}, currentUserIds: [], ...a };
}
const w = new (class {
  settings = { rankMode: 'wins' };
  gameState = m('LogRank');
  setup(e) {
   (this.settings = e), (this.gameState = m('LogRank'));
  }
  run(e, a) {
   try {
    const n = e.data.userId,
     t = this.updateUserStats(n, e.data.name, a),
     s = this.generateRankings(t, a, n);
    return (
     (this.gameState = { ...this.gameState, userStats: t, rankings: s }),
     { placeholders: this.createPlaceholders(t[n], s, n, a), postActions: [], rankingList: s }
    );
   } catch (n) {
    throw (console.error('Game execution error:', n), new Error('ゲーム実行中にエラーが発生しました'));
   }
  }
  updateUserStats(e, a, n) {
   const t = {
     ...(this.gameState.userStats[e] ?? {
      userId: e,
      name: a,
      draws: 0,
      wins: 0,
      points: 0,
      totalPoints: 0,
      rank: 0,
      rate: 0
     })
    },
    { isWin: s, getPoint: i } = n,
    { rankMode: o } = this.settings;
   return (
    o === 'point'
     ? ((t.wins = s ? 1 : 0), (t.points = i), (t.totalPoints = (t.totalPoints || 0) + i))
     : (i > 0 && ((t.points = (t.points || 0) + i), (t.totalPoints = (t.totalPoints || 0) + i)),
       s && (t.wins = (t.wins || 0) + 1),
       (t.draws = (t.draws || 0) + 1)),
    { ...this.gameState.userStats, [e]: t }
   );
  }
  generateRankings(e, a, n) {
   if (a.enableCount > 0 && a.enableCount < e[n].draws) return this.gameState.rankings || [];
   const { rankMode: t } = this.settings;
   if (t === 'point') {
    const r = e[n];
    return [
     {
      userId: n,
      name: r.name || 'Unknown',
      draws: r.draws || 0,
      wins: r.wins || 0,
      points: r.points || 0,
      totalPoints: r.totalPoints || 0,
      rank: r.rank || 0,
      rate: r.rate || 0
     }
    ];
   }
   const s = this.createRankingEntries(e),
    i = t === 'rate' ? 'rate' : 'wins',
    o = s.sort((r, u) => (u[i] ?? 0) - (r[i] ?? 0)).map((r, u) => ({ ...r, rank: u + 1 })),
    d = o.findIndex((r) => r.userId === n);
   if (d > 0) {
    const [r] = o.splice(d, 1);
    o.unshift(r);
   }
   return o;
  }
  createRankingEntries(e) {
   const a = this.gameState.rankings || [];
   return Object.entries(e).map(([n, t]) => {
    const s = a.find((u) => u.userId === n),
     i = t.draws ?? (s == null ? void 0 : s.draws) ?? 0,
     o = t.wins ?? (s == null ? void 0 : s.wins) ?? 0,
     d = t.points ?? (s == null ? void 0 : s.points) ?? 0,
     r = t.totalPoints ?? (s == null ? void 0 : s.totalPoints) ?? 0;
    return {
     userId: n,
     name: t.name || 'Unknown',
     draws: i,
     wins: o,
     points: d,
     totalPoints: r,
     rank: t.rank ?? (s == null ? void 0 : s.rank) ?? 0,
     rate: i > 0 ? (o / i) * 100 : 0
    };
   });
  }
  createPlaceholders(e, a, n, t) {
   const s = t.enableCount > 0 && t.enableCount < e.draws,
    i = this.calculateRank(e, a, n),
    o = e.draws > 0 ? (((e.wins || 0) / e.draws) * 100).toFixed(1) : '0.0';
   return {
    announceMessage: s ? `${e.name}さんは上限を超えているから、参考記録だよ。` : `${e.name}さんの順位は、${i}位だよ。`,
    winsCount: String(e.wins ?? 0),
    winsRank: i,
    winsRate: o,
    totalDraws: String(e.draws ?? 0),
    totalPoints: String(e.totalPoints ?? 0)
   };
  }
  calculateRank(e, a, n) {
   if (this.settings.rankMode === 'point') {
    const s = e.points ?? 0,
     i = a.filter((o) => (o.points ?? 0) > s).length;
    return String(i + 1);
   }
   const t = a.findIndex((s) => s.userId === n);
   return t >= 0 ? String(t + 1) : '不明';
  }
 })(),
 c = 2e4,
 y = 15,
 h = 1,
 k = 2,
 f = { CRITICAL: { damage: 2, heal: 2 }, NORMAL: { damage: 1, heal: 1 }, MISS: { damage: 0, heal: 0 } },
 g = [
  { weight: 9, enemyLife: [2, 2, 2, 3, 4, 5, 6, 12], name: '通常A' },
  { weight: 8, enemyLife: [2, 3, 2, 3, 5, 4, 6, 12], name: '通常B' },
  { weight: 7, enemyLife: [1, 1, 2, 4, 5, 7, 8, 12], name: '前半チャンスA' },
  { weight: 6, enemyLife: [1, 1, 1, 2, 7, 8, 9, 12], name: '前半チャンスB' },
  { weight: 5, enemyLife: [3, 5, 7, 4, 4, 3, 3, 12], name: '後半チャンスA' },
  { weight: 4, enemyLife: [5, 6, 7, 4, 3, 2, 1, 12], name: '後半チャンスB' },
  { weight: 3, enemyLife: [4, 4, 4, 4, 4, 4, 4, 12], name: '同じ敵' },
  { weight: 2, enemyLife: [10, 1, 1, 1, 1, 1, 1, 12], name: 'ソードマスターヤマト' }
 ],
 p = [10, 50, 100, 500, 1e3, 5e3, 1e4],
 R = [
  [c, '🌟MAX WIN🌟 上限の'],
  [1e4, '👑JACKPOT👑'],
  [5e3, '💎EPIC WIN💎'],
  [2500, '♕FEVER♕'],
  [1e3, '🎯大当り🎯'],
  [500, '✌あたり✌']
 ],
 L = new (class {
  settings = { isParty: 'ON' };
  LogRank = w;
  setup(e) {
   (this.settings = e), this.LogRank.setup({ rankMode: 'point' });
  }
  run(e, a) {
   const n = (e == null ? void 0 : e.data.displayName) ?? 'Unknown',
    t = this.playGame(),
    s = this.createMessage(n, t),
    i = this.LogRank.run(e, { enableCount: a.enableCount, isWin: !1, getPoint: t.payout });
   return {
    postActions: [],
    placeholders: { message: s, stage: t.stage, payout: String(t.payout), winsRank: i.placeholders.winsRank },
    rankingList: i.rankingList
   };
  }
  playGameForTest() {
   return this.playGame();
  }
  playGame() {
   const e = this.selectEnemyPattern(),
    { stage: a, payout: n, ways: t } = this.executeAdventure(e);
   return { stage: String(a), name: e.name, ways: t, payout: n };
  }
  selectEnemyPattern() {
   const e = g.reduce((t, s) => t + s.weight, 0),
    a = Math.random() * e;
   let n = 0;
   for (const t of g) if (((n += t.weight), a <= n)) return t;
   return g[0];
  }
  executeAdventure(e) {
   let a = 4,
    n = 0,
    t = 1,
    s = 0;
   const i = [],
    o = this.getRandomReward(1, 10);
   (n += o), i.push(o);
   for (const d of e.enemyLife) {
    if (a <= 0) break;
    const r = this.executeBattle(a, d);
    if (((a = r.playerLife), a <= 0)) break;
    if (r.enemyLife <= 0) {
     if ((s++, s >= e.enemyLife.length)) {
      (n = c), i.push(c);
      break;
     }
     const u = this.calculateStageReward(s, r.enemyLife, t);
     (n += u), i.push(u), (t = n);
    }
   }
   return { stage: s, payout: n, ways: i };
  }
  executeBattle(e, a) {
   let n = e,
    t = a;
   for (; n > 0 && t > 0; ) {
    for (let s = 0; s < 3; s++) {
     const i = this.determineAttackType(),
      o = f[i];
     if (((t -= o.damage), (n += o.heal), t <= 0)) break;
    }
    n--;
   }
   return { playerLife: n, enemyLife: t };
  }
  determineAttackType() {
   const e = Math.random() * y;
   return e < h ? 'CRITICAL' : e < h + k ? 'NORMAL' : 'MISS';
  }
  calculateStageReward(e, a, n) {
   const t = p[Math.min(e - 1, p.length - 1)];
   if (a < 0) {
    const s = 2 ** Math.abs(a),
     i = Math.min(t, n * s);
    return this.getRandomReward(n, i);
   }
   return this.getRandomReward(n, t);
  }
  getRandomReward(e, a) {
   return Math.floor(Math.random() * (a - e + 1)) + e;
  }
  createMessage(e, a) {
   const n = this.getWinMessage(a.payout);
   return `${e}のダンジョン攻略! ${a.ways.join('/')}! ${n}合計${a.payout}枚獲得!`;
  }
  getWinMessage(e) {
   const a = R.find(([n]) => e >= n);
   return a ? a[1] : '';
  }
 })(),
 l = {
  name: 'steal-em-all',
  version: '0.0.1',
  description: 'Bonanza Megaways/Wing FURAIJIN風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スロット']
 },
 S = {
  id: l.name,
  name: l.name,
  description: l.description,
  version: l.version,
  author: l.author,
  tags: l.keywords,
  url: '',
  execute: L,
  settings: [
   {
    id: 'isParty',
    name: 'WordPartyで音を鳴らすか',
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  params: [
   {
    id: 'enableCount',
    name: 'ランキング上限回数',
    description: 'この回数を超える場合、結果はランキングに入りません',
    inputType: 'number',
    defaultValue: 5,
    min: 0,
    max: 100
   }
  ],
  placeholders: [
   {
    id: 'message',
    name: '標準メッセージ',
    description: 'デフォルトの返答',
    value: 'userのダンジョン攻略!5/7/25/55/250!合計1000枚獲得!'
   },
   { id: 'stage', name: '倒した敵の数', description: '倒した敵の数です', value: '5' },
   { id: 'payout', name: '獲得したポイント', description: '獲得したポイントを返します', value: '0' },
   { id: 'winsRank', name: '順位', description: '今回の順位を返します', value: '1' }
  ]
 };
export { S as default };
