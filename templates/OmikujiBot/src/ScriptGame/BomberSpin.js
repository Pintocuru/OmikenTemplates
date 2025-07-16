import {
 ref as T,
 watch as N,
 onUnmounted as W,
 defineComponent as A,
 computed as M,
 createElementBlock as S,
 openBlock as R,
 Fragment as $,
 createCommentVNode as B,
 createElementVNode as g,
 unref as E,
 normalizeClass as x,
 toDisplayString as b,
 renderList as L
} from 'vue';
const O = ['announceMessage', 'totalDraws', 'winsRank', 'totalPoints'],
 j = [
  {
   id: 'message',
   name: '標準メッセージ',
   description: 'デフォルトの返答',
   value: 'userのセブンスピン!1/4/8000!合計$8004枚獲得!'
  },
  { id: 'symbol', name: 'シンボル', description: '当選した図柄を返します', value: 'セブン' },
  {
   id: 'payout',
   name: '獲得したポイント',
   description: '獲得したポイントを返します',
   value: '8004'
  },
  ...[
   {
    id: 'announceMessage',
    name: 'アナウンス',
    description: 'ランキングの順位を表示します',
    value: 'userさんの順位は、4位だよ。'
   },
   {
    id: 'totalDraws',
    name: 'このおみくじをした回数',
    description: 'この配信でのおみくじした回数を返します',
    value: '10'
   },
   {
    id: 'winsCount',
    name: '勝利数(勝ち負けがある場合)',
    description: 'コメントしたユーザーの、配信枠内での勝数を返します',
    value: '2'
   },
   {
    id: 'winsRank',
    name: 'ユーザーの順位',
    description: 'パラメータのランキングモードを参照し、配信枠内での順位を数値で返します',
    value: '4'
   },
   {
    id: 'winsRate',
    name: 'ユーザーの勝率(%)',
    description: 'コメントしたユーザーの、配信枠内での勝率を返します',
    value: '20.0'
   },
   {
    id: 'totalPoints',
    name: 'ユーザーの総得点',
    description: 'コメントしたユーザーの、配信枠内での総得点を返します',
    value: '100'
   }
  ].filter((e) => O.includes(e.id))
 ];
function I(e) {
 return { ruleId: e, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
const V = new (class {
  settings = { rankMode: 'wins' };
  gameState = I('LogRank');
  setup(e) {
   (this.settings = e), this.gameState.userRecords || (this.gameState.userRecords = {});
  }
  run(e, n) {
   try {
    const s = e.data.userId,
     t = this.updateUserStats(s, e.data.name, n),
     a = this.generateRankings(t, n, s),
     i = t[s];
    return (
     (n.enableCount > 0 && ((i == null ? void 0 : i.draws) || 0) > n.enableCount) ||
      (this.gameState = { ...this.gameState, userStats: t, userRankings: a }),
     { placeholders: this.createPlaceholders(t[s], a, s, n), postActions: [] }
    );
   } catch (s) {
    throw (
     (console.error('Game execution error:', s), new Error('ゲーム実行中にエラーが発生しました'))
    );
   }
  }
  getGameState() {
   return this.gameState;
  }
  updateUserStats(e, n, s) {
   const { isWin: t, getPoint: a } = s,
    { rankMode: i } = this.settings;
   if (i === 'point') {
    this.gameState.userRecords || (this.gameState.userRecords = {}),
     this.gameState.userRecords[e] || (this.gameState.userRecords[e] = []);
    const r = {
     userId: e,
     name: n,
     draws: 1,
     wins: t ? 1 : 0,
     points: a,
     totalPoints: a,
     rank: 0,
     rate: 0
    };
    this.gameState.userRecords[e].push(r);
    const c = {
     userId: e,
     name: n,
     draws: this.gameState.userRecords[e].length,
     wins: t ? 1 : 0,
     points: a,
     totalPoints: this.gameState.userRecords[e].reduce((o, l) => o + (l.points ?? 0), 0),
     rank: 0,
     rate: 0
    };
    return { ...this.gameState.userStats, [e]: c };
   }
   {
    const r = {
     ...(this.gameState.userStats[e] ?? {
      userId: e,
      name: n,
      draws: 0,
      wins: 0,
      points: 0,
      totalPoints: 0,
      rank: 0,
      rate: 0
     })
    };
    return (
     a > 0 && ((r.points = (r.points || 0) + a), (r.totalPoints = (r.totalPoints || 0) + a)),
     t && (r.wins = (r.wins || 0) + 1),
     (r.draws = (r.draws || 0) + 1),
     { ...this.gameState.userStats, [e]: r }
    );
   }
  }
  generateRankings(e, n, s) {
   var t;
   const { rankMode: a } = this.settings;
   if (a === 'point') {
    const l = [];
    this.gameState.userRecords &&
     Object.values(this.gameState.userRecords).forEach((m) => {
      l.push(...m);
     });
    const u = l
      .sort((m, h) => (h.points ?? 0) - (m.points ?? 0))
      .map((m, h) => ({ ...m, rank: h + 1 })),
     d = ((t = this.gameState.userRecords) == null ? void 0 : t[s]) || [];
    if (d.length > 0) {
     const m = d[d.length - 1],
      h = u.findIndex((p) => p.userId === s && p.points === m.points);
     if (h !== -1) {
      const [p] = u.splice(h, 1);
      u.unshift(p);
     }
    }
    return u;
   }
   const i = this.createRankingEntries(e),
    r = a === 'rate' ? 'rate' : 'wins',
    c = i.sort((l, u) => (u[r] ?? 0) - (l[r] ?? 0)).map((l, u) => ({ ...l, rank: u + 1 })),
    o = c.findIndex((l) => l.userId === s);
   if (o > 0) {
    const [l] = c.splice(o, 1);
    c.unshift(l);
   }
   return c;
  }
  createRankingEntries(e) {
   const n = this.gameState.userRankings || [];
   return Object.entries(e).map(([s, t]) => {
    const a = n.find((l) => l.userId === s),
     i = t.draws ?? (a == null ? void 0 : a.draws) ?? 0,
     r = t.wins ?? (a == null ? void 0 : a.wins) ?? 0,
     c = t.points ?? (a == null ? void 0 : a.points) ?? 0,
     o = t.totalPoints ?? (a == null ? void 0 : a.totalPoints) ?? 0;
    return {
     userId: s,
     name: t.name || 'Unknown',
     draws: i,
     wins: r,
     points: c,
     totalPoints: o,
     rank: t.rank ?? (a == null ? void 0 : a.rank) ?? 0,
     rate: i > 0 ? (r / i) * 100 : 0
    };
   });
  }
  createPlaceholders(e, n, s, t) {
   var a;
   const { rankMode: i } = this.settings,
    r = e.draws ?? 0,
    c = t.enableCount > 0 && r > t.enableCount;
   if (i === 'point') {
    const u = ((a = this.gameState.userRecords) == null ? void 0 : a[s]) || [],
     d = u[u.length - 1];
    if (d) {
     const m = this.calculateRank(d, n, s);
     return {
      announceMessage: c
       ? `${d.name}さんは上限を超えているから、参考記録だよ。`
       : `${d.name}さんの${d.points}は、${m}位だよ。`,
      winsCount: String(d.wins ?? 0),
      winsRank: m,
      winsRate: '0.0',
      totalDraws: String(u.length),
      totalPoints: String(e.totalPoints ?? 0)
     };
    }
   }
   const o = this.calculateRank(e, n, s),
    l = r > 0 ? (((e.wins || 0) / r) * 100).toFixed(1) : '0.0';
   return {
    announceMessage: c
     ? `${e.name}さんは上限を超えているから、参考記録だよ。`
     : `${e.name}さんの順位は、${o}位だよ。`,
    winsCount: String(e.wins ?? 0),
    winsRank: o,
    winsRate: l,
    totalDraws: String(r),
    totalPoints: String(e.totalPoints ?? 0)
   };
  }
  calculateRank(e, n, s) {
   if (this.settings.rankMode === 'point') {
    const a = e.points ?? 0,
     i = n.filter((r) => (r.points ?? 0) > a).length;
    return String(i + 1);
   }
   const t = n.findIndex((a) => a.userId === s);
   return t >= 0 ? String(t + 1) : '不明';
  }
 })(),
 y = {
  symbols: [
   { name: 'チェリー', party: '!bombCherry', payouts: [0, 0, 1, 2, 10, 40, 200, 1e3] },
   { name: 'オレンジ', party: '!bombOrange', payouts: [0, 0, 1, 2, 15, 60, 300, 1500] },
   { name: 'プラム', party: '!bombPlum', payouts: [0, 0, 1, 4, 20, 80, 400, 2e3] },
   { name: 'スイカ', party: '!bombMelon', payouts: [0, 0, 2, 6, 30, 120, 600, 3e3] },
   { name: 'ベル', party: '!bombBell', payouts: [0, 1, 2, 8, 40, 160, 800, 4e3] },
   { name: 'ハット', party: '!bombHat', payouts: [0, 1, 2, 10, 50, 200, 1e3, 5e3] },
   { name: 'BAR', party: '!bombBAR', payouts: [0, 1, 3, 15, 60, 240, 1200, 6e3] },
   { name: 'セブン', party: '!bombSeven', payouts: [0, 1, 4, 30, 80, 320, 2e3, 8e3] }
  ],
  winMessages: [
   [1e4, '👑JACKPOT👑'],
   [5e3, '💎EPIC WIN💎'],
   [2500, '♕FEVER♕'],
   [1e3, '🎯大当り🎯'],
   [500, '✌あたり✌']
  ],
  spinWeights: [12, 11, 10, 9, 8, 7, 6, 5],
  symbolWeights: [14, 13, 12, 11, 10, 9, 8, 7],
  wildChance: 1 / 16,
  minPayout: 10
 },
 D = new (class {
  settings = { rankingLimit: 10, isParty: !0, enableCount: 5 };
  gameState = I('BomberSpin');
  LogRank = V;
  setup(e) {
   (this.settings = { ...this.settings, ...e }), this.LogRank.setup({ rankMode: 'point' });
  }
  run(e, n) {
   const { isParty: s, enableCount: t } = this.settings,
    a = (e == null ? void 0 : e.data.displayName) ?? 'Unknown',
    i = this.playSlot(a),
    r = this.LogRank.run(e, { enableCount: t, isWin: !1, getPoint: i.payout });
   return (
    (this.gameState = this.LogRank.getGameState()),
    {
     postActions: s
      ? [
         { delaySeconds: 0, wordParty: '!bombBack' },
         { delaySeconds: 0, wordParty: i.party },
         { delaySeconds: 1.8, wordParty: '!bombFire' }
        ]
      : [],
     placeholders: {
      ...r.placeholders,
      message: i.message,
      symbol: i.symbol,
      payout: String(i.payout)
     }
    }
   );
  }
  getGameState() {
   return this.gameState;
  }
  playSlot(e) {
   const n = this.randomSpins(),
    s = this.randomSymbol();
   let t = 7 - Math.floor(3 * Math.random()),
    a = this.calculatePayout(s.payouts, t);
   const i = [a];
   for (let r = n; r > 0; r--) {
    const c = this.getHitRate(s, r);
    t -= this.countHits(t, c);
    const o = this.calculatePayout(s.payouts, t);
    i.push(o), (a += o);
   }
   return {
    symbol: s.name,
    party: s.party,
    payout: a,
    message: this.createMessage(e, s.name, i, a)
   };
  }
  randomSpins() {
   const e = this.weightedSelect(y.spinWeights) + 1;
   return Math.max(2, Math.min(7, e - Math.floor(4 * Math.random())));
  }
  randomSymbol() {
   const e = this.weightedSelect(y.symbolWeights);
   return y.symbols[e];
  }
  calculatePayout(e, n) {
   const s = this.countWilds(7 - n),
    t = e[Math.min(7, 7 - n + s)];
   return t < y.minPayout ? t + 1 : t;
  }
  getHitRate(e, n) {
   return (20 - 2 * y.symbols.indexOf(e) + 20 / n) / 100;
  }
  countHits(e, n) {
   return Array(e)
    .fill(0)
    .reduce((s) => s + (Math.random() < n ? 1 : 0), 0);
  }
  countWilds(e) {
   return Array(e)
    .fill(0)
    .reduce((n) => n + (Math.random() < y.wildChance ? 1 : 0), 0);
  }
  createMessage(e, n, s, t) {
   var a;
   return `${e}の${n}スピン!${s.map((i, r) => (r === s.length - 1 ? `${i}!` : `${i}/`)).join('')}${((a = y.winMessages.find(([i]) => t >= i)) == null ? void 0 : a[1]) || ''}合計${t}枚獲得!`;
  }
  weightedSelect(e) {
   const n = e.reduce((t, a) => t + a, 0);
   let s = Math.random() * n;
   return e.findIndex((t) => (s -= t) <= 0);
  }
 })(),
 w = {
  name: 'bomber-spin',
  version: '0.0.3',
  displayName: 'ボンバースピン',
  description: 'APPLI BOMBERSPIN2風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スロット']
 },
 F = {
  xs: {
   explosionText: 'text-[8rem]',
   text: { large: 'text-base', xlarge: 'text-2xl', medium: 'text-sm', small: 'text-[8px]' },
   rankingNumber: 'w-4 h-3 leading-3 text-[10px]'
  },
  sm: {
   explosionText: 'text-[10rem]',
   text: { large: 'text-lg', xlarge: 'text-3xl', medium: 'text-base', small: 'text-[10px]' },
   rankingNumber: 'w-5 h-3.5 leading-3.5 text-xs'
  },
  md: {
   explosionText: 'text-[12rem]',
   text: { large: 'text-xl', xlarge: 'text-4xl', medium: 'text-lg', small: 'text-xs' },
   rankingNumber: 'w-6 h-4 leading-4 text-sm'
  },
  lg: {
   explosionText: 'text-[14rem]',
   text: { large: 'text-2xl', xlarge: 'text-5xl', medium: 'text-xl', small: 'text-sm' },
   rankingNumber: 'w-8 h-6 leading-6 text-md'
  },
  xl: {
   explosionText: 'text-[16rem]',
   text: { large: 'text-3xl', xlarge: 'text-6xl', medium: 'text-2xl', small: 'text-base' },
   rankingNumber: 'w-10 h-8 leading-8 text-md'
  }
 },
 H = {
  key: 0,
  class: 'relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8'
 },
 U = { class: 'absolute inset-0 flex flex-col items-center justify-center text-center z-10' },
 _ = {
  class:
   'bg-stone-800 bg-opacity-90 border-4 border-red-600 rounded-xl font-rocknroll backdrop-blur-sm p-1'
 },
 z = { class: 'overflow-hidden max-h-fit' },
 G = { class: 'list-none p-0 m-0 space-y-1' },
 J = { class: 'flex justify-center items-center flex-1' },
 q = {
  id: w.name,
  name: w.displayName,
  description: w.description,
  version: w.version,
  author: w.author,
  tags: w.keywords,
  url: '',
  execute: D,
  settings: [
   {
    id: 'isParty',
    name: 'WordPartyで音を鳴らすか',
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない',
    inputType: 'boolean',
    defaultValue: !0
   },
   {
    id: 'rankingLimit',
    name: '上位何位まで表示させるか',
    description: '大きくしすぎるとはみ出ます。',
    inputType: 'number',
    defaultValue: 10
   },
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
  params: [],
  placeholders: j,
  component: ((e, n) => {
   const s = e.__vccOpts || e;
   for (const [t, a] of n) s[t] = a;
   return s;
  })(
   A({
    __name: 'component',
    props: { settings: {}, userRankings: {}, displaySize: {} },
    setup(e) {
     const n = e,
      s = (function (o, l) {
       const { delayMs: u, displayMs: d, immediate: m = !1, deep: h = !0 } = l,
        p = T(!1);
       let f = null,
        v = null;
       const k = () => {
         f && (clearTimeout(f), (f = null)), v && (clearTimeout(v), (v = null));
        },
        C = () => {
         k(),
          (p.value = !1),
          (f = setTimeout(() => {
           (p.value = !0),
            (v = setTimeout(() => {
             p.value = !1;
            }, d));
          }, u));
        };
       return (
        N(
         o,
         (P) => {
          (Array.isArray(P) ? P.length > 0 : P) && C();
         },
         { immediate: m, deep: h }
        ),
        W(() => {
         k();
        }),
        {
         isVisible: p,
         manualStart: () => {
          C();
         },
         manualHide: () => {
          k(), (p.value = !1);
         },
         clearTimers: k
        }
       );
      })(() => n.userRankings, { delayMs: 3500, displayMs: 5e3 }),
      t = M(() => F[n.displaySize]),
      a = M(() => {
       const o = n.userRankings[0] || null,
        l = n.userRankings
         .slice(1)
         .sort(
          (d, m) => ((m == null ? void 0 : m.points) ?? 0) - ((d == null ? void 0 : d.points) ?? 0)
         ),
        u = o ? [o, ...l] : l;
       return {
        showResult: !!o,
        result: {
         score: (o == null ? void 0 : o.points) || 0,
         name: (o == null ? void 0 : o.name) || 'プレイヤー'
        },
        rankPlayers: u.slice(0, n.settings.rankingLimit),
        totalCount: n.userRankings.length,
        totalPoint: n.userRankings.reduce((d, m) => d + ((m == null ? void 0 : m.points) ?? 0), 0)
       };
      }),
      i = M(() => {
       const o = a.value;
       return o.totalCount > 0 ? Math.round(o.totalPoint / o.totalCount) : 0;
      }),
      r = (o) => {
       const l = `inline-block font-bold text-center rounded-full border mr-1 ${t.value.rankingNumber}`;
       switch (o) {
        case 0:
         return `${l}  bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300`;
        case 1:
         return `${l}  bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400`;
        case 2:
         return `${l}  bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400`;
        default:
         return `${l}  bg-stone-800 text-amber-300 border-amber-300`;
       }
      },
      c = (o) => {
       const l = 'flex items-center font-bold rounded-lg shadow-sm  p-1';
       return o % 2 == 0
        ? `${l} text-amber-300 bg-red-800 bg-opacity-70 border-amber-300`
        : `${l} text-amber-300 bg-stone-800 bg-opacity-70 border-orange-400`;
      };
     return (o, l) => (
      R(),
      S(
       $,
       null,
       [
        E(s).isVisible.value
         ? (R(),
           S('div', H, [
            g(
             'div',
             {
              class: x([
               'absolute inset-0 explosion-container flex items-center justify-center',
               t.value.explosionText
              ])
             },
             ' 💥 ',
             2
            ),
            g('div', U, [
             g(
              'div',
              {
               class: x([
                'font-bold text-yellow-400 font-rocknroll drop-shadow-lg',
                t.value.text.large
               ])
              },
              'スコア',
              2
             ),
             g(
              'div',
              {
               class: x([
                'font-bold font-rocknroll text-yellow-400 drop-shadow-2xl',
                t.value.text.xlarge
               ])
              },
              b(a.value.result.score),
              3
             ),
             g(
              'div',
              {
               class: x([
                'mt-2 font-bold text-yellow-400 font-rocknroll drop-shadow-lg',
                t.value.text.large
               ])
              },
              b(a.value.result.name),
              3
             )
            ])
           ]))
         : B('', !0),
        g('div', _, [
         g(
          'div',
          {
           class: x([
            'text-center mb-2 text-amber-300 font-bold drop-shadow-lg',
            t.value.text.large
           ])
          },
          ' 💣 Bomber Slot Rankings 💥 ',
          2
         ),
         g('div', z, [
          g('ul', G, [
           (R(!0),
           S(
            $,
            null,
            L(
             a.value.rankPlayers,
             (u, d) => (
              R(),
              S(
               'li',
               { key: d, class: x(c(d)) },
               [
                g('span', { class: x(r((u.rank ?? 0) - 1)) }, b(u.rank ?? 1), 3),
                g('span', J, [
                 g(
                  'span',
                  { class: x(['font-bold mr-2 text-white', t.value.text.medium]) },
                  b(u.points),
                  3
                 ),
                 g(
                  'span',
                  { class: x(['text-amber-300', t.value.text.medium]) },
                  ' (' + b(u.name) + ') ',
                  3
                 )
                ])
               ],
               2
              )
             )
            ),
            128
           ))
          ])
         ]),
         g(
          'div',
          {
           class: x([
            'p-0 m-0 flex justify-center items-center w-full text-amber-300 mt-2',
            t.value.text.small
           ])
          },
          ' 平均: ' +
           b(i.value) +
           'pt (' +
           b(a.value.totalCount) +
           '回 / 総計' +
           b(a.value.totalPoint) +
           'pt) ',
          3
         )
        ])
       ],
       64
      )
     );
    }
   }),
   [['__scopeId', 'data-v-2280487a']]
  )
 };
export { q as default };
