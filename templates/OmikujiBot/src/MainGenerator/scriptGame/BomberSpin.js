class h {
  static DEFAULT_USER_NAME = "Unknown";
  static WIN_RATE_MULTIPLIER = 100;
  settings = { rankMode: "wins" };
  setup(t) {
    this.settings = t;
  }
  run(t, e, s) {
    const n = e == null ? void 0 : e.data.userId;
    if (!n) throw new Error("User ID is required");
    try {
      const i = this.updateUserStats(t.userStats, e, s, n), r = this.generateRankings(t, i, s, n);
      return { placeholders: this.calculatePlaceholders(i[n], r, n), gameState: { ...t, rankings: r, userStats: i }, postActions: [] };
    } catch (i) {
      throw console.error("Game execution error:", i), new Error("ゲーム実行中にエラーが発生しました");
    }
  }
  updateUserStats(t, e, s, n) {
    const i = { ...t[n] ?? { userId: n, name: e.data.name, draws: 0 } }, { isWin: r, getPoint: o } = s, { rankMode: a } = this.settings;
    return r && (i.wins = a === "point" ? 1 : (i.wins || 0) + 1), o > 0 && (i.points = a === "point" ? o : (i.points || 0) + o), a !== "point" && (i.draws = (i.draws || 0) + 1), { ...t, [n]: i };
  }
  generateRankings(t, e, s, n) {
    if (!s.isRank) return t.rankings || [];
    switch (this.settings.rankMode) {
      case "point":
        return this.generatePointRankings(e, n);
      case "wins":
      case "rate":
      case "totalPoints":
        return this.generateTotalRankings(t, e, n);
      default:
        return console.warn(`Unknown rank mode: ${this.settings.rankMode}. Using total rankings.`), this.generateTotalRankings(t, e, n);
    }
  }
  generatePointRankings(t, e) {
    const s = t[e];
    return s ? [{ userId: e, name: s.name || h.DEFAULT_USER_NAME, points: s.points || 0, rank: 1 }] : (console.warn(`User stats not found for userId: ${e}`), []);
  }
  generateTotalRankings(t, e, s) {
    const n = t.rankings || [], i = Object.entries(e).map(([a, d]) => {
      const u = n.find((k) => k.userId === a), m = d.draws ?? (u == null ? void 0 : u.draws) ?? 0, b = d.wins ?? (u == null ? void 0 : u.wins) ?? 0, R = d.points ?? (u == null ? void 0 : u.points) ?? 0;
      return { userId: a, name: d.name || h.DEFAULT_USER_NAME, draws: m, wins: b, points: R, rate: m > 0 ? b / m * h.WIN_RATE_MULTIPLIER : 0 };
    }), r = this.getSortKey(), o = i.sort((a, d) => {
      const u = a[r] ?? 0;
      return (d[r] ?? 0) - u;
    }).map((a, d) => ({ ...a, rank: d + 1 }));
    return this.prioritizeCurrentUser(o, s);
  }
  getSortKey() {
    return { wins: "wins", rate: "rate", point: "points", totalPoints: "points" }[this.settings.rankMode] || "wins";
  }
  prioritizeCurrentUser(t, e) {
    const s = t.findIndex((r) => r.userId === e);
    if (s === -1) return t;
    const n = [...t], [i] = n.splice(s, 1);
    return n.unshift(i), n;
  }
  calculatePlaceholders(t, e, s) {
    const n = String(t.wins ?? 0);
    let i;
    if (this.settings.rankMode === "point") {
      const r = t.points ?? 0, o = e.filter((a) => (a.points ?? 0) > r).length;
      i = String(o + 1);
    } else {
      const r = e.findIndex((o) => o.userId === s);
      i = r >= 0 ? String(r + 1) : "不明";
    }
    return { winsCount: n, winsRank: i, winsRate: (t.draws > 0 ? (t.wins ?? 0) / t.draws * h.WIN_RATE_MULTIPLIER : 0).toFixed(1) };
  }
}
const L = new h();
class f {
  static DEFAULT_USER_NAME = "Unknown";
  settings = { isBomber: "ON" };
  winChan;
  setup(t) {
    this.settings = t, this.winChan = L, this.winChan.setup({ rankMode: "point" });
  }
  run(t, e, s) {
    const { isRank: n } = s, { isBomber: i } = this.settings, { symbol: r, img: o, payout: a, message: d } = function(R) {
      var k;
      const A = P([12, 11, 10, 9, 8, 7, 6, 5]) + 1, N = Math.max(2, Math.min(7, A - Math.floor(4 * Math.random()))), I = P([14, 13, 12, 11, 10, 9, 8, 7]), { symbol: M, img: v, payouts: U } = C[I];
      let c = 7 - Math.floor(3 * Math.random()), l = U[7 - c + S(c)];
      l < 10 && l++;
      let E = `${R}の${M}スピン!${l}/`;
      for (let p = N; p > 0; p--) {
        const T = (20 - 2 * I + 20 / p) / 100;
        c -= Array(c).fill(0).reduce((O) => O + +(Math.random() < T), 0);
        let w = U[7 - c + S(c)];
        w < 10 && w++, l += w, E += p === 1 ? `${w}!` : `${w}/`;
      }
      const F = ((k = $.find(([p]) => l >= p)) == null ? void 0 : k[1]) || "";
      return E += F + `合計${l}枚獲得!`, { symbol: M, img: v, payout: l, message: E };
    }((e == null ? void 0 : e.data.displayName) ?? f.DEFAULT_USER_NAME), u = { isWin: "OFF", getPoint: a, isRank: n }, m = this.winChan.run(t, e, u), { winsRank: b } = m.placeholders;
    return { postActions: i === "ON" ? [{ delaySeconds: 0, wordParty: "!bombback" }, { delaySeconds: 0, wordParty: o }, { delaySeconds: 1.8, wordParty: "!bombfire" }] : [], placeholders: { message: d, symbol: r, payout: String(a), winsRank: b }, gameState: m.gameState };
  }
}
const _ = new f(), C = [{ payouts: [0, 0, 1, 2, 10, 40, 200, 1e3], symbol: "チェリー", img: "!bombcherry" }, { payouts: [0, 0, 1, 2, 15, 60, 300, 1500], symbol: "オレンジ", img: "!bomborange" }, { payouts: [0, 0, 1, 4, 20, 80, 400, 2e3], symbol: "プラム", img: "!bombplam" }, { payouts: [0, 0, 2, 6, 30, 120, 600, 3e3], symbol: "スイカ", img: "!bombmelon" }, { payouts: [0, 1, 2, 8, 40, 160, 800, 4e3], symbol: "ベル", img: "!bombbell" }, { payouts: [0, 1, 2, 10, 50, 200, 1e3, 5e3], symbol: "ハット", img: "!bombhut" }, { payouts: [0, 1, 3, 15, 60, 240, 1200, 6e3], symbol: "BAR", img: "!bombBAR" }, { payouts: [0, 1, 4, 30, 80, 320, 2e3, 8e3], symbol: "セブン", img: "!bombseven" }], $ = [[1e4, "👑JACKPOT👑"], [5e3, "💎EPIC WIN💎"], [2500, "♕FEVER♕"], [1e3, "🎯大当り🎯"], [500, "✌あたり✌"]];
function P(y) {
  const t = y.reduce((s, n) => s + n, 0);
  let e = Math.random() * t;
  return y.findIndex((s) => (e -= s, e <= 0));
}
const S = (y) => Array(y).fill(0).reduce((t) => t + +(Math.random() < 1 / 16), 0), g = { name: "bomber-spin", version: "0.0.2", description: "APPLI BOMBERSPIN2風のおみくじ", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スロット"] }, x = { id: g.name, name: g.name, description: g.description, version: g.version, author: g.author, tags: g.keywords, url: "", banner: "", execute: _, settings: [{ id: "isBomber", name: "WordPartyで音を鳴らすか", description: "ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない", inputType: "select", values: ["ON", "OFF"], defaultValue: "ON" }], params: [{ id: "isRank", name: "結果をランキングに入れるか", description: "OFFなら、ランキングに影響を与えません", inputType: "select", values: ["ON", "OFF"], defaultValue: "ON" }], placeholders: [{ id: "message", name: "標準メッセージ", description: "デフォルトのボンバースピンの返答", value: "userのセブンスピン!1/4/8000!合計$8004枚獲得!" }, { id: "symbol", name: "シンボル", description: "当選した図柄を返します", value: "セブン" }, { id: "payout", name: "獲得したポイント", description: "獲得したポイントを返します", value: "8004" }, { id: "winsRank", name: "順位", description: "今回の順位を返します", value: "1" }] };
export {
  x as default
};
