// src/Modules/tasks/PlaceProcess2.ts
import { OmikujiSetType, PlaceholderType, PlaceholderValueType, PostActionType } from '@type/';
import { drawOmikuji } from './PlayOmikuji';

/**
 * プレースホルダー置換処理を行うクラス
 * おみくじデータ内の<<key>>形式のプレースホルダーを実際の値に置換する
 */
export class PlaceProcess {
 private resolvedValues: Record<string, string | number> = {};
 private readonly placeholderSources: Record<string, PlaceholderType>;
 private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g; // 正規表現パターン

 constructor(placeholderSources: Record<string, PlaceholderType>) {
  this.placeholderSources = placeholderSources;
 }

 /**
  * 解決済みプレースホルダーを追加/更新
  */
 updateResolvedValues(data: Record<string, string | number | boolean>): void {
  Object.assign(this.resolvedValues, data);
 }

 /**
  * おみくじデータのプレースホルダーを置換して返す
  */
 processOmikuji(omikuji: OmikujiSetType): PostActionType[] {
  // 使用されているプレースホルダーIDを収集
  const usedPlaceholderIds = this.collectUsedPlaceholderIds(omikuji);

  // 収集したプレースホルダーを解決
  if (usedPlaceholderIds.length > 0) {
   this.resolvePlaceholders(usedPlaceholderIds);
  }

  return omikuji.postActions.map((action) => ({
   ...action,
   messageContent: this.replacePlaceholders(action.messageContent),
   messageToast: this.replacePlaceholders(action.messageToast),
   wordParty: this.replacePlaceholders(action.wordParty)
  }));
 }

 /**
  * おみくじデータから使用されているプレースホルダーIDを収集
  */
 private collectUsedPlaceholderIds(omikuji: OmikujiSetType): string[] {
  const placeholderIds = new Set<string>();

  // postActionsから収集
  omikuji.postActions.forEach((action) => {
   this.extractPlaceholderIds(action.wordParty, placeholderIds);
   this.extractPlaceholderIds(action.messageContent, placeholderIds);
   this.extractPlaceholderIds(action.messageToast, placeholderIds);
  });

  // placeholderSourcesのcontentからも収集（再帰的に）
  const allIds = Array.from(placeholderIds);
  const processedIds = new Set<string>();

  while (allIds.length > 0) {
   const currentId = allIds.pop()!;
   if (processedIds.has(currentId)) continue;

   processedIds.add(currentId);

   // 該当するプレースホルダーを探す
   const placeholder = this.findPlaceholderById(currentId);
   if (placeholder) {
    // そのプレースホルダーのvalues内のcontentからも収集
    placeholder.values.forEach((value) => {
     this.extractPlaceholderIds(value.content, placeholderIds);
    });

    // 新しく見つかったIDを処理キューに追加
    placeholderIds.forEach((id) => {
     if (!processedIds.has(id)) {
      allIds.push(id);
     }
    });
   }
  }

  return Array.from(placeholderIds);
 }

 /**
  * 文字列からプレースホルダーIDを抽出
  */
 private extractPlaceholderIds(text: string | null | undefined, placeholderIds: Set<string>): void {
  if (!text) return;

  const matches = text.matchAll(PlaceProcess.PLACEHOLDER_PATTERN);
  for (const match of matches) {
   const placeholderId = match[1].trim();
   if (placeholderId) {
    placeholderIds.add(placeholderId);
   }
  }
 }

 /**
  * IDに対応するプレースホルダーを検索
  */
 private findPlaceholderById(id: string): PlaceholderType | null {
  // placeholderSources内でidが一致するものを検索
  for (const [key, placeholder] of Object.entries(this.placeholderSources)) {
   if (placeholder.id === id) {
    return placeholder;
   }
  }
  return null;
 }

 /**
  * 指定されたプレースホルダーIDリストを解決
  */
 private resolvePlaceholders(placeholderIds: string[]): void {
  const visitedIds = new Set<string>();

  for (const placeholderId of placeholderIds) {
   this.resolvePlaceholderRecursively(placeholderId, visitedIds);
  }
 }

 /**
  * 単一のプレースホルダーを再帰的に解決
  * 循環参照を防ぐため、visitedセットを使用
  */
 private resolvePlaceholderRecursively(placeholderId: string, visitedIds: Set<string>): void {
  // 循環参照チェック
  if (visitedIds.has(placeholderId)) {
   console.warn(`循環参照を検出: ${placeholderId}`);
   return;
  }

  // 既に解決済みの場合はスキップ
  if (placeholderId in this.resolvedValues) {
   return;
  }

  // 該当するプレースホルダーを検索
  const source = this.findPlaceholderById(placeholderId);
  if (!source) {
   console.warn(`プレースホルダーが見つかりません: ${placeholderId}`);
   return;
  }

  visitedIds.add(placeholderId);

  try {
   // 依存する子プレースホルダーを先に解決
   const childIds = new Set<string>();
   source.values.forEach((value) => {
    this.extractPlaceholderIds(value.content, childIds);
   });

   for (const childId of childIds) {
    this.resolvePlaceholderRecursively(childId, visitedIds);
   }

   // 値を抽選して解決
   if (source.values.length > 0) {
    const selectedValue = drawOmikuji(source.values) as PlaceholderValueType;
    if (selectedValue?.content !== undefined) {
     // プレースホルダーIDをキーとして解決済み値を保存
     this.resolvedValues[placeholderId] = selectedValue.content;
    }
   }
  } finally {
   visitedIds.delete(placeholderId);
  }
 }

 /**
  * 文字列内のプレースホルダーを置換
  * 効率化のため、最大置換回数を制限
  */
 private replacePlaceholders(text: string | null | undefined): string {
  if (!text) return '';

  let result = text;
  let replacementCount = 0;
  const maxReplacements = 10; // 無限ループ防止

  while (replacementCount < maxReplacements) {
   const beforeReplacement = result;

   result = result.replace(PlaceProcess.PLACEHOLDER_PATTERN, (match, key) => {
    const placeholderId = key.trim();
    const value = this.resolvedValues[placeholderId];
    return value !== undefined ? String(value) : match;
   });

   // 置換が発生しなかった場合は終了
   if (result === beforeReplacement) {
    break;
   }

   replacementCount++;
  }

  if (replacementCount >= maxReplacements) {
   console.warn(`プレースホルダー置換の最大回数に達しました: ${text}`);
  }

  return result;
 }

 /**
  * デバッグ用: 解決済みプレースホルダーの一覧を取得
  */
 getResolvedValues(): Record<string, string | number> {
  return { ...this.resolvedValues };
 }

 /**
  * 解決済みプレースホルダーをクリア
  */
 clearResolvedValues(): void {
  this.resolvedValues = {};
 }
}
