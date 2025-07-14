import { ref as N, watch as A, onUnmounted as L, defineComponent as T, computed as R, createElementBlock as x, openBlock as b, Fragment as C, createCommentVNode as j, createElementVNode as h, unref as F, normalizeClass as m, toDisplayString as y, renderList as V } from "vue";
const G = ["announceMessage", "totalDraws", "winsRank", "totalPoints"], _ = [{ id: "message", name: "標準メッセージ", description: "デフォルトのスイカジェネレーターの返答", value: "userの得点は1500!" }, { id: "points", name: "ポイント", description: "スイカジェネレーターの得点を返します", value: "1500" }, ...[{ id: "announceMessage", name: "アナウンス", description: "ランキングの順位を表示します", value: "userさんの順位は、4位だよ。" }, { id: "totalDraws", name: "このおみくじをした回数", description: "この配信でのおみくじした回数を返します", value: "10" }, { id: "winsCount", name: "勝利数(勝ち負けがある場合)", description: "コメントしたユーザーの、配信枠内での勝数を返します", value: "2" }, { id: "winsRank", name: "ユーザーの順位", description: "パラメータのランキングモードを参照し、配信枠内での順位を数値で返します", value: "4" }, { id: "winsRate", name: "ユーザーの勝率(%)", description: "コメントしたユーザーの、配信枠内での勝率を返します", value: "20.0" }, { id: "totalPoints", name: "ユーザーの総得点", description: "コメントしたユーザーの、配信枠内での総得点を返します", value: "100" }].filter((t) => G.includes(t.id))];
function $(t) {
  return { ruleId: t, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
const B = new class {
  settings = { rankMode: "wins" };
  gameState = $("LogRank");
  setup(t) {
    this.settings = t, this.gameState.userRecords || (this.gameState.userRecords = {});
  }
  run(t, e) {
    try {
      const s = t.data.userId, a = this.updateUserStats(s, t.data.name, e), n = this.generateRankings(a, e, s), d = a[s];
      return e.enableCount > 0 && ((d == null ? void 0 : d.draws) || 0) > e.enableCount || (this.gameState = { ...this.gameState, userStats: a, userRankings: n }), { placeholders: this.createPlaceholders(a[s], n, s, e), postActions: [] };
    } catch (s) {
      throw console.error("Game execution error:", s), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  getGameState() {
    return this.gameState;
  }
  updateUserStats(t, e, s) {
    const { isWin: a, getPoint: n } = s, { rankMode: d } = this.settings;
    if (d === "point") {
      this.gameState.userRecords || (this.gameState.userRecords = {}), this.gameState.userRecords[t] || (this.gameState.userRecords[t] = []);
      const i = { userId: t, name: e, draws: 1, wins: a ? 1 : 0, points: n, totalPoints: n, rank: 0, rate: 0 };
      this.gameState.userRecords[t].push(i);
      const o = { userId: t, name: e, draws: this.gameState.userRecords[t].length, wins: a ? 1 : 0, points: n, totalPoints: this.gameState.userRecords[t].reduce((c, l) => c + (l.points ?? 0), 0), rank: 0, rate: 0 };
      return { ...this.gameState.userStats, [t]: o };
    }
    {
      const i = { ...this.gameState.userStats[t] ?? { userId: t, name: e, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } };
      return n > 0 && (i.points = (i.points || 0) + n, i.totalPoints = (i.totalPoints || 0) + n), a && (i.wins = (i.wins || 0) + 1), i.draws = (i.draws || 0) + 1, { ...this.gameState.userStats, [t]: i };
    }
  }
  generateRankings(t, e, s) {
    var a;
    const { rankMode: n } = this.settings;
    if (n === "point") {
      const l = [];
      this.gameState.userRecords && Object.values(this.gameState.userRecords).forEach((g) => {
        l.push(...g);
      });
      const r = l.sort((g, p) => (p.points ?? 0) - (g.points ?? 0)).map((g, p) => ({ ...g, rank: p + 1 })), u = ((a = this.gameState.userRecords) == null ? void 0 : a[s]) || [];
      if (u.length > 0) {
        const g = u[u.length - 1], p = r.findIndex((f) => f.userId === s && f.points === g.points);
        if (p !== -1) {
          const [f] = r.splice(p, 1);
          r.unshift(f);
        }
      }
      return r;
    }
    const d = this.createRankingEntries(t), i = n === "rate" ? "rate" : "wins", o = d.sort((l, r) => (r[i] ?? 0) - (l[i] ?? 0)).map((l, r) => ({ ...l, rank: r + 1 })), c = o.findIndex((l) => l.userId === s);
    if (c > 0) {
      const [l] = o.splice(c, 1);
      o.unshift(l);
    }
    return o;
  }
  createRankingEntries(t) {
    const e = this.gameState.userRankings || [];
    return Object.entries(t).map(([s, a]) => {
      const n = e.find((l) => l.userId === s), d = a.draws ?? (n == null ? void 0 : n.draws) ?? 0, i = a.wins ?? (n == null ? void 0 : n.wins) ?? 0, o = a.points ?? (n == null ? void 0 : n.points) ?? 0, c = a.totalPoints ?? (n == null ? void 0 : n.totalPoints) ?? 0;
      return { userId: s, name: a.name || "Unknown", draws: d, wins: i, points: o, totalPoints: c, rank: a.rank ?? (n == null ? void 0 : n.rank) ?? 0, rate: d > 0 ? i / d * 100 : 0 };
    });
  }
  createPlaceholders(t, e, s, a) {
    var n;
    const { rankMode: d } = this.settings, i = t.draws ?? 0, o = a.enableCount > 0 && i > a.enableCount;
    if (d === "point") {
      const r = ((n = this.gameState.userRecords) == null ? void 0 : n[s]) || [], u = r[r.length - 1];
      if (u) {
        const g = this.calculateRank(u, e, s);
        return { announceMessage: o ? `${u.name}さんは上限を超えているから、参考記録だよ。` : `${u.name}さんの${u.points}は、${g}位だよ。`, winsCount: String(u.wins ?? 0), winsRank: g, winsRate: "0.0", totalDraws: String(r.length), totalPoints: String(t.totalPoints ?? 0) };
      }
    }
    const c = this.calculateRank(t, e, s), l = i > 0 ? ((t.wins || 0) / i * 100).toFixed(1) : "0.0";
    return { announceMessage: o ? `${t.name}さんは上限を超えているから、参考記録だよ。` : `${t.name}さんの順位は、${c}位だよ。`, winsCount: String(t.wins ?? 0), winsRank: c, winsRate: l, totalDraws: String(i), totalPoints: String(t.totalPoints ?? 0) };
  }
  calculateRank(t, e, s) {
    if (this.settings.rankMode === "point") {
      const n = t.points ?? 0, d = e.filter((i) => (i.points ?? 0) > n).length;
      return String(d + 1);
    }
    const a = e.findIndex((n) => n.userId === s);
    return a >= 0 ? String(a + 1) : "不明";
  }
}(), D = "Unknown", P = { MIN: 0.7, MAX: 1.3 }, I = 3, E = 1, O = 8.5, U = 2, W = 6;
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
    this.postArray = [{ delaySeconds: E, wordParty: "🍒" }, { delaySeconds: O, wordParty: "!パパッ" }];
  }
  playSmallItems() {
    this.gameConfig.small.forEach((e) => {
      const s = new X(e).draw();
      this.totalPoints += s.pointsEarned, this.addEmojiEffects(e.party, s.wins);
    });
  }
  playBigItems() {
    let e = I;
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
    return I - e > Math.random() * W;
  }
  addEmojiEffects(e, s) {
    const a = Math.floor(s / U);
    for (let n = 0; n < a; n++) this.addEffect(e);
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
    const a = this.item.times ?? 0;
    for (let n = 0; n < a; n++) this.isWin() && (e += this.item.points, s++);
    return { pointsEarned: e, wins: s };
  }
  isWin() {
    return 100 * Math.random() < this.item.chance;
  }
}
const H = new class {
  settings = { rankingLimit: 10, isParty: !0, enableCount: 5 };
  gameState = $("GouseiSuika");
  LogRank = B;
  setup(t) {
    this.settings = { ...this.settings, ...t }, this.LogRank.setup({ rankMode: "point" });
  }
  run(t, e) {
    const { mode: s } = e, { isParty: a, enableCount: n } = this.settings, d = this.executeGame(s), i = this.LogRank.run(t, { enableCount: n, isWin: !1, getPoint: d.points });
    return this.gameState = this.LogRank.getGameState(), { postActions: a ? d.postArray : [], placeholders: { ...i.placeholders, message: this.createResultMessage(t, d.points), points: String(d.points) } };
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
    return `${(t == null ? void 0 : t.data.displayName) ?? D}の得点は${e}!`;
  }
}(), q = { スイカゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 300, damage: 1, party: "🍐" }, { chance: 25, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 100, points: 1e3, damage: 0, party: "🍉" }] }, カボチャゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 150, damage: 0, party: "🍬" }, { chance: 33, points: 300, damage: 1, party: "🍐" }, { chance: 33, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 50, points: 1e3, damage: 0, party: "🍉" }, { chance: 100, points: 1200, damage: 0, party: "🎃" }] }, クジラゲーム: { small: [{ chance: 50, times: 5, points: 11, party: "!クマノミ" }, { chance: 50, times: 5, points: 22, party: "!クラゲ" }, { chance: 50, times: 5, points: 33, party: "!フグ" }, { chance: 50, times: 5, points: 44, party: "!カニ" }, { chance: 50, times: 5, points: 55, party: "!マグロ、ご期待ください" }], big: [{ chance: 33, points: 300, damage: 1, party: "!ウミガメ" }, { chance: 33, points: 350, damage: 1, party: "!マンボウ" }, { chance: 33, points: 400, damage: 1, party: "!ジンベエザメ" }, { chance: 33, points: 450, damage: 1, party: "!シャチ" }, { chance: 100, points: 500, damage: 0, party: "!クジラ" }] } }, w = { name: "gousei-suika", version: "0.0.4", displayName: "スイカジェネレーター", description: "米兜科技 合成大西瓜風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スイカ"] }, J = { xs: { scoreCircle: "w-32 h-32", text: { large: "text-base", xlarge: "text-2xl", medium: "text-sm", small: "text-[8px]" }, rankingImage: "w-4 h-4", rankingNumber: "w-4 h-3 leading-3 text-[8px]", container: { padding: "p-0", itemPadding: "px-0 py-0", imageMargin: "mr-0" } }, sm: { scoreCircle: "w-40 h-40", text: { large: "text-lg", xlarge: "text-3xl", medium: "text-base", small: "text-[10px]" }, rankingImage: "w-5 h-5", rankingNumber: "w-5 h-3.5 leading-3.5 text-[10px]", container: { padding: "p-0.5", itemPadding: "px-0.5 py-0", imageMargin: "mr-0.5" } }, md: { scoreCircle: "w-48 h-48", text: { large: "text-xl", xlarge: "text-4xl", medium: "text-lg", small: "text-xs" }, rankingImage: "w-6 h-6", rankingNumber: "w-6 h-4 leading-4 text-xs", container: { padding: "p-1", itemPadding: "px-1 py-0.5", imageMargin: "mr-1" } }, lg: { scoreCircle: "w-56 h-56", text: { large: "text-2xl", xlarge: "text-5xl", medium: "text-xl", small: "text-sm" }, rankingImage: "w-8 h-8", rankingNumber: "w-8 h-6 leading-6 text-xs", container: { padding: "p-2", itemPadding: "px-2 py-1", imageMargin: "mr-2" } }, xl: { scoreCircle: "w-64 h-64", text: { large: "text-3xl", xlarge: "text-6xl", medium: "text-2xl", small: "text-base" }, rankingImage: "w-10 h-10", rankingNumber: "w-10 h-8 leading-8 text-sm", container: { padding: "p-3", itemPadding: "px-3 py-1.5", imageMargin: "mr-3" } } }, K = { class: m(["overflow-hidden max-h-fit"]) }, Q = { class: "list-none p-0 m-0 space-y-1" }, Y = ["src", "alt"], Z = { class: "flex justify-center items-center flex-1" }, te = { id: w.name, name: w.displayName, description: w.description, version: w.version, author: w.author, tags: w.keywords, url: "", execute: H, settings: [{ id: "isParty", name: "フルーツをWordPartyで降らせるか", description: "ON:降らせる(別途専用WordPartyが必要) / OFF:OFF", inputType: "boolean", defaultValue: !0 }, { id: "rankingLimit", name: "上位何位まで表示させるか", description: "大きくしすぎるとはみ出ます。", inputType: "number", defaultValue: 10 }, { id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5, min: 0, max: 100 }], params: [{ id: "mode", name: "モード", description: "降ってくるアイテムや得点が変わります", inputType: "select", values: ["スイカゲーム", "カボチャゲーム", "クジラゲーム"], defaultValue: "スイカゲーム" }], placeholders: _, component: ((t, e) => {
  const s = t.__vccOpts || t;
  for (const [a, n] of e) s[a] = n;
  return s;
})(T({ __name: "component", props: { settings: {}, userRankings: {}, displaySize: {} }, setup(t) {
  const e = t, s = function(o, c) {
    const { delayMs: l, displayMs: r, immediate: u = !1, deep: g = !0 } = c, p = N(!1);
    let f = null, k = null;
    const v = () => {
      f && (clearTimeout(f), f = null), k && (clearTimeout(k), k = null);
    }, M = () => {
      v(), p.value = !1, f = setTimeout(() => {
        p.value = !0, k = setTimeout(() => {
          p.value = !1;
        }, r);
      }, l);
    };
    return A(o, (S) => {
      (Array.isArray(S) ? S.length > 0 : S) && M();
    }, { immediate: u, deep: g }), L(() => {
      v();
    }), { isVisible: p, manualStart: () => {
      M();
    }, manualHide: () => {
      v(), p.value = !1;
    }, clearTimers: v };
  }(() => e.userRankings, { delayMs: 4500, displayMs: 5e3 }), a = R(() => J[e.displaySize]), n = R(() => {
    const o = e.userRankings[0] || null, c = [...e.userRankings].sort((l, r) => (r == null ? void 0 : r.points) ?? 0 - ((l == null ? void 0 : l.points) ?? 0));
    return { showResult: !!o, result: { score: (o == null ? void 0 : o.points) || 0, name: (o == null ? void 0 : o.name) || "プレイヤー" }, rankPlayers: c.slice(0, e.settings.rankingLimit), totalCount: e.userRankings.length, totalPoint: e.userRankings.reduce((l, r) => l + ((r == null ? void 0 : r.points) ?? 0), 0) };
  }), d = R(() => {
    const o = n.value;
    return o.totalCount > 0 ? Math.round(o.totalPoint / o.totalCount) : 0;
  }), i = (o) => {
    const c = "flex items-center font-bold rounded-lg shadow-sm";
    switch (o) {
      case 0:
        return `${c} text-amber-800 bg-gradient-to-r from-amber-200 to-amber-100 border-l-4 border-amber-400 ${a.value.container.itemPadding}`;
      case 1:
        return `${c} text-blue-800 bg-gradient-to-r from-blue-200 to-blue-100 border-l-4 border-blue-400 ${a.value.container.itemPadding}`;
      case 2:
        return `${c} text-orange-800 bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-400 ${a.value.container.itemPadding}`;
      default:
        return `${c} text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300 ${a.value.container.itemPadding}`;
    }
  };
  return (o, c) => (b(), x(C, null, [F(s).isVisible.value ? (b(), x("div", { key: 0, class: m(["rounded-full mx-auto relative whitespace-nowrap flex flex-col justify-center items-center -mb-8", "bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border-4 border-blue-200", "bubble-animation shadow-blue-200/50", a.value.scoreCircle]) }, [h("div", { class: m(["font-bold text-blue-900 font-rocknroll", a.value.text.large]) }, "スコア", 2), h("div", { class: m(["font-bold font-mochiy bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent", a.value.text.xlarge]) }, y(n.value.result.score), 3), h("div", { class: m(["mt-2 font-bold text-blue-900 font-rocknroll", a.value.text.large]) }, y(n.value.result.name), 3)], 2)) : j("", !0), h("div", { class: m(["bg-amber-50 border-4 border-amber-400 rounded-3xl font-rocknroll", a.value.container.padding]) }, [h("div", { class: m(["text-center mb-2 text-amber-800 font-bold drop-shadow-lg", a.value.text.large]) }, " 🍉スイカランキング🍉 ", 2), h("div", K, [h("ul", Q, [(b(!0), x(C, null, V(n.value.rankPlayers, (l, r) => (b(), x("li", { key: r, class: m(i(r)) }, [r < 3 ? (b(), x("img", { key: 0, src: `img/image_${r + 1}.png`, alt: `${r + 1}位`, class: m(["inline-block rounded-full border-2 border-white shadow-md", a.value.rankingImage, a.value.container.imageMargin]) }, null, 10, Y)) : (b(), x("span", { key: 1, class: m(["inline-block font-bold text-center rounded-lg bg-gray-200 text-gray-700", a.value.rankingNumber, a.value.container.imageMargin]) }, y(r + 1), 3)), h("span", Z, [h("span", { class: m(["font-bold mr-2", a.value.text.medium]) }, y(l.points), 3), h("span", { class: m(["text-gray-600", a.value.text.medium]) }, "(" + y(l.name) + ")", 3)])], 2))), 128))])]), h("div", { class: m(["p-0 m-0 flex justify-center items-center w-full text-gray-600 mt-2", a.value.text.small]) }, " 平均: " + y(d.value) + "pt (" + y(n.value.totalCount) + "回 / 総計" + y(n.value.totalPoint) + "pt) ", 3)], 2)], 64));
} }), [["__scopeId", "data-v-e7d98acf"]]) };
export {
  te as default
};
