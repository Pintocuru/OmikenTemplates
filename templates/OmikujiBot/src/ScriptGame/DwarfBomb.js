import { ref as L, watch as $, onUnmounted as A, computed as N, defineComponent as O, createElementBlock as C, openBlock as T, Fragment as _, createCommentVNode as U, createElementVNode as w, unref as h, normalizeClass as b, toDisplayString as v, renderList as W } from "vue";
const B = ["announceMessage", "totalDraws", "winsRank", "totalPoints"], F = [{ id: "message", name: "標準メッセージ", description: "デフォルトの返答", value: "userは🐰14匹とダイナマイト🧨と鉱山へ。1枚!5000枚!1枚!💎EPIC WIN💎5002枚獲得!" }, { id: "day", name: "うさぎの数", description: "鉱山を掘ったうさぎの数を返します", value: "14" }, { id: "payout", name: "獲得したポイント", description: "獲得したポイントを返します", value: "5002" }, ...[{ id: "announceMessage", name: "アナウンス", description: "ランキングの順位を表示します", value: "userさんの順位は、4位だよ。" }, { id: "totalDraws", name: "このおみくじをした回数", description: "この配信でのおみくじした回数を返します", value: "10" }, { id: "winsCount", name: "勝利数(勝ち負けがある場合)", description: "コメントしたユーザーの、配信枠内での勝数を返します", value: "2" }, { id: "winsRank", name: "ユーザーの順位", description: "パラメータのランキングモードを参照し、配信枠内での順位を数値で返します", value: "4" }, { id: "winsRate", name: "ユーザーの勝率(%)", description: "コメントしたユーザーの、配信枠内での勝率を返します", value: "20.0" }, { id: "totalPoints", name: "ユーザーの総得点", description: "コメントしたユーザーの、配信枠内での総得点を返します", value: "100" }].filter((e) => B.includes(e.id))];
var S = ((e) => (e[e.UNKO = 0] = "UNKO", e[e.MEDIUM_GOLD = 1] = "MEDIUM_GOLD", e[e.LARGE_GOLD = 2] = "LARGE_GOLD", e[e.GOLD_MULTIPLIER = 3] = "GOLD_MULTIPLIER", e[e.DIAMOND_MULTIPLIER = 4] = "DIAMOND_MULTIPLIER", e[e.GREEN_CHEST = 5] = "GREEN_CHEST", e[e.RED_CHEST = 6] = "RED_CHEST", e[e.DYNAMITE = 7] = "DYNAMITE", e))(S || {});
const k = { MAX_WIN: 2e4, INITIAL_LIFE: 11, GREEN_RECOVERY: 12, DWARF_COUNT: 3, WIN_THRESHOLDS: [[2e4, "🌟MAX WIN🌟 上限の"], [1e4, "👑JACKPOT👑"], [5e3, "💎EPIC WIN💎"], [2500, "♕FEVER♕"], [1e3, "🎯大当り🎯"], [500, "✌あたり✌"]], REWARD_ITEMS: [{ name: "UNKO", weight: 7, description: "うんこ（1枚）" }, { name: "mediumGold", weight: 3, description: "金塊（10-25枚）" }, { name: "largeGold", weight: 2, description: "大きな金塊（50-100枚）" }, { name: "goldMultiplier", weight: 2, emoji: "💰", description: "金塊倍増（2-5倍）" }, { name: "diamondMultiplier", weight: 1, emoji: "💎", description: "金塊倍増（10-25倍）" }, { name: "greenChest", weight: 2, emoji: "🎁", description: "緑宝箱（他のうさぎの金を統合）" }, { name: "redChest", weight: 1, description: "赤宝箱（毎ターン金を貯蓄）" }, { name: "dynamite", weight: 1, description: "ダイナマイト（他のうさぎの金を毎ターン吸収）" }], GOLD_REWARDS: { mediumGold: { amounts: [10, 15, 25], weights: [4, 3, 2] }, largeGold: { amounts: [50, 100], weights: [2, 1] }, goldMultiplier: { amounts: [2, 3, 4, 5], weights: [5, 4, 3, 2] }, diamondMultiplier: { amounts: [10, 25], weights: [5, 2] } } };
class H {
  playGame(a) {
    const s = this.createDwarfs();
    let t = k.INITIAL_LIFE, r = "", o = 0;
    for (; this.getTotalGold(s) <= k.MAX_WIN && 10 * Math.random() < t; ) {
      o++, t--;
      const c = s[Math.floor(Math.random() * k.DWARF_COUNT)], p = this.selectReward();
      r += this.applyReward(c, s, p, t), p === S.GREEN_CHEST && (t = k.GREEN_RECOVERY), this.applySpecialEffects(s);
    }
    for (let c = 0; c < 2 && this.getTotalGold(s) <= k.MAX_WIN; c++) this.applySpecialEffects(s);
    const i = Math.min(this.getTotalGold(s), k.MAX_WIN);
    return { day: o, payout: i, message: this.createMessage(a, o, s, r, i), dwarfs: s, items: r };
  }
  createDwarfs() {
    return Array(k.DWARF_COUNT).fill(null).map(() => ({ gold: 0, redChest: 0, hasRed: !1, hasDynamite: !1 }));
  }
  getTotalGold(a) {
    return a.reduce((s, t) => s + t.gold + t.redChest, 0);
  }
  selectReward() {
    const a = k.REWARD_ITEMS.reduce((r, o) => r + o.weight, 0), s = Math.random() * a;
    let t = 0;
    return k.REWARD_ITEMS.findIndex((r) => (t += r.weight) > s);
  }
  applyReward(a, s, t, r) {
    switch (t) {
      case S.UNKO:
        a.gold += 1;
        break;
      case S.MEDIUM_GOLD:
        a.gold += this.getGoldAmount("mediumGold");
        break;
      case S.LARGE_GOLD:
        a.gold += this.getGoldAmount("largeGold");
        break;
      case S.GOLD_MULTIPLIER:
        const o = this.getGoldAmount("goldMultiplier");
        return a.gold = Math.max(1, a.gold * o), a.gold > 1 ? "💰" : "";
      case S.DIAMOND_MULTIPLIER:
        const i = this.getGoldAmount("diamondMultiplier");
        return a.gold = Math.max(1, a.gold * i), a.gold > 1 ? "💎" : "";
      case S.GREEN_CHEST:
        return s.forEach((c) => {
          c !== a && (a.gold += c.gold, c.gold = 0);
        }), "🎁";
      case S.RED_CHEST:
        a.hasRed ? a.gold += 1 : a.hasRed = !0;
        break;
      case S.DYNAMITE:
        a.hasDynamite ? a.gold += 1 : a.hasDynamite = !0;
    }
    return "";
  }
  getGoldAmount(a) {
    const s = k.GOLD_REWARDS[a], t = this.weightedSelect(s.weights);
    return s.amounts[t];
  }
  weightedSelect(a) {
    const s = a.reduce((o, i) => o + i, 0), t = Math.random() * s;
    let r = 0;
    return a.findIndex((o) => (r += o) > t);
  }
  applySpecialEffects(a) {
    a.forEach((s, t) => {
      s.hasRed && (s.redChest += s.gold), s.hasDynamite && a.forEach((r, o) => {
        t !== o && (s.gold += r.gold);
      });
    });
  }
  createMessage(a, s, t, r, o) {
    var i;
    const c = t.some((n) => n.hasDynamite || n.hasRed), p = ((i = k.WIN_THRESHOLDS.find(([n]) => o >= n)) == null ? void 0 : i[1]) || "合計", d = t.map((n, g) => g === 2 ? `${n.gold + n.redChest}!` : `${n.gold + n.redChest}/`).join("");
    let u = `${a}は🐰${s}匹`;
    return c && (u += "と", t.some((n) => n.hasDynamite) && (u += "TNT🧨"), t.some((n) => n.hasDynamite && n.hasRed) && (u += "と"), t.some((n) => n.hasRed) && (u += "ツルハシ⛏️")), u += `と鉱山へ${r || "。"}${d}${p}${o}枚獲得!`, u;
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
  run(e, a) {
    try {
      const s = e.data.userId, t = this.updateUserStats(s, e.data.name, a), r = this.generateRankings(t, a, s), o = t[s];
      return a.enableCount > 0 && ((o == null ? void 0 : o.draws) || 0) > a.enableCount || (this.gameState = { ...this.gameState, userStats: t, userRankings: r }), { placeholders: this.createPlaceholders(t[s], r, s, a), postActions: [] };
    } catch (s) {
      throw console.error("Game execution error:", s), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  getGameState() {
    return this.gameState;
  }
  updateUserStats(e, a, s) {
    const { isWin: t, getPoint: r } = s, { rankMode: o } = this.settings;
    if (o === "point") {
      this.gameState.userRecords || (this.gameState.userRecords = {}), this.gameState.userRecords[e] || (this.gameState.userRecords[e] = []);
      const i = { userId: e, name: a, draws: 1, wins: t ? 1 : 0, points: r, totalPoints: r, rank: 0, rate: 0 };
      this.gameState.userRecords[e].push(i);
      const c = { userId: e, name: a, draws: this.gameState.userRecords[e].length, wins: t ? 1 : 0, points: r, totalPoints: this.gameState.userRecords[e].reduce((p, d) => p + (d.points ?? 0), 0), rank: 0, rate: 0 };
      return { ...this.gameState.userStats, [e]: c };
    }
    {
      const i = { ...this.gameState.userStats[e] ?? { userId: e, name: a, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } };
      return r > 0 && (i.points = (i.points || 0) + r, i.totalPoints = (i.totalPoints || 0) + r), t && (i.wins = (i.wins || 0) + 1), i.draws = (i.draws || 0) + 1, { ...this.gameState.userStats, [e]: i };
    }
  }
  generateRankings(e, a, s) {
    var t;
    const { rankMode: r } = this.settings;
    if (r === "point") {
      const d = [];
      this.gameState.userRecords && Object.values(this.gameState.userRecords).forEach((g) => {
        d.push(...g);
      });
      const u = d.sort((g, f) => (f.points ?? 0) - (g.points ?? 0)).map((g, f) => ({ ...g, rank: f + 1 })), n = ((t = this.gameState.userRecords) == null ? void 0 : t[s]) || [];
      if (n.length > 0) {
        const g = n[n.length - 1], f = u.findIndex((y) => y.userId === s && y.points === g.points);
        if (f !== -1) {
          const [y] = u.splice(f, 1);
          u.unshift(y);
        }
      }
      return u;
    }
    const o = this.createRankingEntries(e), i = r === "rate" ? "rate" : "wins", c = o.sort((d, u) => (u[i] ?? 0) - (d[i] ?? 0)).map((d, u) => ({ ...d, rank: u + 1 })), p = c.findIndex((d) => d.userId === s);
    if (p > 0) {
      const [d] = c.splice(p, 1);
      c.unshift(d);
    }
    return c;
  }
  createRankingEntries(e) {
    const a = this.gameState.userRankings || [];
    return Object.entries(e).map(([s, t]) => {
      const r = a.find((d) => d.userId === s), o = t.draws ?? (r == null ? void 0 : r.draws) ?? 0, i = t.wins ?? (r == null ? void 0 : r.wins) ?? 0, c = t.points ?? (r == null ? void 0 : r.points) ?? 0, p = t.totalPoints ?? (r == null ? void 0 : r.totalPoints) ?? 0;
      return { userId: s, name: t.name || "Unknown", draws: o, wins: i, points: c, totalPoints: p, rank: t.rank ?? (r == null ? void 0 : r.rank) ?? 0, rate: o > 0 ? i / o * 100 : 0 };
    });
  }
  createPlaceholders(e, a, s, t) {
    var r;
    const { rankMode: o } = this.settings, i = e.draws ?? 0, c = t.enableCount > 0 && i > t.enableCount;
    if (o === "point") {
      const u = ((r = this.gameState.userRecords) == null ? void 0 : r[s]) || [], n = u[u.length - 1];
      if (n) {
        const g = this.calculateRank(n, a, s);
        return { announceMessage: c ? `${n.name}さんは上限を超えているから、参考記録だよ。` : `${n.name}さんの${n.points}は、${g}位だよ。`, winsCount: String(n.wins ?? 0), winsRank: g, winsRate: "0.0", totalDraws: String(u.length), totalPoints: String(e.totalPoints ?? 0) };
      }
    }
    const p = this.calculateRank(e, a, s), d = i > 0 ? ((e.wins || 0) / i * 100).toFixed(1) : "0.0";
    return { announceMessage: c ? `${e.name}さんは上限を超えているから、参考記録だよ。` : `${e.name}さんの順位は、${p}位だよ。`, winsCount: String(e.wins ?? 0), winsRank: p, winsRate: d, totalDraws: String(i), totalPoints: String(e.totalPoints ?? 0) };
  }
  calculateRank(e, a, s) {
    if (this.settings.rankMode === "point") {
      const r = e.points ?? 0, o = a.filter((i) => (i.points ?? 0) > r).length;
      return String(o + 1);
    }
    const t = a.findIndex((r) => r.userId === s);
    return t >= 0 ? String(t + 1) : "不明";
  }
}(), V = new class {
  settings = { rankingLimit: 10, isParty: !0, enableCount: 5 };
  gameState = G("BomberSpin");
  LogRank = j;
  game = new H();
  setup(e) {
    this.settings = { ...this.settings, ...e }, this.LogRank.setup({ rankMode: "point" });
  }
  run(e, a) {
    const { isParty: s, enableCount: t } = this.settings, r = (e == null ? void 0 : e.data.displayName) ?? "Unknown", { day: o, payout: i, message: c, dwarfs: p, items: d } = this.game.playGame(r), u = this.LogRank.run(e, { enableCount: t, isWin: !1, getPoint: i });
    this.gameState = this.LogRank.getGameState();
    const n = [];
    p.some((l) => l.hasDynamite) && n.push({ delaySeconds: 3, wordParty: "!dwarfBombDynamite" });
    const g = p.filter((l) => l.hasRed).length;
    for (let l = 0; l < g; l++) n.push({ delaySeconds: 3, wordParty: "!dwarfBombPickaxe" });
    const f = (d.match(/💰/g) || []).length, y = (d.match(/💎/g) || []).length, m = (d.match(/🎁/g) || []).length;
    for (let l = 0; l < f; l++) n.push({ delaySeconds: 3, wordParty: "!dwarfBombGold" });
    for (let l = 0; l < y; l++) n.push({ delaySeconds: 3, wordParty: "!dwarfBombDiamond" });
    for (let l = 0; l < m; l++) n.push({ delaySeconds: 3, wordParty: "!dwarfBombTreasure" });
    for (let l = 0; l < o; l++) n.push({ delaySeconds: 3, wordParty: "!dwarfBombDaysBunny" });
    return { postActions: s ? [{ delaySeconds: 0, wordParty: "!dwarfBombRabbit" }, { delaySeconds: 3, wordParty: "!bombFire" }, ...n] : [], placeholders: { ...u.placeholders, message: c, day: o, payout: i } };
  }
  getGameState() {
    return this.gameState;
  }
}(), I = { name: "dwarf-bomb", version: "0.0.1", displayName: "うさぎスロット", description: "Nolimit City - Fire in the Hole風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スロット"] }, K = { xs: { explosionText: "text-[8rem]", text: { large: "text-base", xlarge: "text-2xl", medium: "text-sm", small: "text-[8px]" }, rankingNumber: "w-4 h-3 leading-3 text-[10px]" }, sm: { explosionText: "text-[10rem]", text: { large: "text-lg", xlarge: "text-3xl", medium: "text-base", small: "text-[10px]" }, rankingNumber: "w-5 h-3.5 leading-3.5 text-xs" }, md: { explosionText: "text-[12rem]", text: { large: "text-xl", xlarge: "text-4xl", medium: "text-lg", small: "text-xs" }, rankingNumber: "w-6 h-4 leading-4 text-sm" }, lg: { explosionText: "text-[14rem]", text: { large: "text-2xl", xlarge: "text-5xl", medium: "text-xl", small: "text-sm" }, rankingNumber: "w-8 h-6 leading-6 text-md" }, xl: { explosionText: "text-[16rem]", text: { large: "text-3xl", xlarge: "text-6xl", medium: "text-2xl", small: "text-base" }, rankingNumber: "w-10 h-8 leading-8 text-md" } }, X = "bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300", Y = "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400", z = "bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400", D = (e) => "points" in e ? e.points : "score" in e ? e.score : 0, q = { name: "cave-mining", googleFont: "RocknRoll+One", fontClass: "font-rocknroll", background: { container: "bg-stone-900 bg-opacity-95 border-4 border-amber-600 rounded-xl backdrop-blur-sm", border: "border-amber-600" }, text: { primary: "text-amber-300", secondary: "text-yellow-200", accent: "text-orange-400" }, ranking: { fourthPlus: "bg-stone-800 text-amber-300 border-amber-500", oddRow: "text-amber-300 bg-amber-900 bg-opacity-40 border-amber-500", evenRow: "text-yellow-200 bg-stone-800 bg-opacity-60 border-orange-400" }, specialBackgrounds: { first: "bg-gradient-to-r from-amber-200 to-yellow-400 text-stone-900", second: "bg-gradient-to-r from-gray-200 to-gray-400 text-stone-900", third: "bg-gradient-to-r from-orange-300 to-red-500 text-stone-900" } }, J = { key: 0, class: "relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8" }, Q = { class: "absolute inset-0 flex flex-col items-center justify-center text-center z-10" }, Z = { class: "overflow-hidden max-h-fit" }, ee = { class: "list-none p-0 m-0 space-y-1" }, te = { class: "flex justify-center items-center flex-1" }, ne = { id: I.name, name: I.displayName, description: I.description, version: I.version, author: I.author, tags: I.keywords, url: "", execute: V, settings: [{ id: "isParty", name: "WordPartyで音を鳴らすか", description: "ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない", inputType: "boolean", defaultValue: !0 }, { id: "rankingLimit", name: "上位何位まで表示させるか", description: "大きくしすぎるとはみ出ます。", inputType: "number", defaultValue: 10 }, { id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5, min: 0, max: 100 }], params: [], placeholders: F, component: ((e, a) => {
  const s = e.__vccOpts || e;
  for (const [t, r] of a) s[t] = r;
  return s;
})(O({ __name: "component", props: { settings: {}, userRankings: {}, displaySize: {} }, setup(e) {
  const a = e, s = function(d, u) {
    const { delayMs: n, displayMs: g, immediate: f = !1, deep: y = !0 } = u, m = L(!1);
    let l = null, x = null;
    const R = () => {
      l && (clearTimeout(l), l = null), x && (clearTimeout(x), x = null);
    }, M = () => {
      R(), m.value = !1, l = setTimeout(() => {
        m.value = !0, x = setTimeout(() => {
          m.value = !1;
        }, g);
      }, n);
    };
    return $(d, (E) => {
      (Array.isArray(E) ? E.length > 0 : E) && M();
    }, { immediate: f, deep: y }), A(() => {
      R();
    }), { isVisible: m, manualStart: () => {
      M();
    }, manualHide: () => {
      R(), m.value = !1;
    }, clearTimers: R };
  }(() => a.userRankings, { delayMs: 3500, displayMs: 5e3 }), t = N(() => K[a.displaySize]), r = N(() => a.userRankings.map((d) => ({ name: (d == null ? void 0 : d.name) || "プレイヤー", points: (d == null ? void 0 : d.points) ?? 0, rank: d == null ? void 0 : d.rank }))), { theme: o, gameStatistics: i, getRankingNumberClass: c, getRankingRowClass: p } = ((d, u) => {
    const { theme: n, rankingLimit: g, useSpecialBackgrounds: f = !1 } = u, y = N(() => {
      const m = d.value, l = m[0] || null, x = m.slice(1).sort((E, P) => D(P) - D(E)), R = l ? [l, ...x] : x, M = m.reduce((E, P) => E + D(P), 0);
      return { showResult: !!l, result: { score: l ? D(l) : 0, name: (l == null ? void 0 : l.name) || "プレイヤー" }, rankedPlayers: R.slice(0, g), totalCount: m.length, totalScore: M, averageScore: m.length > 0 ? Math.round(M / m.length) : 0 };
    });
    return (() => {
      const m = document.createElement("link");
      m.href = `https://fonts.googleapis.com/css2?family=${n.googleFont}&display=swap`, m.rel = "stylesheet", document.head.querySelector(`link[href*="${n.googleFont}"]`) || document.head.appendChild(m);
    })(), { theme: n, gameStatistics: y, getRankingNumberClass: (m, l) => {
      const x = `inline-block font-bold text-center rounded-full border mr-1 ${l}`, R = y.value.rankedPlayers[m];
      switch ((R == null ? void 0 : R.rank) ?? m + 1) {
        case 1:
          return `${x} ${X}`;
        case 2:
          return `${x} ${Y}`;
        case 3:
          return `${x} ${z}`;
        default:
          return `${x} ${n.ranking.fourthPlus}`;
      }
    }, getRankingRowClass: (m) => {
      const l = "flex items-center font-bold rounded-lg shadow-sm p-1", x = y.value.rankedPlayers[m], R = (x == null ? void 0 : x.rank) ?? m + 1;
      if (f && n.specialBackgrounds) switch (R) {
        case 1:
          return `${l} ${n.specialBackgrounds.first || n.ranking.oddRow}`;
        case 2:
          return `${l} ${n.specialBackgrounds.second || n.ranking.evenRow}`;
        case 3:
          return `${l} ${n.specialBackgrounds.third || n.ranking.oddRow}`;
        default:
          return `${l} ${m % 2 == 0 ? n.ranking.oddRow : n.ranking.evenRow}`;
      }
      return `${l} ${m % 2 == 0 ? n.ranking.oddRow : n.ranking.evenRow}`;
    }, getThemeStyles: () => ({ "--theme-primary": n.text.primary, "--theme-secondary": n.text.secondary, "--theme-accent": n.text.accent }) };
  })(r, { theme: q, rankingLimit: a.settings.rankingLimit, useSpecialBackgrounds: !0 });
  return (d, u) => (T(), C(_, null, [h(s).isVisible.value ? (T(), C("div", J, [w("div", { class: b(["absolute inset-0 explosion-container flex items-center justify-center", t.value.explosionText]) }, " 💥 ", 2), w("div", Q, [w("div", { class: b(["font-bold drop-shadow-lg", h(o).fontClass, h(o).text.secondary, t.value.text.large]) }, "スコア", 2), w("div", { class: b(["font-bold drop-shadow-2xl", h(o).fontClass, h(o).text.primary, t.value.text.xlarge]) }, v(h(i).result.score), 3), w("div", { class: b(["mt-2 font-bold drop-shadow-lg", h(o).fontClass, h(o).text.secondary, t.value.text.large]) }, v(h(i).result.name), 3)])])) : U("", !0), w("div", { class: b(["p-1", h(o).background.container, h(o).fontClass]) }, [w("div", { class: b(["text-center mb-2 font-bold drop-shadow-lg", h(o).text.accent, t.value.text.large]) }, " ⛏️ きょうのうさぎランキング 💎 ", 2), w("div", Z, [w("ul", ee, [(T(!0), C(_, null, W(h(i).rankedPlayers, (n, g) => (T(), C("li", { key: g, class: b(h(p)(g)) }, [w("span", { class: b(h(c)(g, t.value.rankingNumber)) }, v(n.rank ?? g + 1), 3), w("span", te, [w("span", { class: b(["font-bold mr-2 text-white", t.value.text.medium]) }, v(h(D)(n)), 3), w("span", { class: b([h(o).text.primary, t.value.text.medium]) }, " (" + v(n.name) + ") ", 3)])], 2))), 128))])]), w("div", { class: b(["p-0 m-0 flex justify-center items-center w-full mt-2", h(o).text.primary, t.value.text.small]) }, " 平均: " + v(h(i).averageScore) + "pt (" + v(h(i).totalCount) + "回 / 総計" + v(h(i).totalScore) + "pt) ", 3)], 2)], 64));
} }), [["__scopeId", "data-v-d9469f3a"]]) };
export {
  ne as default
};
