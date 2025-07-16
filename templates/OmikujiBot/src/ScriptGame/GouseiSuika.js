import { ref as A, watch as $, onUnmounted as L, defineComponent as T, computed as R, createElementBlock as k, openBlock as v, Fragment as I, createCommentVNode as F, createElementVNode as p, unref as V, normalizeClass as h, toDisplayString as f, renderList as j } from "vue";
const G = ["announceMessage", "totalDraws", "winsRank", "totalPoints"], B = [{ id: "message", name: "標準メッセージ", description: "デフォルトのスイカジェネレーターの返答", value: "userの得点は1500!" }, { id: "points", name: "ポイント", description: "スイカジェネレーターの得点を返します", value: "1500" }, ...[{ id: "announceMessage", name: "アナウンス", description: "ランキングの順位を表示します", value: "userさんの順位は、4位だよ。" }, { id: "totalDraws", name: "このおみくじをした回数", description: "この配信でのおみくじした回数を返します", value: "10" }, { id: "winsCount", name: "勝利数(勝ち負けがある場合)", description: "コメントしたユーザーの、配信枠内での勝数を返します", value: "2" }, { id: "winsRank", name: "ユーザーの順位", description: "パラメータのランキングモードを参照し、配信枠内での順位を数値で返します", value: "4" }, { id: "winsRate", name: "ユーザーの勝率(%)", description: "コメントしたユーザーの、配信枠内での勝率を返します", value: "20.0" }, { id: "totalPoints", name: "ユーザーの総得点", description: "コメントしたユーザーの、配信枠内での総得点を返します", value: "100" }].filter((t) => G.includes(t.id))];
function N(t) {
  return { ruleId: t, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
const D = new class {
  settings = { rankMode: "wins" };
  gameState = N("LogRank");
  setup(t) {
    this.settings = t, this.gameState.userRecords || (this.gameState.userRecords = {});
  }
  run(t, e) {
    try {
      const s = t.data.userId, n = this.updateUserStats(s, t.data.name, e), a = this.generateRankings(n, e, s), d = n[s];
      return e.enableCount > 0 && ((d == null ? void 0 : d.draws) || 0) > e.enableCount || (this.gameState = { ...this.gameState, userStats: n, userRankings: a }), { placeholders: this.createPlaceholders(n[s], a, s, e), postActions: [] };
    } catch (s) {
      throw console.error("Game execution error:", s), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  getGameState() {
    return this.gameState;
  }
  updateUserStats(t, e, s) {
    const { isWin: n, getPoint: a } = s, { rankMode: d } = this.settings;
    if (d === "point") {
      this.gameState.userRecords || (this.gameState.userRecords = {}), this.gameState.userRecords[t] || (this.gameState.userRecords[t] = []);
      const r = { userId: t, name: e, draws: 1, wins: n ? 1 : 0, points: a, totalPoints: a, rank: 0, rate: 0 };
      this.gameState.userRecords[t].push(r);
      const i = { userId: t, name: e, draws: this.gameState.userRecords[t].length, wins: n ? 1 : 0, points: a, totalPoints: this.gameState.userRecords[t].reduce((u, o) => u + (o.points ?? 0), 0), rank: 0, rate: 0 };
      return { ...this.gameState.userStats, [t]: i };
    }
    {
      const r = { ...this.gameState.userStats[t] ?? { userId: t, name: e, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } };
      return a > 0 && (r.points = (r.points || 0) + a, r.totalPoints = (r.totalPoints || 0) + a), n && (r.wins = (r.wins || 0) + 1), r.draws = (r.draws || 0) + 1, { ...this.gameState.userStats, [t]: r };
    }
  }
  generateRankings(t, e, s) {
    var n;
    const { rankMode: a } = this.settings;
    if (a === "point") {
      const o = [];
      this.gameState.userRecords && Object.values(this.gameState.userRecords).forEach((m) => {
        o.push(...m);
      });
      const c = o.sort((m, g) => (g.points ?? 0) - (m.points ?? 0)).map((m, g) => ({ ...m, rank: g + 1 })), l = ((n = this.gameState.userRecords) == null ? void 0 : n[s]) || [];
      if (l.length > 0) {
        const m = l[l.length - 1], g = c.findIndex((y) => y.userId === s && y.points === m.points);
        if (g !== -1) {
          const [y] = c.splice(g, 1);
          c.unshift(y);
        }
      }
      return c;
    }
    const d = this.createRankingEntries(t), r = a === "rate" ? "rate" : "wins", i = d.sort((o, c) => (c[r] ?? 0) - (o[r] ?? 0)).map((o, c) => ({ ...o, rank: c + 1 })), u = i.findIndex((o) => o.userId === s);
    if (u > 0) {
      const [o] = i.splice(u, 1);
      i.unshift(o);
    }
    return i;
  }
  createRankingEntries(t) {
    const e = this.gameState.userRankings || [];
    return Object.entries(t).map(([s, n]) => {
      const a = e.find((o) => o.userId === s), d = n.draws ?? (a == null ? void 0 : a.draws) ?? 0, r = n.wins ?? (a == null ? void 0 : a.wins) ?? 0, i = n.points ?? (a == null ? void 0 : a.points) ?? 0, u = n.totalPoints ?? (a == null ? void 0 : a.totalPoints) ?? 0;
      return { userId: s, name: n.name || "Unknown", draws: d, wins: r, points: i, totalPoints: u, rank: n.rank ?? (a == null ? void 0 : a.rank) ?? 0, rate: d > 0 ? r / d * 100 : 0 };
    });
  }
  createPlaceholders(t, e, s, n) {
    var a;
    const { rankMode: d } = this.settings, r = t.draws ?? 0, i = n.enableCount > 0 && r > n.enableCount;
    if (d === "point") {
      const c = ((a = this.gameState.userRecords) == null ? void 0 : a[s]) || [], l = c[c.length - 1];
      if (l) {
        const m = this.calculateRank(l, e, s);
        return { announceMessage: i ? `${l.name}さんは上限を超えているから、参考記録だよ。` : `${l.name}さんの${l.points}は、${m}位だよ。`, winsCount: String(l.wins ?? 0), winsRank: m, winsRate: "0.0", totalDraws: String(c.length), totalPoints: String(t.totalPoints ?? 0) };
      }
    }
    const u = this.calculateRank(t, e, s), o = r > 0 ? ((t.wins || 0) / r * 100).toFixed(1) : "0.0";
    return { announceMessage: i ? `${t.name}さんは上限を超えているから、参考記録だよ。` : `${t.name}さんの順位は、${u}位だよ。`, winsCount: String(t.wins ?? 0), winsRank: u, winsRate: o, totalDraws: String(r), totalPoints: String(t.totalPoints ?? 0) };
  }
  calculateRank(t, e, s) {
    if (this.settings.rankMode === "point") {
      const a = t.points ?? 0, d = e.filter((r) => (r.points ?? 0) > a).length;
      return String(d + 1);
    }
    const n = e.findIndex((a) => a.userId === s);
    return n >= 0 ? String(n + 1) : "不明";
  }
}(), O = "Unknown", P = { MIN: 0.7, MAX: 1.3 }, M = 3, E = 1, U = 8.5, W = 2, _ = 6;
class z {
  gameConfig;
  totalPoints = 0;
  postArray = [];
  constructor(e) {
    this.gameConfig = e, this.initializeEffects();
  }
  play() {
    return this.playSmallItems(), this.playBigItems(), { points: this.calculateFinalScore(), postArray: this.postArray };
  }
  initializeEffects() {
    this.postArray = [{ delaySeconds: E, wordParty: "🍒" }, { delaySeconds: U, wordParty: "!パパッ" }];
  }
  playSmallItems() {
    this.gameConfig.small.forEach((e) => {
      const s = new X(e).draw();
      this.totalPoints += s.pointsEarned, this.addEmojiEffects(e.party, s.wins);
    });
  }
  playBigItems() {
    let e = M;
    for (; e > 0; ) {
      const s = this.selectBigItem();
      s && (this.totalPoints += s.points, e -= s.damage ?? 0, this.addEffect(s.party)), this.addRandomEffects();
    }
  }
  selectBigItem() {
    for (const e of this.gameConfig.big)
      if (100 * Math.random() < e.chance) return e;
    return this.gameConfig.big[this.gameConfig.big.length - 1];
  }
  addRandomEffects() {
    this.gameConfig.big.forEach((e) => {
      e.damage && this.shouldAddRandomEffect(e.damage) && this.addEffect(e.party);
    });
  }
  shouldAddRandomEffect(e) {
    return M - e > Math.random() * _;
  }
  addEmojiEffects(e, s) {
    const n = Math.floor(s / W);
    for (let a = 0; a < n; a++) this.addEffect(e);
  }
  addEffect(e) {
    this.postArray.push({ delaySeconds: E, wordParty: e });
  }
  calculateFinalScore() {
    const e = P.MIN + Math.random() * (P.MAX - P.MIN);
    return Math.ceil(this.totalPoints * e);
  }
}
class X {
  constructor(e) {
    this.item = e;
  }
  draw() {
    let e = 0, s = 0;
    const n = this.item.times ?? 0;
    for (let a = 0; a < n; a++) this.isWin() && (e += this.item.points, s++);
    return { pointsEarned: e, wins: s };
  }
  isWin() {
    return 100 * Math.random() < this.item.chance;
  }
}
const H = new class {
  settings = { rankingLimit: 10, isParty: !0, enableCount: 5 };
  gameState = N("GouseiSuika");
  LogRank = D;
  setup(t) {
    this.settings = { ...this.settings, ...t }, this.LogRank.setup({ rankMode: "point" });
  }
  run(t, e) {
    const { mode: s } = e, { isParty: n, enableCount: a } = this.settings, d = this.executeGame(s), r = this.LogRank.run(t, { enableCount: a, isWin: !1, getPoint: d.points });
    return this.gameState = this.LogRank.getGameState(), { postActions: n ? d.postArray : [], placeholders: { ...r.placeholders, message: this.createResultMessage(t, d.points), points: String(d.points) } };
  }
  getGameState() {
    return this.gameState;
  }
  executeGame(t) {
    const e = q[t];
    if (!e) throw new Error(`不明なゲームモード: ${t}`);
    return new z(e).play();
  }
  createResultMessage(t, e) {
    return `${(t == null ? void 0 : t.data.displayName) ?? O}の得点は${e}!`;
  }
}(), q = { スイカゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 300, damage: 1, party: "🍐" }, { chance: 25, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 100, points: 1e3, damage: 0, party: "🍉" }] }, カボチャゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 150, damage: 0, party: "🍬" }, { chance: 33, points: 300, damage: 1, party: "🍐" }, { chance: 33, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 50, points: 1e3, damage: 0, party: "🍉" }, { chance: 100, points: 1200, damage: 0, party: "🎃" }] }, クジラゲーム: { small: [{ chance: 50, times: 5, points: 11, party: "!クマノミ" }, { chance: 50, times: 5, points: 22, party: "!クラゲ" }, { chance: 50, times: 5, points: 33, party: "!フグ" }, { chance: 50, times: 5, points: 44, party: "!カニ" }, { chance: 50, times: 5, points: 55, party: "!マグロ、ご期待ください" }], big: [{ chance: 33, points: 300, damage: 1, party: "!ウミガメ" }, { chance: 33, points: 350, damage: 1, party: "!マンボウ" }, { chance: 33, points: 400, damage: 1, party: "!ジンベエザメ" }, { chance: 33, points: 450, damage: 1, party: "!シャチ" }, { chance: 100, points: 500, damage: 0, party: "!クジラ" }] } }, x = { name: "gousei-suika", version: "0.0.4", displayName: "スイカジェネレーター", description: "米兜科技 合成大西瓜風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スイカ"] }, J = { xs: { scoreCircle: "w-32 h-32", text: { large: "text-base", xlarge: "text-2xl", medium: "text-sm", small: "text-[8px]" }, rankingImage: "w-4 h-4", rankingNumber: "w-4 h-3 leading-3 text-[8px]", container: { padding: "py-0", itemPadding: "py-0" } }, sm: { scoreCircle: "w-40 h-40", text: { large: "text-lg", xlarge: "text-3xl", medium: "text-base", small: "text-[10px]" }, rankingImage: "w-5 h-5", rankingNumber: "w-5 h-3.5 leading-3.5 text-[10px]", container: { padding: "py-0.5", itemPadding: "py-0" } }, md: { scoreCircle: "w-48 h-48", text: { large: "text-xl", xlarge: "text-4xl", medium: "text-lg", small: "text-xs" }, rankingImage: "w-6 h-6", rankingNumber: "w-6 h-4 leading-4 text-xs", container: { padding: "py-1", itemPadding: "py-0.5" } }, lg: { scoreCircle: "w-56 h-56", text: { large: "text-2xl", xlarge: "text-5xl", medium: "text-xl", small: "text-sm" }, rankingImage: "w-8 h-8", rankingNumber: "w-8 h-6 leading-6 text-xs", container: { padding: "py-2", itemPadding: "py-1" } }, xl: { scoreCircle: "w-64 h-64", text: { large: "text-3xl", xlarge: "text-6xl", medium: "text-2xl", small: "text-base" }, rankingImage: "w-10 h-10", rankingNumber: "w-10 h-8 leading-8 text-sm", container: { padding: "py-3", itemPadding: "py-1.5" } } }, K = { class: "overflow-hidden max-h-fit" }, Q = { class: "list-none p-0 m-0 space-y-1" }, Y = { class: "flex justify-center items-center flex-1" }, ee = { id: x.name, name: x.displayName, description: x.description, version: x.version, author: x.author, tags: x.keywords, url: "", execute: H, settings: [{ id: "isParty", name: "フルーツをWordPartyで降らせるか", description: "ON:降らせる(別途専用WordPartyが必要) / OFF:OFF", inputType: "boolean", defaultValue: !0 }, { id: "rankingLimit", name: "上位何位まで表示させるか", description: "大きくしすぎるとはみ出ます。", inputType: "number", defaultValue: 10, min: 1, max: 30 }, { id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5, min: 0, max: 100 }], params: [{ id: "mode", name: "モード", description: "降ってくるアイテムや得点が変わります", inputType: "select", values: ["スイカゲーム", "カボチャゲーム", "クジラゲーム"], defaultValue: "スイカゲーム" }], placeholders: B, component: ((t, e) => {
  const s = t.__vccOpts || t;
  for (const [n, a] of e) s[n] = a;
  return s;
})(T({ __name: "component", props: { settings: {}, userRankings: {}, displaySize: {} }, setup(t) {
  const e = t, s = function(i, u) {
    const { delayMs: o, displayMs: c, immediate: l = !1, deep: m = !0 } = u, g = A(!1);
    let y = null, b = null;
    const w = () => {
      y && (clearTimeout(y), y = null), b && (clearTimeout(b), b = null);
    }, C = () => {
      w(), g.value = !1, y = setTimeout(() => {
        g.value = !0, b = setTimeout(() => {
          g.value = !1;
        }, c);
      }, o);
    };
    return $(i, (S) => {
      (Array.isArray(S) ? S.length > 0 : S) && C();
    }, { immediate: l, deep: m }), L(() => {
      w();
    }), { isVisible: g, manualStart: () => {
      C();
    }, manualHide: () => {
      w(), g.value = !1;
    }, clearTimers: w };
  }(() => e.userRankings, { delayMs: 4500, displayMs: 5e3 }), n = R(() => J[e.displaySize]), a = R(() => {
    const i = e.userRankings[0] || null, u = e.userRankings.slice(1).sort((c, l) => ((l == null ? void 0 : l.points) ?? 0) - ((c == null ? void 0 : c.points) ?? 0)), o = i ? [i, ...u] : u;
    return { showResult: !!i, result: { score: (i == null ? void 0 : i.points) || 0, name: (i == null ? void 0 : i.name) || "プレイヤー" }, rankPlayers: o.slice(0, e.settings.rankingLimit), totalCount: e.userRankings.length, totalPoint: e.userRankings.reduce((c, l) => c + ((l == null ? void 0 : l.points) ?? 0), 0) };
  }), d = R(() => {
    const { totalCount: i, totalPoint: u } = a.value;
    return i > 0 ? Math.round(u / i) : 0;
  }), r = (i) => i < 3 ? `${["bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-yellow-900 border-yellow-500 shadow-yellow-400/50", "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 text-gray-900 border-gray-500 shadow-gray-400/50", "bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 text-orange-900 border-orange-500 shadow-orange-400/50"][i]} shadow-lg` : "bg-gray-200 text-gray-700 border-gray-300";
  return (i, u) => (v(), k(I, null, [V(s).isVisible.value ? (v(), k("div", { key: 0, class: h(["rounded-full mx-auto relative whitespace-nowrap flex flex-col justify-center items-center -mb-8", "bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border-4 border-blue-200", "bubble-animation shadow-blue-200/50", n.value.scoreCircle]) }, [p("div", { class: h(["font-bold text-blue-900 font-rocknroll", n.value.text.large]) }, "スコア", 2), p("div", { class: h(["font-bold font-mochiy bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent", n.value.text.xlarge]) }, f(a.value.result.score), 3), p("div", { class: h(["mt-2 font-bold text-blue-900 font-rocknroll", n.value.text.large]) }, f(a.value.result.name), 3)], 2)) : F("", !0), p("div", { class: h(["bg-amber-50 border-4 border-amber-400 rounded-3xl font-rocknroll px-1", n.value.container.padding]) }, [p("div", { class: h(["text-center mb-2 text-amber-800 font-bold drop-shadow-lg", n.value.text.large]) }, " 🍉スイカランキング🍉 ", 2), p("div", K, [p("ul", Q, [(v(!0), k(I, null, j(a.value.rankPlayers, (o, c) => {
    return v(), k("li", { key: c, class: h((l = (o.rank ?? 1) - 1, `flex items-center font-bold rounded-lg shadow-sm px-1 ${n.value.container.itemPadding} ${l < 3 ? ["text-amber-800 bg-gradient-to-r from-amber-200 to-amber-100 border-l-4 border-amber-400", "text-blue-800 bg-gradient-to-r from-blue-200 to-blue-100 border-l-4 border-blue-400", "text-orange-800 bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-400"][l] : "text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300"}`)) }, [p("span", { class: h(["inline-block font-bold text-center rounded-full transform transition-all duration-300", r((o.rank ?? 1) - 1), n.value.rankingNumber]) }, f(o.rank ?? 1), 3), p("span", Y, [p("span", { class: h(["font-bold mr-2", n.value.text.medium]) }, f(o.points), 3), p("span", { class: h(["text-gray-600", n.value.text.medium]) }, "(" + f(o.name) + ")", 3)])], 2);
    var l;
  }), 128))])]), p("div", { class: h(["flex justify-center items-center w-full text-gray-600", n.value.text.small]) }, " 平均: " + f(d.value) + "pt (" + f(a.value.totalCount) + "回 / 総計" + f(a.value.totalPoint) + "pt) ", 3)], 2)], 64));
} }), [["__scopeId", "data-v-1f443cb6"]]) };
export {
  ee as default
};
