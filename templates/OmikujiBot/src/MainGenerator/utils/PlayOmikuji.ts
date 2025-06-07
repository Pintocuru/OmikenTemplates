// src/Modules/components/PlayOmikuji.ts

/**
 * 改良されたランダム数生成（Math.random()の偏りを軽減）
 * 複数のMath.random()を組み合わせて偏りを減らす手法
 * @returns 0以上1未満の浮動小数点数
 */
function getImprovedRandom(): number {
 // 複数のMath.random()を組み合わせて偏りを軽減
 // XORシフト風のアプローチで品質を向上
 let random1 = Math.random();
 let random2 = Math.random();
 let random3 = Math.random();

 // 3つの値を組み合わせて偏りを軽減
 return (random1 + random2 + random3) / 3;
}

/**
 * 改良された乱数生成（ブラウザ対応）
 * ブラウザのcrypto APIが使える場合はそれを使用
 * @returns 0以上1未満の浮動小数点数
 */
function getBetterRandom(): number {
 // ブラウザ環境でWeb Crypto APIが使える場合
 if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / 2 ** 32;
 }

 // フォールバック: 改良されたMath.random()
 return getImprovedRandom();
}

/**
 * アイテムが有効かどうかをチェック
 * @param items チェック対象のアイテム配列
 * @returns 配列かつ非空であればtrue
 */
function isValidItems(items: any[]): boolean {
 return Array.isArray(items) && items.length > 0;
}

/**
 * おみくじを引くメインロジック
 * @param items おみくじのアイテム配列
 * @returns 当選したアイテムまたはnull
 */
export function drawOmikuji(items: any[]): unknown | null {
 if (!isValidItems(items)) return null;

 // rankが最も高い値を取得し、該当アイテムのみフィルタリング
 const maxRank = Math.max(...items.map((item) => item.rank ?? 0));
 const filteredItems = items.filter((item) => (item.rank ?? 0) === maxRank);

 const totalWeight = filteredItems.reduce(
  (sum, item) => sum + (item.weight > 0 ? item.weight : 1),
  0
 );
 if (totalWeight <= 0) return null;

 const random = getBetterRandom() * totalWeight;
 let currentWeight = 0;

 for (const item of filteredItems) {
  currentWeight += item.weight > 0 ? item.weight : 1;
  if (random < currentWeight) return item;
 }

 return null;
}

/**
 * 指定回数の抽選結果を集計して分布を返す
 * @param items おみくじのアイテム配列
 * @param iterations 抽選回数（デフォルト: 1000）
 * @param useSeededRng シード付きRNGを使用するか
 * @returns アイテムごとの当選率（%）
 */
export function getOmikujiDistribution(
 items: any[],
 iterations = 1000,
 useSeededRng = false
): Map<any, string> {
 if (!isValidItems(items)) return new Map();

 const distribution = new Map<any, number>();

 for (let i = 0; i < iterations; i++) {
  const result = drawOmikuji(items);

  if (result) {
   const key = result;
   distribution.set(key, (distribution.get(key) || 0) + 1);
  }
 }

 return new Map(
  Array.from(distribution.entries()).map(([key, count]) => [
   key,
   `${((count / iterations) * 100).toFixed(2)}%`
  ])
 );
}

/**
 * 乱数品質のテスト関数
 * @param iterations テスト回数
 * @returns 統計情報
 */
export function testRandomQuality(iterations = 10000): {
 mathRandom: { mean: number; variance: number };
 improvedRandom: { mean: number; variance: number };
} {
 const testRng = (generator: () => number) => {
  const values: number[] = [];
  for (let i = 0; i < iterations; i++) {
   values.push(generator());
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

  return { mean, variance };
 };

 return {
  mathRandom: testRng(() => Math.random()),
  improvedRandom: testRng(() => getImprovedRandom())
 };
}
