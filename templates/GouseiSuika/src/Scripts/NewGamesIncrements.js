const s = { name: "new-games-increments", version: "0.0.1", description: "ジェネレーター用のGames生成・インクリメント機能", author: "Pintocuru", keywords: ["ポイント", "ランキング", "スイカ"] }, o = { id: s.name, name: s.name, description: s.description, version: s.version, author: s.author, tags: s.keywords, url: "", banner: "", func: (a, e, n) => {
  const r = { ...a, ruleId: "", draws: (a == null ? void 0 : a.draws) ?? 0, totalDraws: (a == null ? void 0 : a.totalDraws) ?? 0, settings: (a == null ? void 0 : a.settings) ?? [], currentUserIds: (a == null ? void 0 : a.currentUserIds) ?? [], userStats: (a == null ? void 0 : a.userStats) ?? {} }, t = e == null ? void 0 : e.data.userId;
  return t && !r.userStats[t] && (r.userStats[t] = { userId: t, name: e.data.name, draws: 0, totalDraws: 0 }), r.draws++, r.totalDraws++, t && (r.userStats[t].draws++, r.userStats[t].totalDraws++), { postArray: [], placeholder: {}, game: r };
}, ApiCall: async (a, e, n) => {
  try {
    const r = await fetch("/api/endpoint", { method: e, headers: { "Content-Type": "application/json" }, body: e === "GET" ? void 0 : JSON.stringify(n) });
    if (!r.ok) throw new Error(`API request failed with status ${r.status}`);
    return { status: "success", game: a, message: "API request successful", data: await r.json() };
  } catch (r) {
    return { status: "error", game: a, message: r instanceof Error ? r.message : "An unknown error occurred", data: null };
  }
}, scriptParams: [], placeholders: [] };
export {
  o as default
};
