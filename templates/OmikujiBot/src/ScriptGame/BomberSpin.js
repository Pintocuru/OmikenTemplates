function m(n, s) {
  return { ruleId: n, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
const p = new class {
  settings = { rankMode: "wins" };
  gameState = m("WinChan");
  setup(n) {
    this.settings = n, this.gameState = m("WinChan");
  }
  run(n, s) {
    try {
      const e = n.data.userId, t = this.updateUserStats(e, n.data.name, s), a = this.generateRankings(t, s, e);
      return this.gameState = { ...this.gameState, userStats: t, rankings: a }, { placeholders: this.createPlaceholders(t[e], a, e, s), postActions: [], rankingList: a };
    } catch (e) {
      throw console.error("Game execution error:", e), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  updateUserStats(n, s, e) {
    const t = { ...this.gameState.userStats[n] ?? { userId: n, name: s, draws: 0, wins: 0, points: 0, totalPoints: 0, rank: 0, rate: 0 } }, { isWin: a, getPoint: r } = e, { rankMode: o } = this.settings;
    return o === "point" ? (t.wins = a ? 1 : 0, t.points = r, t.totalPoints = (t.totalPoints || 0) + r) : (r > 0 && (t.points = (t.points || 0) + r, t.totalPoints = (t.totalPoints || 0) + r), a && (t.wins = (t.wins || 0) + 1), t.draws = (t.draws || 0) + 1), { ...this.gameState.userStats, [n]: t };
  }
  generateRankings(n, s, e) {
    if (s.enableCount > 0 && s.enableCount < n[e].draws) return this.gameState.rankings || [];
    const { rankMode: t } = this.settings;
    if (t === "point") {
      const i = n[e];
      return [{ userId: e, name: i.name || "Unknown", draws: i.draws || 0, wins: i.wins || 0, points: i.points || 0, totalPoints: i.totalPoints || 0, rank: i.rank || 0, rate: i.rate || 0 }];
    }
    const a = this.createRankingEntries(n), r = t === "rate" ? "rate" : "wins", o = a.sort((i, c) => (c[r] ?? 0) - (i[r] ?? 0)).map((i, c) => ({ ...i, rank: c + 1 })), u = o.findIndex((i) => i.userId === e);
    if (u > 0) {
      const [i] = o.splice(u, 1);
      o.unshift(i);
    }
    return o;
  }
  createRankingEntries(n) {
    const s = this.gameState.rankings || [];
    return Object.entries(n).map(([e, t]) => {
      const a = s.find((c) => c.userId === e), r = t.draws ?? (a == null ? void 0 : a.draws) ?? 0, o = t.wins ?? (a == null ? void 0 : a.wins) ?? 0, u = t.points ?? (a == null ? void 0 : a.points) ?? 0, i = t.totalPoints ?? (a == null ? void 0 : a.totalPoints) ?? 0;
      return { userId: e, name: t.name || "Unknown", draws: r, wins: o, points: u, totalPoints: i, rank: t.rank ?? (a == null ? void 0 : a.rank) ?? 0, rate: r > 0 ? o / r * 100 : 0 };
    });
  }
  createPlaceholders(n, s, e, t) {
    const a = t.enableCount > 0 && t.enableCount < n.draws, r = this.calculateRank(n, s, e), o = n.draws > 0 ? ((n.wins || 0) / n.draws * 100).toFixed(1) : "0.0";
    return { announceMessage: a ? `${n.name}さんは上限を超えているから、参考記録だよ。` : `${n.name}さんの順位は、${r}位だよ。`, winsCount: String(n.wins ?? 0), winsRank: r, winsRate: o, totalDraws: String(n.draws ?? 0), totalPoints: String(n.totalPoints ?? 0) };
  }
  calculateRank(n, s, e) {
    if (this.settings.rankMode === "point") {
      const a = n.points ?? 0, r = s.filter((o) => (o.points ?? 0) > a).length;
      return String(r + 1);
    }
    const t = s.findIndex((a) => a.userId === e);
    return t >= 0 ? String(t + 1) : "不明";
  }
}(), l = { symbols: [{ name: "チェリー", party: "!bombcherry", payouts: [0, 0, 1, 2, 10, 40, 200, 1e3] }, { name: "オレンジ", party: "!bomborange", payouts: [0, 0, 1, 2, 15, 60, 300, 1500] }, { name: "プラム", party: "!bombplam", payouts: [0, 0, 1, 4, 20, 80, 400, 2e3] }, { name: "スイカ", party: "!bombmelon", payouts: [0, 0, 2, 6, 30, 120, 600, 3e3] }, { name: "ベル", party: "!bombbell", payouts: [0, 1, 2, 8, 40, 160, 800, 4e3] }, { name: "ハット", party: "!bombhut", payouts: [0, 1, 2, 10, 50, 200, 1e3, 5e3] }, { name: "BAR", party: "!bombBAR", payouts: [0, 1, 3, 15, 60, 240, 1200, 6e3] }, { name: "セブン", party: "!bombseven", payouts: [0, 1, 4, 30, 80, 320, 2e3, 8e3] }], winMessages: [[1e4, "👑JACKPOT👑"], [5e3, "💎EPIC WIN💎"], [2500, "♕FEVER♕"], [1e3, "🎯大当り🎯"], [500, "✌あたり✌"]], spinWeights: [12, 11, 10, 9, 8, 7, 6, 5], symbolWeights: [14, 13, 12, 11, 10, 9, 8, 7], wildChance: 1 / 16, minPayout: 10 }, h = new class {
  settings = { isParty: "ON" };
  winChan = p;
  setup(n) {
    this.settings = n, this.winChan.setup({ rankMode: "point" });
  }
  run(n, s) {
    const e = (n == null ? void 0 : n.data.displayName) ?? "Unknown", t = this.playSlot(e), a = this.winChan.run(n, { enableCount: s.enableCount, isWin: !1, getPoint: t.payout });
    return { postActions: this.settings.isParty === "ON" ? [{ delaySeconds: 0, wordParty: "!bombback" }, { delaySeconds: 0, wordParty: t.party }, { delaySeconds: 1.8, wordParty: "!bombfire" }] : [], placeholders: { message: t.message, symbol: t.symbol, payout: String(t.payout), ...a.placeholders }, rankingList: a.rankingList };
  }
  playSlot(n) {
    const s = this.randomSpins(), e = this.randomSymbol();
    let t = 7 - Math.floor(3 * Math.random()), a = this.calculatePayout(e.payouts, t);
    const r = [a];
    for (let o = s; o > 0; o--) {
      const u = this.getHitRate(e, o);
      t -= this.countHits(t, u);
      const i = this.calculatePayout(e.payouts, t);
      r.push(i), a += i;
    }
    return { symbol: e.name, party: e.party, payout: a, message: this.createMessage(n, e.name, r, a) };
  }
  randomSpins() {
    const n = this.weightedSelect(l.spinWeights) + 1;
    return Math.max(2, Math.min(7, n - Math.floor(4 * Math.random())));
  }
  randomSymbol() {
    const n = this.weightedSelect(l.symbolWeights);
    return l.symbols[n];
  }
  calculatePayout(n, s) {
    const e = this.countWilds(7 - s), t = n[Math.min(7, 7 - s + e)];
    return t < l.minPayout ? t + 1 : t;
  }
  getHitRate(n, s) {
    return (20 - 2 * l.symbols.indexOf(n) + 20 / s) / 100;
  }
  countHits(n, s) {
    return Array(n).fill(0).reduce((e) => e + (Math.random() < s ? 1 : 0), 0);
  }
  countWilds(n) {
    return Array(n).fill(0).reduce((s) => s + (Math.random() < l.wildChance ? 1 : 0), 0);
  }
  createMessage(n, s, e, t) {
    var a;
    return `${n}の${s}スピン!${e.map((r, o) => o === e.length - 1 ? `${r}!` : `${r}/`).join("")}${((a = l.winMessages.find(([r]) => t >= r)) == null ? void 0 : a[1]) || ""}合計${t}枚獲得!`;
  }
  weightedSelect(n) {
    const s = n.reduce((t, a) => t + a, 0);
    let e = Math.random() * s;
    return n.findIndex((t) => (e -= t) <= 0);
  }
}(), d = { name: "bomber-spin", version: "0.0.2", description: "APPLI BOMBERSPIN2風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スロット"] }, y = { id: d.name, name: d.name, description: d.description, version: d.version, author: d.author, tags: d.keywords, url: "", execute: h, settings: [{ id: "isParty", name: "WordPartyで音を鳴らすか", description: "ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない", inputType: "select", values: ["ON", "OFF"], defaultValue: "ON" }], params: [{ id: "enableCount", name: "ランキング上限回数", description: "この回数を超える場合、結果はランキングに入りません", inputType: "number", defaultValue: 5 }], placeholders: [{ id: "message", name: "標準メッセージ", description: "デフォルトの返答", value: "userのセブンスピン!1/4/8000!合計$8004枚獲得!" }, { id: "symbol", name: "シンボル", description: "当選した図柄を返します", value: "セブン" }, { id: "payout", name: "獲得したポイント", description: "獲得したポイントを返します", value: "8004" }, { id: "winsRank", name: "順位", description: "今回の順位を返します", value: "1" }] };
export {
  y as default
};
