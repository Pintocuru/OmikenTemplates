import { ref as A, watch as N, onUnmounted as L, defineComponent as T, computed as P, createElementBlock as y, openBlock as b, Fragment as C, createCommentVNode as j, createElementVNode as g, unref as F, normalizeClass as m, toDisplayString as x, renderList as V } from "vue";
const _ = ["announceMessage", "totalDraws", "winsRank", "totalPoints"], B = [{ id: "message", name: "標準メッセージ", description: "デフォルトのスイカジェネレーターの返答", value: "userの得点は1500!" }, { id: "points", name: "ポイント", description: "スイカジェネレーターの得点を返します", value: "1500" }, ...[{ id: "announceMessage", name: "アナウンス", description: "ランキングの順位を表示します", value: "userさんの順位は、4位だよ。" }, { id: "totalDraws", name: "このおみくじをした回数", description: "この配信でのおみくじした回数を返します", value: "10" }, { id: "winsCount", name: "勝利数(勝ち負けがある場合)", description: "コメントしたユーザーの、配信枠内での勝数を返します", value: "2" }, { id: "winsRank", name: "ユーザーの順位", description: "パラメータのランキングモードを参照し、配信枠内での順位を数値で返します", value: "4" }, { id: "winsRate", name: "ユーザーの勝率(%)", description: "コメントしたユーザーの、配信枠内での勝率を返します", value: "20.0" }, { id: "totalPoints", name: "ユーザーの総得点", description: "コメントしたユーザーの、配信枠内での総得点を返します", value: "100" }].filter((t) => _.includes(t.id))];
function I(t, e) {
  return { ruleId: t, totalDraws: 0, userStats: {}, currentUserIds: [], ...e };
}
const D = new class {
  settings = { rankMode: "wins" };
  gameState = I("LogRank");
  setup(t) {
    this.settings = t, this.gameState = I("LogRank"), this.gameState.userRecords || (this.gameState.userRecords = {});
  }
  run(t, e) {
    try {
      const s = t.data.userId, a = this.updateUserStats(s, t.data.name, e), n = this.generateRankings(a, e, s), c = a[s];
      return e.enableCount > 0 && e.enableCount < ((c == null ? void 0 : c.draws) || 0) || (this.gameState = { ...this.gameState, userStats: a, rankings: n }), { placeholders: this.createPlaceholders(a[s], n, s, e), postActions: [], rankingList: n };
    } catch (s) {
      throw console.error("Game execution error:", s), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  updateUserStats(t, e, s) {
    const { isWin: a, getPoint: n } = s, { rankMode: c } = this.settings;
    if (c === "point") {
      this.gameState.userRecords || (this.gameState.userRecords = {}), this.gameState.userRecords[t] || (this.gameState.userRecords[t] = []);
      const o = { userId: t, name: e, draws: 1, wins: a ? 1 : 0, points: n, totalPoints: n, rank: 0, rate: 0 };
      this.gameState.userRecords[t].push(o);
      const l = { userId: t, name: e, draws: this.gameState.userRecords[t].length, wins: a ? 1 : 0, points: n, totalPoints: this.gameState.userRecords[t].reduce((d, i) => d + i.points, 0), rank: 0, rate: 0 };
      return { ...this.gameState.userStats, [t]: l };
    }
    {
      const o = { ...this.gameState.userStats[t] ?? { userId: t, name: e, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } };
      return n > 0 && (o.points = (o.points || 0) + n, o.totalPoints = (o.totalPoints || 0) + n), a && (o.wins = (o.wins || 0) + 1), o.draws = (o.draws || 0) + 1, { ...this.gameState.userStats, [t]: o };
    }
  }
  generateRankings(t, e, s) {
    var a;
    const { rankMode: n } = this.settings;
    if (n === "point") {
      const i = [];
      this.gameState.userRecords && Object.values(this.gameState.userRecords).forEach((p) => {
        i.push(...p);
      });
      const r = i.sort((p, u) => (u.points ?? 0) - (p.points ?? 0)).map((p, u) => ({ ...p, rank: u + 1 })), f = ((a = this.gameState.userRecords) == null ? void 0 : a[s]) || [];
      if (f.length > 0) {
        const p = f[f.length - 1], u = r.findIndex((h) => h.userId === s && h.points === p.points);
        if (u !== -1) {
          const [h] = r.splice(u, 1);
          r.unshift(h);
        }
      }
      return r;
    }
    const c = this.createRankingEntries(t), o = n === "rate" ? "rate" : "wins", l = c.sort((i, r) => (r[o] ?? 0) - (i[o] ?? 0)).map((i, r) => ({ ...i, rank: r + 1 })), d = l.findIndex((i) => i.userId === s);
    if (d > 0) {
      const [i] = l.splice(d, 1);
      l.unshift(i);
    }
    return l;
  }
  createRankingEntries(t) {
    const e = this.gameState.rankings || [];
    return Object.entries(t).map(([s, a]) => {
      const n = e.find((i) => i.userId === s), c = a.draws ?? (n == null ? void 0 : n.draws) ?? 0, o = a.wins ?? (n == null ? void 0 : n.wins) ?? 0, l = a.points ?? (n == null ? void 0 : n.points) ?? 0, d = a.totalPoints ?? (n == null ? void 0 : n.totalPoints) ?? 0;
      return { userId: s, name: a.name || "Unknown", draws: c, wins: o, points: l, totalPoints: d, rank: a.rank ?? (n == null ? void 0 : n.rank) ?? 0, rate: c > 0 ? o / c * 100 : 0 };
    });
  }
  createPlaceholders(t, e, s, a) {
    var n;
    const { rankMode: c } = this.settings;
    if (c === "point") {
      const i = ((n = this.gameState.userRecords) == null ? void 0 : n[s]) || [], r = i[i.length - 1];
      if (r) {
        const f = this.calculateRank(r, e, s);
        return { announceMessage: `${r.name}さんの最新記録は${r.points}ポイントで、${f}位だよ。`, winsCount: String(r.wins ?? 0), winsRank: f, winsRate: "0.0", totalDraws: String(i.length), totalPoints: String(t.totalPoints ?? 0) };
      }
    }
    const o = a.enableCount > 0 && a.enableCount < t.draws, l = this.calculateRank(t, e, s), d = t.draws > 0 ? ((t.wins || 0) / t.draws * 100).toFixed(1) : "0.0";
    return { announceMessage: o ? `${t.name}さんは上限を超えているから、参考記録だよ。` : `${t.name}さんの順位は、${l}位だよ。`, winsCount: String(t.wins ?? 0), winsRank: l, winsRate: d, totalDraws: String(t.draws ?? 0), totalPoints: String(t.totalPoints ?? 0) };
  }
  calculateRank(t, e, s) {
    if (this.settings.rankMode === "point") {
      const n = t.points ?? 0, c = e.filter((o) => (o.points ?? 0) > n).length;
      return String(c + 1);
    }
    const a = e.findIndex((n) => n.userId === s);
    return a >= 0 ? String(a + 1) : "不明";
  }
}(), O = "Unknown", R = { MIN: 0.7, MAX: 1.3 }, E = 3, $ = 1, U = 8.5, W = 2, z = 6;
class G {
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
    this.postArray = [{ delaySeconds: $, wordParty: "🍒" }, { delaySeconds: U, wordParty: "!パパッ" }];
  }
  playSmallItems() {
    this.gameConfig.small.forEach((e) => {
      const s = new X(e).draw();
      this.totalPoints += s.pointsEarned, this.addEmojiEffects(e.party, s.wins);
    });
  }
  playBigItems() {
    let e = E;
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
    return E - e > Math.random() * z;
  }
  addEmojiEffects(e, s) {
    const a = Math.floor(s / W);
    for (let n = 0; n < a; n++) this.addEffect(e);
  }
  addEffect(e) {
    this.postArray.push({ delaySeconds: $, wordParty: e });
  }
  calculateFinalScore() {
    const e = R.MIN + Math.random() * (R.MAX - R.MIN);
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
  settings = { rankingLimit: 10, isParty: !0 };
  LogRank = D;
  setup(t) {
    this.settings = t, this.LogRank.setup({ rankMode: "point" });
  }
  run(t, e) {
    const { enableCount: s, mode: a } = e, { isParty: n } = this.settings, c = this.executeGame(a), o = this.LogRank.run(t, { enableCount: s, isWin: !1, getPoint: c.points });
    return { postActions: n ? c.postArray : [], placeholders: { ...o.placeholders, message: this.createResultMessage(t, c.points), points: String(c.points) }, rankingList: o.rankingList };
  }
  executeGame(t) {
    const e = q[t];
    if (!e) throw new Error(`不明なゲームモード: ${t}`);
    return new G(e).play();
  }
  createResultMessage(t, e) {
    return `${(t == null ? void 0 : t.data.displayName) ?? O}の得点は${e}!`;
  }
}(), q = { スイカゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 300, damage: 1, party: "🍐" }, { chance: 25, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 100, points: 1e3, damage: 0, party: "🍉" }] }, カボチャゲーム: { small: [{ chance: 67, times: 15, points: 1, party: "🍓" }, { chance: 50, times: 15, points: 3, party: "🍇" }, { chance: 50, times: 10, points: 10, party: "🍊" }, { chance: 50, times: 8, points: 20, party: "🦪" }, { chance: 67, times: 5, points: 50, party: "🍎" }], big: [{ chance: 25, points: 150, damage: 0, party: "🍬" }, { chance: 33, points: 300, damage: 1, party: "🍐" }, { chance: 33, points: 400, damage: 1, party: "🍍" }, { chance: 33, points: 500, damage: 2, party: "🍑" }, { chance: 33, points: 700, damage: 2, party: "🍈" }, { chance: 50, points: 1e3, damage: 3, party: "🍉" }, { chance: 50, points: 1e3, damage: 0, party: "🍉" }, { chance: 100, points: 1200, damage: 0, party: "🎃" }] }, クジラゲーム: { small: [{ chance: 50, times: 5, points: 11, party: "!クマノミ" }, { chance: 50, times: 5, points: 22, party: "!クラゲ" }, { chance: 50, times: 5, points: 33, party: "!フグ" }, { chance: 50, times: 5, points: 44, party: "!カニ" }, { chance: 50, times: 5, points: 55, party: "!マグロ、ご期待ください" }], big: [{ chance: 33, points: 300, damage: 1, party: "!ウミガメ" }, { chance: 33, points: 350, damage: 1, party: "!マンボウ" }, { chance: 33, points: 400, damage: 1, party: "!ジンベエザメ" }, { chance: 33, points: 450, damage: 1, party: "!シャチ" }, { chance: 100, points: 500, damage: 0, party: "!クジラ" }] } }, w = { name: "gousei-suika", version: "0.0.4", description: "米兜科技 合成大西瓜風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スイカ"] }, J = { xs: { scoreCircle: "w-36 h-36", text: { large: "text-xl", xlarge: "text-3xl", medium: "text-lg", small: "text-xs" }, rankingImage: "w-6 h-6", rankingNumber: "w-6 h-4 leading-4 text-xs", container: { padding: "p-1", itemPadding: "px-1 py-0.5", imageMargin: "mr-1" } }, sm: { scoreCircle: "w-48 h-48", text: { large: "text-2xl", xlarge: "text-4xl", medium: "text-xl", small: "text-sm" }, rankingImage: "w-8 h-8", rankingNumber: "w-8 h-6 leading-6 text-xs", container: { padding: "p-2", itemPadding: "px-2 py-1", imageMargin: "mr-2" } }, md: { scoreCircle: "w-64 h-64", text: { large: "text-3xl", xlarge: "text-5xl", medium: "text-2xl", small: "text-base" }, rankingImage: "w-10 h-10", rankingNumber: "w-10 h-8 leading-8 text-sm", container: { padding: "p-3", itemPadding: "px-3 py-1.5", imageMargin: "mr-3" } }, lg: { scoreCircle: "w-72 h-72", text: { large: "text-3xl", xlarge: "text-6xl", medium: "text-2xl", small: "text-base" }, rankingImage: "w-12 h-12", rankingNumber: "w-12 h-10 leading-10 text-base", container: { padding: "p-4", itemPadding: "px-4 py-2", imageMargin: "mr-4" } }, xl: { scoreCircle: "w-80 h-80", text: { large: "text-4xl", xlarge: "text-7xl", medium: "text-3xl", small: "text-lg" }, rankingImage: "w-16 h-16", rankingNumber: "w-16 h-12 leading-12 text-xl", container: { padding: "p-5", itemPadding: "px-5 py-2", imageMargin: "mr-5" } } }, K = { class: m(["overflow-hidden max-h-fit"]) }, Q = { class: "list-none p-0 m-0 space-y-1" }, Y = ["src", "alt"], Z = { class: "flex justify-center items-center flex-1" }, te = { id: w.name, name: w.name, description: w.description, version: w.version, author: w.author, tags: w.keywords, url: "", execute: H, settings: [{ id: "isParty", name: "フルーツをWordPartyで降らせるか", description: "ON:降らせる(別途専用WordPartyが必要) / OFF:OFF", inputType: "boolean", defaultValue: !0 }, { id: "rankingLimit", name: "上位何位まで表示させるか", description: "大きくしすぎるとはみ出ます。", inputType: "number", defaultValue: 10 }], params: [{ id: "mode", name: "モード", description: "降ってくるアイテムや得点が変わります", inputType: "select", values: ["スイカゲーム", "カボチャゲーム", "クジラゲーム"], defaultValue: "スイカゲーム" }, { id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5, min: 0, max: 100 }], placeholders: B, component: ((t, e) => {
  const s = t.__vccOpts || t;
  for (const [a, n] of e) s[a] = n;
  return s;
})(T({ __name: "component", props: { settings: {}, userRanking: {}, displaySize: {} }, setup(t) {
  const e = t, s = function(l, d) {
    const { delayMs: i, displayMs: r, immediate: f = !1, deep: p = !0 } = d, u = A(!1);
    let h = null, k = null;
    const v = () => {
      h && (clearTimeout(h), h = null), k && (clearTimeout(k), k = null);
    }, M = () => {
      v(), u.value = !1, h = setTimeout(() => {
        u.value = !0, k = setTimeout(() => {
          u.value = !1;
        }, r);
      }, i);
    };
    return N(l, (S) => {
      (Array.isArray(S) ? S.length > 0 : S) && M();
    }, { immediate: f, deep: p }), L(() => {
      v();
    }), { isVisible: u, manualStart: () => {
      M();
    }, manualHide: () => {
      v(), u.value = !1;
    }, clearTimers: v };
  }(() => e.userRanking, { delayMs: 4500, displayMs: 5e3 }), a = P(() => J[e.displaySize]), n = P(() => {
    const l = e.userRanking[0] || null, d = [...e.userRanking].sort((i, r) => r.points - i.points);
    return { showResult: !!l, result: { score: (l == null ? void 0 : l.points) || 0, name: (l == null ? void 0 : l.name) || "プレイヤー" }, rankPlayers: d.slice(0, e.settings.rankingLimit), totalCount: e.userRanking.length, totalPoint: e.userRanking.reduce((i, r) => i + r.points, 0) };
  }), c = P(() => {
    const l = n.value;
    return l.totalCount > 0 ? Math.round(l.totalPoint / l.totalCount) : 0;
  }), o = (l) => {
    const d = "flex items-center font-bold rounded-lg shadow-sm";
    switch (l) {
      case 0:
        return `${d} text-amber-800 bg-gradient-to-r from-amber-200 to-amber-100 border-l-4 border-amber-400 ${a.value.container.itemPadding}`;
      case 1:
        return `${d} text-blue-800 bg-gradient-to-r from-blue-200 to-blue-100 border-l-4 border-blue-400 ${a.value.container.itemPadding}`;
      case 2:
        return `${d} text-orange-800 bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-400 ${a.value.container.itemPadding}`;
      default:
        return `${d} text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300 ${a.value.container.itemPadding}`;
    }
  };
  return (l, d) => (b(), y(C, null, [F(s).isVisible.value ? (b(), y("div", { key: 0, class: m(["rounded-full mx-auto relative whitespace-nowrap flex flex-col justify-center items-center -mb-8", "bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border-4 border-blue-200", "bubble-animation shadow-blue-200/50", a.value.scoreCircle]) }, [g("div", { class: m(["font-bold text-blue-900 font-rocknroll", a.value.text.large]) }, "スコア", 2), g("div", { class: m(["font-bold font-mochiy bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent", a.value.text.xlarge]) }, x(n.value.result.score), 3), g("div", { class: m(["mt-2 font-bold text-blue-900 font-rocknroll", a.value.text.large]) }, x(n.value.result.name), 3)], 2)) : j("", !0), g("div", { class: m(["bg-amber-50 border-4 border-amber-400 rounded-3xl font-rocknroll", a.value.container.padding]) }, [g("div", { class: m(["text-center mb-2 text-amber-800 font-bold drop-shadow-lg", a.value.text.large]) }, " 🍉スイカランキング🍉 ", 2), g("div", K, [g("ul", Q, [(b(!0), y(C, null, V(n.value.rankPlayers, (i, r) => (b(), y("li", { key: r, class: m(o(r)) }, [r < 3 ? (b(), y("img", { key: 0, src: `img/image_${r + 1}.png`, alt: `${r + 1}位`, class: m(["inline-block rounded-full border-2 border-white shadow-md", a.value.rankingImage, a.value.container.imageMargin]) }, null, 10, Y)) : (b(), y("span", { key: 1, class: m(["inline-block font-bold text-center rounded-lg bg-gray-200 text-gray-700", a.value.rankingNumber, a.value.container.imageMargin]) }, x(r + 1), 3)), g("span", Z, [g("span", { class: m(["font-bold mr-2", a.value.text.medium]) }, x(i.points), 3), g("span", { class: m(["text-gray-600", a.value.text.medium]) }, "(" + x(i.name) + ")", 3)])], 2))), 128))])]), g("div", { class: m(["p-0 m-0 flex justify-center items-center w-full text-gray-600 mt-2", a.value.text.small]) }, " 平均: " + x(c.value) + "pt (" + x(n.value.totalCount) + "回 / 総計" + x(n.value.totalPoint) + "pt) ", 3)], 2)], 64));
} }), [["__scopeId", "data-v-e070a716"]]) };
export {
  te as default
};
