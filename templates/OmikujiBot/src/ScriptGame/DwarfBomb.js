var c = ((e) => (
 (e[(e.UNKO = 0)] = 'UNKO'),
 (e[(e.MEDIUM_GOLD = 1)] = 'MEDIUM_GOLD'),
 (e[(e.LARGE_GOLD = 2)] = 'LARGE_GOLD'),
 (e[(e.GOLD_MULTIPLIER = 3)] = 'GOLD_MULTIPLIER'),
 (e[(e.DIAMOND_MULTIPLIER = 4)] = 'DIAMOND_MULTIPLIER'),
 (e[(e.GREEN_CHEST = 5)] = 'GREEN_CHEST'),
 (e[(e.RED_CHEST = 6)] = 'RED_CHEST'),
 (e[(e.DYNAMITE = 7)] = 'DYNAMITE'),
 e
))(c || {});
function R(e, t) {
 return { ruleId: e, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
class m {
 static DEFAULT_USER_NAME = 'Unknown';
 static WIN_RATE_MULTIPLIER = 100;
 settings = { rankMode: 'wins' };
 gameState = R('WinChan');
 setup(t) {
  (this.settings = t), (this.gameState = R('WinChan'));
 }
 run(t, n) {
  const a = this.gameState,
   s = t == null ? void 0 : t.data.userId;
  if (!s) throw new Error('User ID is required');
  try {
   const i = this.updateUserStats(a.userStats, t, n, s),
    r = this.generateRankings(a, i, n, s),
    d = this.calculatePlaceholders(i[s], r, s);
   return (
    (this.gameState = { ...a, rankings: r, userStats: i }), { placeholders: d, postActions: [] }
   );
  } catch (i) {
   throw (
    (console.error('Game execution error:', i), new Error('ゲーム実行中にエラーが発生しました'))
   );
  }
 }
 updateUserStats(t, n, a, s) {
  const i = { ...(t[s] ?? { userId: s, name: n.data.name, draws: 0 }) },
   { isWin: r, getPoint: d } = a,
   { rankMode: u } = this.settings;
  return (
   r && (i.wins = u === 'point' ? 1 : (i.wins || 0) + 1),
   d > 0 && (i.points = u === 'point' ? d : (i.points || 0) + d),
   u !== 'point' && (i.draws = (i.draws || 0) + 1),
   { ...t, [s]: i }
  );
 }
 generateRankings(t, n, a, s) {
  if (!a.isRank) return t.rankings || [];
  switch (this.settings.rankMode) {
   case 'point':
    return this.generatePointRankings(n, s);
   case 'wins':
   case 'rate':
   case 'totalPoints':
    return this.generateTotalRankings(t, n, s);
   default:
    return (
     console.warn(`Unknown rank mode: ${this.settings.rankMode}. Using total rankings.`),
     this.generateTotalRankings(t, n, s)
    );
  }
 }
 generatePointRankings(t, n) {
  const a = t[n];
  return a
   ? [{ userId: n, name: a.name || m.DEFAULT_USER_NAME, points: a.points || 0, rank: 1 }]
   : (console.warn(`User stats not found for userId: ${n}`), []);
 }
 generateTotalRankings(t, n, a) {
  const s = t.rankings || [],
   i = Object.entries(n).map(([u, l]) => {
    const o = s.find((I) => I.userId === u),
     p = l.draws ?? (o == null ? void 0 : o.draws) ?? 0,
     E = l.wins ?? (o == null ? void 0 : o.wins) ?? 0,
     w = l.points ?? (o == null ? void 0 : o.points) ?? 0;
    return {
     userId: u,
     name: l.name || m.DEFAULT_USER_NAME,
     draws: p,
     wins: E,
     points: w,
     rate: p > 0 ? (E / p) * m.WIN_RATE_MULTIPLIER : 0
    };
   }),
   r = this.getSortKey(),
   d = i
    .sort((u, l) => {
     const o = u[r] ?? 0;
     return (l[r] ?? 0) - o;
    })
    .map((u, l) => ({ ...u, rank: l + 1 }));
  return this.prioritizeCurrentUser(d, a);
 }
 getSortKey() {
  return (
   { wins: 'wins', rate: 'rate', point: 'points', totalPoints: 'points' }[this.settings.rankMode] ||
   'wins'
  );
 }
 prioritizeCurrentUser(t, n) {
  const a = t.findIndex((r) => r.userId === n);
  if (a === -1) return t;
  const s = [...t],
   [i] = s.splice(a, 1);
  return s.unshift(i), s;
 }
 calculatePlaceholders(t, n, a) {
  const s = String(t.wins ?? 0);
  let i;
  if (this.settings.rankMode === 'point') {
   const r = t.points ?? 0,
    d = n.filter((u) => (u.points ?? 0) > r).length;
   i = String(d + 1);
  } else {
   const r = n.findIndex((d) => d.userId === a);
   i = r >= 0 ? String(r + 1) : '不明';
  }
  return {
   winsCount: s,
   winsRank: i,
   winsRate: (t.draws > 0 ? ((t.wins ?? 0) / t.draws) * m.WIN_RATE_MULTIPLIER : 0).toFixed(1)
  };
 }
}
const M = new m(),
 h = {
  MAX_WIN: 5e4,
  INITIAL_LIFE: 11,
  GREEN_RECOVERY: 15,
  DWARF_COUNT: 3,
  WIN_THRESHOLDS: [
   [5e4, '🌟MAX WIN🌟 上限の'],
   [1e4, '👑JACKPOT👑'],
   [5e3, '💎EPIC WIN💎'],
   [2500, '♕FEVER♕'],
   [1e3, '🎯大当り🎯'],
   [500, '✌あたり✌']
  ],
  REWARD_ITEMS: [
   { name: 'UNKO', weight: 7, description: 'うんこ（1枚）' },
   { name: 'mediumGold', weight: 3, description: '金塊（10-25枚）' },
   { name: 'largeGold', weight: 2, description: '大きな金塊（50-100枚）' },
   { name: 'goldMultiplier', weight: 2, emoji: '💰', description: '金塊倍増（2-5倍）' },
   { name: 'diamondMultiplier', weight: 1, emoji: '💎', description: '金塊倍増（10-25倍）' },
   { name: 'greenChest', weight: 2, emoji: '🎁', description: '緑宝箱（他のうさぎの金を統合）' },
   { name: 'redChest', weight: 1, description: '赤宝箱（毎ターン金を貯蓄）' },
   { name: 'dynamite', weight: 1, description: 'ダイナマイト（他のうさぎの金を毎ターン吸収）' }
  ],
  GOLD_REWARDS: {
   mediumGold: { amounts: [10, 15, 25], weights: [4, 3, 2] },
   largeGold: { amounts: [50, 100], weights: [2, 1] },
   goldMultiplier: { amounts: [2, 3, 4, 5], weights: [5, 4, 3, 2] },
   diamondMultiplier: { amounts: [10, 25], weights: [5, 2] }
  }
 },
 D = new (class {
  settings = { isBomber: 'ON' };
  winChan = M;
  setup(e) {
   (this.settings = e), this.winChan.setup({ rankMode: 'point' });
  }
  run(e, t) {
   const n = (e == null ? void 0 : e.data.displayName) ?? 'Unknown',
    { day: a, payout: s, message: i } = this.playGame(n),
    r = this.winChan.run(e, { isWin: 'OFF', getPoint: s, isRank: t.isRank });
   return {
    postActions: (this.settings.isBomber, []),
    placeholders: {
     message: i,
     day: String(a),
     payout: String(s),
     winsRank: r.placeholders.winsRank
    }
   };
  }
  playGame(e) {
   const t = this.createDwarfs();
   let n = h.INITIAL_LIFE,
    a = '',
    s = 0;
   for (; this.getTotalGold(t) <= h.MAX_WIN && 10 * Math.random() < n; ) {
    s++, n--;
    const r = t[Math.floor(Math.random() * h.DWARF_COUNT)],
     d = this.selectReward();
    (a += this.applyReward(r, t, d, n)),
     d === c.GREEN_CHEST && (n = h.GREEN_RECOVERY),
     this.applySpecialEffects(t);
   }
   for (let r = 0; r < 2 && this.getTotalGold(t) <= h.MAX_WIN; r++) this.applySpecialEffects(t);
   const i = Math.min(this.getTotalGold(t), h.MAX_WIN);
   return { day: s, payout: i, message: this.createMessage(e, s, t, a, i) };
  }
  createDwarfs() {
   return Array(h.DWARF_COUNT)
    .fill(null)
    .map(() => ({ gold: 0, redChest: 0, hasRed: !1, hasDynamite: !1 }));
  }
  getTotalGold(e) {
   return e.reduce((t, n) => t + n.gold + n.redChest, 0);
  }
  selectReward() {
   const e = h.REWARD_ITEMS.reduce((a, s) => a + s.weight, 0),
    t = Math.random() * e;
   let n = 0;
   return h.REWARD_ITEMS.findIndex((a) => (n += a.weight) > t);
  }
  applyReward(e, t, n, a) {
   switch (n) {
    case c.UNKO:
     e.gold += 1;
     break;
    case c.MEDIUM_GOLD:
     e.gold += this.getGoldAmount('mediumGold');
     break;
    case c.LARGE_GOLD:
     e.gold += this.getGoldAmount('largeGold');
     break;
    case c.GOLD_MULTIPLIER:
     const s = this.getGoldAmount('goldMultiplier');
     return (e.gold = Math.max(1, e.gold * s)), e.gold > 1 ? '💰' : '';
    case c.DIAMOND_MULTIPLIER:
     const i = this.getGoldAmount('diamondMultiplier');
     return (e.gold = Math.max(1, e.gold * i)), e.gold > 1 ? '💎' : '';
    case c.GREEN_CHEST:
     return (
      t.forEach((r) => {
       r !== e && ((e.gold += r.gold), (r.gold = 0));
      }),
      '🎁'
     );
    case c.RED_CHEST:
     e.hasRed ? (e.gold += 1) : (e.hasRed = !0);
     break;
    case c.DYNAMITE:
     e.hasDynamite ? (e.gold += 1) : (e.hasDynamite = !0);
   }
   return '';
  }
  getGoldAmount(e) {
   const t = h.GOLD_REWARDS[e],
    n = this.weightedSelect(t.weights);
   return t.amounts[n];
  }
  weightedSelect(e) {
   const t = e.reduce((s, i) => s + i, 0),
    n = Math.random() * t;
   let a = 0;
   return e.findIndex((s) => (a += s) > n);
  }
  applySpecialEffects(e) {
   e.forEach((t, n) => {
    t.hasRed && (t.redChest += t.gold),
     t.hasDynamite &&
      e.forEach((a, s) => {
       n !== s && (t.gold += a.gold);
      });
   });
  }
  createMessage(e, t, n, a, s) {
   var i;
   const r = n.some((o) => o.hasDynamite || o.hasRed),
    d = ((i = h.WIN_THRESHOLDS.find(([o]) => s >= o)) == null ? void 0 : i[1]) || '合計',
    u = n.map((o) => `${o.gold + o.redChest}枚!`).join('');
   let l = `${e}は🐰${t}匹`;
   return (
    r &&
     ((l += 'と'),
     n.some((o) => o.hasDynamite) && (l += '爆弾🧨'),
     n.some((o) => o.hasDynamite && o.hasRed) && (l += 'と'),
     n.some((o) => o.hasRed) && (l += 'ツルハシ⛏️')),
    (l += `と鉱山へ${a || '。'}${u}${d}${s}枚獲得!`),
    l
   );
  }
 })(),
 g = {
  name: 'dwarf-bomb',
  version: '0.0.1',
  description: 'Nolimit City - Fire in the Hole風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スロット']
 },
 T = {
  id: g.name,
  name: g.name,
  description: g.description,
  version: g.version,
  author: g.author,
  tags: g.keywords,
  url: '',
  banner: '',
  execute: D,
  settings: [
   {
    id: 'isBomber',
    name: 'WordPartyで音を鳴らすか',
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  params: [
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
    description: 'デフォルトの返答',
    value: 'userは🐰14匹とダイナマイト🧨と鉱山へ。1枚!5000枚!1枚!💎EPIC WIN💎5002枚獲得!'
   },
   { id: 'day', name: 'うさぎの数', description: '鉱山を掘ったうさぎの数を返します', value: '14' },
   {
    id: 'payout',
    name: '獲得したポイント',
    description: '獲得したポイントを返します',
    value: '5002'
   },
   { id: 'winsRank', name: '順位', description: '今回の順位を返します', value: '1' }
  ]
 };
export { T as default };
