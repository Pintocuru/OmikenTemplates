const A = (i, a, s) => {
 const { getPoint: t, historyDays: e } = s,
  n = (function (f, I, k) {
   const h = { ...f },
    { rankMode: w, isWin: u } = I,
    R = (m, l, o) => {
     const c = l === 'wins' ? 'totalWins' : 'totalPoints';
     (m[l] = w === 2 ? o : (m[l] || 0) + o), (m[c] = (m[c] || 0) + o);
    };
   return u && R(h, 'wins', 1), k > 0 && R(h, 'points', k), h;
  })(i.userStats[a], s, t),
  r = { ...i.userStats, [a]: n },
  p = new F(i, r, s, a),
  d = p.selectRankings(),
  v = p.updateHistory(d, e);
 return {
  placeholder: j(n, d, a, s),
  game: { ...i, rankings: d, rankingHistory: v, userStats: r }
 };
};
class F {
 constructor(a, s, t, e) {
  (this.game = a), (this.userStats = s), (this.params = t), (this.userId = e);
 }
 selectRankings() {
  return this.params.isRank
   ? this.params.rankMode === 2
     ? this.pointRankings()
     : this.totalRankings()
   : this.game.rankings;
 }
 updateHistory(a, s) {
  const { rankingHistory: t = [] } = this.game,
   e = /* @__PURE__ */ new Date().toISOString().split('T')[0];
  if (this.game.draws <= 1) {
   this.game.age = Number.isFinite(this.game.age) ? this.game.age + 1 : 1;
   const n = [];
   return (
    t.unshift({ date: e, age: this.game.age, rankings: n }), t.slice(0, Math.max(0, Math.floor(s)))
   );
  }
  return t[0] && (t[0].rankings = a.slice(0, 10)), t;
 }
 pointRankings() {
  const a = this.game.draws <= 1 ? [] : [...(this.game.rankings || [])],
   s = this.userStats[this.userId || ''],
   t = [
    ...a,
    {
     userId: this.userId || '',
     name: (s == null ? void 0 : s.name) || 'Unknown',
     points: (s == null ? void 0 : s.points) || 0
    }
   ]
    .sort((e, n) => (n.points ?? 0) - (e.points ?? 0))
    .map((e, n) => ({ ...e, rank: n + 1 }));
  return this.prioritizeCurrentUser(t, this.userId);
 }
 totalRankings() {
  const a = { 0: 'wins', 1: 'rate', 3: 'points' },
   s = this.game.draws <= 1 ? [] : [...(this.game.rankings || [])],
   t = Object.entries(this.userStats)
    .map(([e, n]) => {
     const r = s.find((p) => p.userId === e);
     return {
      userId: e,
      name: n.name,
      draws: n.draws ?? (r == null ? void 0 : r.draws) ?? 0,
      wins: n.wins ?? (r == null ? void 0 : r.wins) ?? 0,
      points: n.points ?? (r == null ? void 0 : r.points) ?? 0,
      rate: n.draws > 0 ? ((n.wins || 0) / n.draws) * 100 : 0
     };
    })
    .sort((e, n) => (n[a[this.params.rankMode]] ?? 0) - (e[a[this.params.rankMode]] ?? 0))
    .map((e, n) => ({ ...e, rank: n + 1 }));
  return this.prioritizeCurrentUser(t, this.userId);
 }
 prioritizeCurrentUser(a, s) {
  if (!s) return a;
  const t = a.findIndex((e) => e.userId === s);
  if (t > -1) {
   const [e] = a.splice(t, 1);
   a.unshift(e);
  }
  return a;
 }
}
function j(i, a, s, t) {
 const e = i.wins || 0;
 let n;
 if (t.rankMode === 2) {
  const r = i.points || 0;
  n = a.filter((p) => (p.points ?? 0) > r).length + 1;
 } else n = a.findIndex((r) => r.userId === s) + 1 || '不明';
 return { winsUser: e, winsRank: n, winsRate: i.draws > 0 ? (e / i.draws) * 100 : 0 };
}
const C = (i, a, s) => A(i, (a == null ? void 0 : a.data.userId) ?? '', s),
 O = {
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
 g = {
  name: 'gousei-suika',
  version: '0.0.3',
  description: '米兜科技 合成大西瓜風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スイカ']
 },
 U = {
  id: g.name,
  name: g.name,
  description: g.description,
  version: g.version,
  author: g.author,
  tags: g.keywords,
  url: '',
  banner: '',
  func: (i, a, s) => {
   const { mode: t = 0, isFruit: e = !0, isRank: n = !0 } = s;
   let r = 'suika';
   t === 1 && (r = 'kabo'), t === 2 && (r = 'kujira');
   const p = (a == null ? void 0 : a.data.displayName) ?? '',
    { points: d, postArray: v } = (function (k, h = 'suika') {
     let w = 0;
     const u = [
      { type: 'party', delaySeconds: 1, content: '🍒' },
      { type: 'party', delaySeconds: 8.5, content: '!パパッ' }
     ];
     k[h].small.forEach((o) => {
      const { pointsEarned: c, wins: P } = (function (y) {
       let M = 0,
        S = 0;
       for (let b = 0; b < (y.times ?? 0); b++)
        100 * Math.random() < y.chance && ((M += y.points), S++);
       return { pointsEarned: M, wins: S };
      })(o);
      w += c;
      const E = Math.floor(P / 2);
      for (let y = 0; y < E; y++) u.push({ type: 'party', delaySeconds: 1, content: o.party });
     });
     let m = 3;
     const l = k[h].big;
     for (; m > 0; ) {
      const o = l.find((c) => c.chance > 100 * Math.random());
      o &&
       ((w += o.points),
       (m -= o.damage ?? 0),
       u.push({ type: 'party', delaySeconds: 1, content: o.party })),
       l.forEach((c) => {
        c.damage &&
         3 - c.damage > 6 * Math.random() &&
         u.push({ type: 'party', delaySeconds: 1, content: c.party });
       });
     }
     return { points: Math.ceil(w * (0.7 + 0.6 * Math.random())), postArray: u };
    })(O, r),
    f = C(i, a, { getPoint: d, isRank: n, rankMode: 2, rankDays: 20, historyDays: 10 }),
    { winsRank: I } = f.placeholder;
   return {
    postArray: e ? v : [],
    placeholder: { message: `${p}の得点は${d}!`, points: d, winsRank: I },
    game: f.game
   };
  },
  ApiCall: async (i, a, s) => {
   try {
    const t = await fetch('/api/endpoint', {
     method: a,
     headers: { 'Content-Type': 'application/json' },
     body: a === 'GET' ? void 0 : JSON.stringify(s)
    });
    if (!t.ok) throw new Error(`API request failed with status ${t.status}`);
    return { status: 'success', game: i, message: 'API request successful', data: await t.json() };
   } catch (t) {
    return {
     status: 'error',
     game: i,
     message: t instanceof Error ? t.message : 'An unknown error occurred',
     data: null
    };
   }
  },
  scriptParams: [
   {
    id: 'mode',
    name: 'モード',
    description: '0:スイカゲーム/1:カボチャゲーム/2:クジラゲーム',
    type: 'number',
    value: 0
   },
   {
    id: 'isRank',
    name: '結果をランキングに入れるか',
    description: 'OFFなら、ランキングに影響を与えません',
    type: 'boolean',
    value: !0
   },
   {
    id: 'isFruit',
    name: 'フルーツをWordPartyで降らせるか',
    description: '1:降らせる/0:OFF 別途専用WordPartyが必要です',
    isEver: !0,
    type: 'boolean',
    value: !0
   }
  ],
  placeholders: [
   {
    id: 'message',
    name: '標準メッセージ',
    description: 'デフォルトのスイカジェネレーターの返答',
    value: 'userの得点は1500!'
   },
   {
    id: 'points',
    name: 'ポイント',
    description: 'スイカジェネレーターの得点を返します',
    value: '1500'
   },
   { id: 'winsRank', name: '順位', description: '今回の順位を返します', value: '3' }
  ]
 };
export { U as default };
