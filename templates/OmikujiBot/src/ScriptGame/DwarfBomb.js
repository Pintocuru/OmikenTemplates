import { ref as L, watch as $, onUnmounted as A, computed as N, defineComponent as O, createElementBlock as P, openBlock as C, Fragment as _, createCommentVNode as U, createElementVNode as w, unref as g, normalizeClass as y, toDisplayString as E, renderList as W } from "vue";
const B = ["announceMessage", "totalDraws", "winsRank", "totalPoints"], F = [{ id: "message", name: "標準メッセージ", description: "デフォルトの返答", value: "userは🐰14匹とダイナマイト🧨と鉱山へ。1枚!5000枚!1枚!💎EPIC WIN💎5002枚獲得!" }, { id: "day", name: "うさぎの数", description: "鉱山を掘ったうさぎの数を返します", value: "14" }, { id: "payout", name: "獲得したポイント", description: "獲得したポイントを返します", value: "5002" }, ...[{ id: "announceMessage", name: "アナウンス", description: "ランキングの順位を表示します", value: "userさんの順位は、4位だよ。" }, { id: "totalDraws", name: "このおみくじをした回数", description: "この配信でのおみくじした回数を返します", value: "10" }, { id: "winsCount", name: "勝利数(勝ち負けがある場合)", description: "コメントしたユーザーの、配信枠内での勝数を返します", value: "2" }, { id: "winsRank", name: "ユーザーの順位", description: "パラメータのランキングモードを参照し、配信枠内での順位を数値で返します", value: "4" }, { id: "winsRate", name: "ユーザーの勝率(%)", description: "コメントしたユーザーの、配信枠内での勝率を返します", value: "20.0" }, { id: "totalPoints", name: "ユーザーの総得点", description: "コメントしたユーザーの、配信枠内での総得点を返します", value: "100" }].filter((e) => B.includes(e.id))];
var S = ((e) => (e[e.UNKO = 0] = "UNKO", e[e.MEDIUM_GOLD = 1] = "MEDIUM_GOLD", e[e.LARGE_GOLD = 2] = "LARGE_GOLD", e[e.GOLD_MULTIPLIER = 3] = "GOLD_MULTIPLIER", e[e.DIAMOND_MULTIPLIER = 4] = "DIAMOND_MULTIPLIER", e[e.GREEN_CHEST = 5] = "GREEN_CHEST", e[e.RED_CHEST = 6] = "RED_CHEST", e[e.DYNAMITE = 7] = "DYNAMITE", e))(S || {});
const R = { MAX_WIN: 2e4, INITIAL_LIFE: 11, GREEN_RECOVERY: 12, DWARF_COUNT: 3, WIN_THRESHOLDS: [[2e4, "🌟MAX WIN🌟 上限の"], [1e4, "👑JACKPOT👑"], [5e3, "💎EPIC WIN💎"], [2500, "♕FEVER♕"], [1e3, "🎯大当り🎯"], [500, "✌あたり✌"]], REWARD_ITEMS: [{ name: "UNKO", weight: 7, description: "うんこ（1枚）" }, { name: "mediumGold", weight: 3, description: "金塊（10-25枚）" }, { name: "largeGold", weight: 2, description: "大きな金塊（50-100枚）" }, { name: "goldMultiplier", weight: 2, emoji: "💰", description: "金塊倍増（2-5倍）" }, { name: "diamondMultiplier", weight: 1, emoji: "💎", description: "金塊倍増（10-25倍）" }, { name: "greenChest", weight: 2, emoji: "🎁", description: "緑宝箱（他のうさぎの金を統合）" }, { name: "redChest", weight: 1, description: "赤宝箱（毎ターン金を貯蓄）" }, { name: "dynamite", weight: 1, description: "ダイナマイト（他のうさぎの金を毎ターン吸収）" }], GOLD_REWARDS: { mediumGold: { amounts: [10, 15, 25], weights: [4, 3, 2] }, largeGold: { amounts: [50, 100], weights: [2, 1] }, goldMultiplier: { amounts: [2, 3, 4, 5], weights: [5, 4, 3, 2] }, diamondMultiplier: { amounts: [10, 25], weights: [5, 2] } } };
class H {
  playGame(n) {
    const t = this.createDwarfs();
    let a = R.INITIAL_LIFE, s = "", o = 0;
    for (; this.getTotalGold(t) <= R.MAX_WIN && 10 * Math.random() < a; ) {
      o++, a--;
      const c = t[Math.floor(Math.random() * R.DWARF_COUNT)], h = this.selectReward();
      s += this.applyReward(c, t, h, a), h === S.GREEN_CHEST && (a = R.GREEN_RECOVERY), this.applySpecialEffects(t);
    }
    for (let c = 0; c < 2 && this.getTotalGold(t) <= R.MAX_WIN; c++) this.applySpecialEffects(t);
    const i = Math.min(this.getTotalGold(t), R.MAX_WIN);
    return { day: o, payout: i, message: this.createMessage(n, o, t, s, i), dwarfs: t, items: s };
  }
  generatePartyEffects(n) {
    const t = [], { dwarfs: a, items: s, day: o } = n;
    a.some((l) => l.hasDynamite) && t.push({ delaySeconds: 3, wordParty: "!dwarfBombDynamite" });
    const i = a.filter((l) => l.hasRed).length;
    for (let l = 0; l < i; l++) t.push({ delaySeconds: 3, wordParty: "!dwarfBombPickaxe" });
    const c = (s.match(/💰/g) || []).length, h = (s.match(/💎/g) || []).length, d = (s.match(/🎁/g) || []).length;
    for (let l = 0; l < c; l++) t.push({ delaySeconds: 3, wordParty: "!dwarfBombGold" });
    for (let l = 0; l < h; l++) t.push({ delaySeconds: 3, wordParty: "!dwarfBombDiamond" });
    for (let l = 0; l < d; l++) t.push({ delaySeconds: 3, wordParty: "!dwarfBombTreasure" });
    for (let l = 0; l < o; l++) t.push({ delaySeconds: 3, wordParty: "!dwarfBombDaysBunny" });
    return t;
  }
  createDwarfs() {
    return Array(R.DWARF_COUNT).fill(null).map(() => ({ gold: 0, redChest: 0, hasRed: !1, hasDynamite: !1 }));
  }
  getTotalGold(n) {
    return n.reduce((t, a) => t + a.gold + a.redChest, 0);
  }
  selectReward() {
    const n = R.REWARD_ITEMS.reduce((s, o) => s + o.weight, 0), t = Math.random() * n;
    let a = 0;
    return R.REWARD_ITEMS.findIndex((s) => (a += s.weight) > t);
  }
  applyReward(n, t, a, s) {
    switch (a) {
      case S.UNKO:
        n.gold += 1;
        break;
      case S.MEDIUM_GOLD:
        n.gold += this.getGoldAmount("mediumGold");
        break;
      case S.LARGE_GOLD:
        n.gold += this.getGoldAmount("largeGold");
        break;
      case S.GOLD_MULTIPLIER:
        const o = this.getGoldAmount("goldMultiplier");
        return n.gold = Math.max(1, n.gold * o), n.gold > 1 ? "💰" : "";
      case S.DIAMOND_MULTIPLIER:
        const i = this.getGoldAmount("diamondMultiplier");
        return n.gold = Math.max(1, n.gold * i), n.gold > 1 ? "💎" : "";
      case S.GREEN_CHEST:
        return t.forEach((c) => {
          c !== n && (n.gold += c.gold, c.gold = 0);
        }), "🎁";
      case S.RED_CHEST:
        n.hasRed ? n.gold += 1 : n.hasRed = !0;
        break;
      case S.DYNAMITE:
        n.hasDynamite ? n.gold += 1 : n.hasDynamite = !0;
    }
    return "";
  }
  getGoldAmount(n) {
    const t = R.GOLD_REWARDS[n], a = this.weightedSelect(t.weights);
    return t.amounts[a];
  }
  weightedSelect(n) {
    const t = n.reduce((o, i) => o + i, 0), a = Math.random() * t;
    let s = 0;
    return n.findIndex((o) => (s += o) > a);
  }
  applySpecialEffects(n) {
    n.forEach((t, a) => {
      t.hasRed && (t.redChest += t.gold), t.hasDynamite && n.forEach((s, o) => {
        a !== o && (t.gold += s.gold);
      });
    });
  }
  createMessage(n, t, a, s, o) {
    var i;
    const c = a.some((r) => r.hasDynamite || r.hasRed), h = ((i = R.WIN_THRESHOLDS.find(([r]) => o >= r)) == null ? void 0 : i[1]) || "合計", d = a.map((r, m) => m === 2 ? `${r.gold + r.redChest}!` : `${r.gold + r.redChest}/`).join("");
    let l = `${n}は🐰${t}匹`;
    return c && (l += "と", a.some((r) => r.hasDynamite) && (l += "TNT🧨"), a.some((r) => r.hasDynamite && r.hasRed) && (l += "と"), a.some((r) => r.hasRed) && (l += "ツルハシ⛏️")), l += `と鉱山へ${s || "。"}${d}${h}${o}枚獲得!`, l;
  }
}
function G(e) {
  return { ruleId: e, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
const j = new class {
  settings = { rankMode: "wins" };
  gameState = G("LogRank");
  setup(e) {
    this.settings = e, this.gameState.userRecords || (this.gameState.userRecords = {});
  }
  run(e, n) {
    try {
      const t = e.data.userId, a = this.updateUserStats(t, e.data.name, n), s = this.generateRankings(a, n, t), o = a[t];
      return n.enableCount > 0 && ((o == null ? void 0 : o.draws) || 0) > n.enableCount || (this.gameState = { ...this.gameState, userStats: a, userRankings: s }), { placeholders: this.createPlaceholders(a[t], s, t, n), postActions: [] };
    } catch (t) {
      throw console.error("Game execution error:", t), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  getGameState() {
    return this.gameState;
  }
  updateUserStats(e, n, t) {
    const { isWin: a, getPoint: s } = t, { rankMode: o } = this.settings;
    if (o === "point") {
      this.gameState.userRecords || (this.gameState.userRecords = {}), this.gameState.userRecords[e] || (this.gameState.userRecords[e] = []);
      const i = { userId: e, name: n, draws: 1, wins: a ? 1 : 0, points: s, totalPoints: s, rank: 0, rate: 0 };
      this.gameState.userRecords[e].push(i);
      const c = { userId: e, name: n, draws: this.gameState.userRecords[e].length, wins: a ? 1 : 0, points: s, totalPoints: this.gameState.userRecords[e].reduce((h, d) => h + (d.points ?? 0), 0), rank: 0, rate: 0 };
      return { ...this.gameState.userStats, [e]: c };
    }
    {
      const i = { ...this.gameState.userStats[e] ?? { userId: e, name: n, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } };
      return s > 0 && (i.points = (i.points || 0) + s, i.totalPoints = (i.totalPoints || 0) + s), a && (i.wins = (i.wins || 0) + 1), i.draws = (i.draws || 0) + 1, { ...this.gameState.userStats, [e]: i };
    }
  }
  generateRankings(e, n, t) {
    var a;
    const { rankMode: s } = this.settings;
    if (s === "point") {
      const d = [];
      this.gameState.userRecords && Object.values(this.gameState.userRecords).forEach((m) => {
        d.push(...m);
      });
      const l = d.sort((m, b) => (b.points ?? 0) - (m.points ?? 0)).map((m, b) => ({ ...m, rank: b + 1 })), r = ((a = this.gameState.userRecords) == null ? void 0 : a[t]) || [];
      if (r.length > 0) {
        const m = r[r.length - 1], b = l.findIndex((k) => k.userId === t && k.points === m.points);
        if (b !== -1) {
          const [k] = l.splice(b, 1);
          l.unshift(k);
        }
      }
      return l;
    }
    const o = this.createRankingEntries(e), i = s === "rate" ? "rate" : "wins", c = o.sort((d, l) => (l[i] ?? 0) - (d[i] ?? 0)).map((d, l) => ({ ...d, rank: l + 1 })), h = c.findIndex((d) => d.userId === t);
    if (h > 0) {
      const [d] = c.splice(h, 1);
      c.unshift(d);
    }
    return c;
  }
  createRankingEntries(e) {
    const n = this.gameState.userRankings || [];
    return Object.entries(e).map(([t, a]) => {
      const s = n.find((d) => d.userId === t), o = a.draws ?? (s == null ? void 0 : s.draws) ?? 0, i = a.wins ?? (s == null ? void 0 : s.wins) ?? 0, c = a.points ?? (s == null ? void 0 : s.points) ?? 0, h = a.totalPoints ?? (s == null ? void 0 : s.totalPoints) ?? 0;
      return { userId: t, name: a.name || "Unknown", draws: o, wins: i, points: c, totalPoints: h, rank: a.rank ?? (s == null ? void 0 : s.rank) ?? 0, rate: o > 0 ? i / o * 100 : 0 };
    });
  }
  createPlaceholders(e, n, t, a) {
    var s;
    const { rankMode: o } = this.settings, i = e.draws ?? 0, c = a.enableCount > 0 && i > a.enableCount;
    if (o === "point") {
      const l = ((s = this.gameState.userRecords) == null ? void 0 : s[t]) || [], r = l[l.length - 1];
      if (r) {
        const m = this.calculateRank(r, n, t);
        return { announceMessage: c ? `${r.name}さんは上限を超えているから、参考記録だよ。` : `${r.name}さんの${r.points}は、${m}位だよ。`, winsCount: String(r.wins ?? 0), winsRank: m, winsRate: "0.0", totalDraws: String(l.length), totalPoints: String(e.totalPoints ?? 0) };
      }
    }
    const h = this.calculateRank(e, n, t), d = i > 0 ? ((e.wins || 0) / i * 100).toFixed(1) : "0.0";
    return { announceMessage: c ? `${e.name}さんは上限を超えているから、参考記録だよ。` : `${e.name}さんの順位は、${h}位だよ。`, winsCount: String(e.wins ?? 0), winsRank: h, winsRate: d, totalDraws: String(i), totalPoints: String(e.totalPoints ?? 0) };
  }
  calculateRank(e, n, t) {
    if (this.settings.rankMode === "point") {
      const s = e.points ?? 0, o = n.filter((i) => (i.points ?? 0) > s).length;
      return String(o + 1);
    }
    const a = n.findIndex((s) => s.userId === t);
    return a >= 0 ? String(a + 1) : "不明";
  }
}(), V = new class {
  settings = { rankingLimit: 10, isParty: !0, enableCount: 5 };
  gameState = G("BomberSpin");
  LogRank = j;
  game = new H();
  setup(e) {
    this.settings = { ...this.settings, ...e }, this.LogRank.setup({ rankMode: "point" });
  }
  run(e, n) {
    const { isParty: t, enableCount: a } = this.settings, s = (e == null ? void 0 : e.data.displayName) ?? "Unknown", o = this.game.playGame(s), { day: i, payout: c, message: h } = o, d = this.LogRank.run(e, { enableCount: a, isWin: !1, getPoint: c });
    this.gameState = this.LogRank.getGameState();
    const l = this.game.generatePartyEffects(o);
    return { postActions: t ? [{ delaySeconds: 0, wordParty: "!dwarfBombRabbit" }, { delaySeconds: 3, wordParty: "!bombFire" }, ...l] : [], placeholders: { ...d.placeholders, message: h, day: i, payout: c } };
  }
  getGameState() {
    return this.gameState;
  }
}(), I = { name: "dwarf-bomb", version: "0.0.1", displayName: "うさぎスロット", description: "Nolimit City - Fire in the Hole風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スロット"] }, K = { xs: { explosionText: "text-[8rem]", text: { large: "text-base", xlarge: "text-2xl", medium: "text-sm", small: "text-[8px]" }, rankingNumber: "w-4 h-3 leading-3 text-[10px]" }, sm: { explosionText: "text-[10rem]", text: { large: "text-lg", xlarge: "text-3xl", medium: "text-base", small: "text-[10px]" }, rankingNumber: "w-5 h-3.5 leading-3.5 text-xs" }, md: { explosionText: "text-[12rem]", text: { large: "text-xl", xlarge: "text-4xl", medium: "text-lg", small: "text-xs" }, rankingNumber: "w-6 h-4 leading-4 text-sm" }, lg: { explosionText: "text-[14rem]", text: { large: "text-2xl", xlarge: "text-5xl", medium: "text-xl", small: "text-sm" }, rankingNumber: "w-8 h-6 leading-6 text-md" }, xl: { explosionText: "text-[16rem]", text: { large: "text-3xl", xlarge: "text-6xl", medium: "text-2xl", small: "text-base" }, rankingNumber: "w-10 h-8 leading-8 text-md" } }, X = "bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300", Y = "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400", z = "bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400", D = (e) => "points" in e ? e.points : "score" in e ? e.score : 0, q = { name: "cave-mining", googleFont: "RocknRoll+One", fontClass: "font-rocknroll", background: { container: "bg-stone-900 bg-opacity-95 border-4 border-amber-600 rounded-xl backdrop-blur-sm", border: "border-amber-600" }, text: { primary: "text-amber-300", secondary: "text-yellow-200", accent: "text-orange-400" }, ranking: { fourthPlus: "bg-stone-800 text-amber-300 border-amber-500", oddRow: "text-amber-300 bg-amber-900 bg-opacity-40 border-amber-500", evenRow: "text-yellow-200 bg-stone-800 bg-opacity-60 border-orange-400" }, specialBackgrounds: { first: "bg-gradient-to-r from-amber-200 to-yellow-400 text-stone-900", second: "bg-gradient-to-r from-gray-200 to-gray-400 text-stone-900", third: "bg-gradient-to-r from-orange-300 to-red-500 text-stone-900" } }, J = { key: 0, class: "relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8" }, Q = { class: "absolute inset-0 flex flex-col items-center justify-center text-center z-10" }, Z = { class: "overflow-hidden max-h-fit" }, ee = { class: "list-none p-0 m-0 space-y-1" }, te = { class: "flex justify-center items-center flex-1" }, ne = { id: I.name, name: I.displayName, description: I.description, version: I.version, author: I.author, tags: I.keywords, url: "", execute: V, settings: [{ id: "isParty", name: "WordPartyで音を鳴らすか", description: "ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない", inputType: "boolean", defaultValue: !0 }, { id: "rankingLimit", name: "上位何位まで表示させるか", description: "大きくしすぎるとはみ出ます。", inputType: "number", defaultValue: 10 }, { id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5, min: 0, max: 100 }], params: [], placeholders: F, component: ((e, n) => {
  const t = e.__vccOpts || e;
  for (const [a, s] of n) t[a] = s;
  return t;
})(O({ __name: "component", props: { settings: {}, userRankings: {}, displaySize: {} }, setup(e) {
  const n = e, t = function(d, l) {
    const { delayMs: r, displayMs: m, immediate: b = !1, deep: k = !0 } = l, u = L(!1);
    let p = null, x = null;
    const f = () => {
      p && (clearTimeout(p), p = null), x && (clearTimeout(x), x = null);
    }, M = () => {
      f(), u.value = !1, p = setTimeout(() => {
        u.value = !0, x = setTimeout(() => {
          u.value = !1;
        }, m);
      }, r);
    };
    return $(d, (v) => {
      (Array.isArray(v) ? v.length > 0 : v) && M();
    }, { immediate: b, deep: k }), A(() => {
      f();
    }), { isVisible: u, manualStart: () => {
      M();
    }, manualHide: () => {
      f(), u.value = !1;
    }, clearTimers: f };
  }(() => n.userRankings, { delayMs: 4500, displayMs: 5e3 }), a = N(() => K[n.displaySize]), s = N(() => n.userRankings.map((d) => ({ name: (d == null ? void 0 : d.name) || "プレイヤー", points: (d == null ? void 0 : d.points) ?? 0, rank: d == null ? void 0 : d.rank }))), { theme: o, gameStatistics: i, getRankingNumberClass: c, getRankingRowClass: h } = ((d, l) => {
    const { theme: r, rankingLimit: m, useSpecialBackgrounds: b = !1 } = l, k = N(() => {
      const u = d.value, p = u[0] || null, x = u.slice(1).sort((v, T) => D(T) - D(v)), f = p ? [p, ...x] : x, M = u.reduce((v, T) => v + D(T), 0);
      return { showResult: !!p, result: { score: p ? D(p) : 0, name: (p == null ? void 0 : p.name) || "プレイヤー" }, rankedPlayers: f.slice(0, m), totalCount: u.length, totalScore: M, averageScore: u.length > 0 ? Math.round(M / u.length) : 0 };
    });
    return (() => {
      const u = document.createElement("link");
      u.href = `https://fonts.googleapis.com/css2?family=${r.googleFont}&display=swap`, u.rel = "stylesheet", document.head.querySelector(`link[href*="${r.googleFont}"]`) || document.head.appendChild(u);
    })(), { theme: r, gameStatistics: k, getRankingNumberClass: (u, p) => {
      const x = `inline-block font-bold text-center rounded-full border mr-1 ${p}`, f = k.value.rankedPlayers[u];
      switch ((f == null ? void 0 : f.rank) ?? u + 1) {
        case 1:
          return `${x} ${X}`;
        case 2:
          return `${x} ${Y}`;
        case 3:
          return `${x} ${z}`;
        default:
          return `${x} ${r.ranking.fourthPlus}`;
      }
    }, getRankingRowClass: (u) => {
      const p = "flex items-center font-bold rounded-lg shadow-sm p-1", x = k.value.rankedPlayers[u], f = (x == null ? void 0 : x.rank) ?? u + 1;
      if (b && r.specialBackgrounds) switch (f) {
        case 1:
          return `${p} ${r.specialBackgrounds.first || r.ranking.oddRow}`;
        case 2:
          return `${p} ${r.specialBackgrounds.second || r.ranking.evenRow}`;
        case 3:
          return `${p} ${r.specialBackgrounds.third || r.ranking.oddRow}`;
        default:
          return `${p} ${u % 2 == 0 ? r.ranking.oddRow : r.ranking.evenRow}`;
      }
      return `${p} ${u % 2 == 0 ? r.ranking.oddRow : r.ranking.evenRow}`;
    }, getThemeStyles: () => ({ "--theme-primary": r.text.primary, "--theme-secondary": r.text.secondary, "--theme-accent": r.text.accent }) };
  })(s, { theme: q, rankingLimit: n.settings.rankingLimit, useSpecialBackgrounds: !0 });
  return (d, l) => (C(), P(_, null, [g(t).isVisible.value ? (C(), P("div", J, [w("div", { class: y(["absolute inset-0 explosion-container flex items-center justify-center", a.value.explosionText]) }, " 💥 ", 2), w("div", Q, [w("div", { class: y(["font-bold drop-shadow-lg", g(o).fontClass, g(o).text.secondary, a.value.text.large]) }, "スコア", 2), w("div", { class: y(["font-bold drop-shadow-2xl", g(o).fontClass, g(o).text.primary, a.value.text.xlarge]) }, E(g(i).result.score), 3), w("div", { class: y(["mt-2 font-bold drop-shadow-lg", g(o).fontClass, g(o).text.secondary, a.value.text.large]) }, E(g(i).result.name), 3)])])) : U("", !0), w("div", { class: y(["p-1", g(o).background.container, g(o).fontClass]) }, [w("div", { class: y(["text-center mb-2 font-bold drop-shadow-lg", g(o).text.accent, a.value.text.large]) }, " ⛏️ きょうのうさぎランキング 💎 ", 2), w("div", Z, [w("ul", ee, [(C(!0), P(_, null, W(g(i).rankedPlayers, (r, m) => (C(), P("li", { key: m, class: y(g(h)(m)) }, [w("span", { class: y(g(c)(m, a.value.rankingNumber)) }, E(r.rank ?? m + 1), 3), w("span", te, [w("span", { class: y(["font-bold mr-2 text-white", a.value.text.medium]) }, E(g(D)(r)), 3), w("span", { class: y([g(o).text.primary, a.value.text.medium]) }, " (" + E(r.name) + ") ", 3)])], 2))), 128))])]), w("div", { class: y(["p-0 m-0 flex justify-center items-center w-full mt-2", g(o).text.primary, a.value.text.small]) }, " 平均: " + E(g(i).averageScore) + "pt (" + E(g(i).totalCount) + "回 / 総計" + E(g(i).totalScore) + "pt) ", 3)], 2)], 64));
} }), [["__scopeId", "data-v-22fabda6"]]) };
export {
  ne as default
};
