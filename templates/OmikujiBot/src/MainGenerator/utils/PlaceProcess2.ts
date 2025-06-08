// src/Modules/tasks/PlaceProcess2.ts
// 250605_型定義変更のため作り直し
import {
 OmikujiSet,
 PlaceholderSource,
 PlaceholderSourceValue,
 PostAction
} from '@/types/OmikujiTypes';
import { drawOmikuji } from './PlayOmikuji';

/**
 * プレースホルダー置換処理を行うクラス
 * おみくじデータ内の<<key>>形式のプレースホルダーを実際の値に置換する
 */
export class PlaceProcess {
 private resolvedValues: Record<string, string | number> = {};
 private readonly placeholderSources: Record<string, PlaceholderSource>;

 // 正規表現をクラスレベルで定義して再利用
 private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g;

 constructor(placeholderSources: Record<string, PlaceholderSource>) {
  this.placeholderSources = placeholderSources;
 }

 /**
  * 解決済みプレースホルダーを追加/更新
  */
 updateResolvedValues(data: Record<string, string | number>): void {
  Object.assign(this.resolvedValues, data);
 }

 /**
  * おみくじデータのプレースホルダーを置換して返す
  */
 processOmikuji(omikuji: OmikujiSet): PostAction[] {
  if (omikuji.placeholderIds?.length > 0) {
   this.resolvePlaceholders(omikuji.placeholderIds);
  }

  return omikuji.postActions.map((action) => ({
   ...action,
   messageContent: this.replacePlaceholders(action.messageContent),
   messageToast: this.replacePlaceholders(action.messageToast),
   wordParty: this.replacePlaceholders(action.wordParty)
  }));
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
  const source = this.placeholderSources[placeholderId];
  if (!source || source.name in this.resolvedValues) {
   return;
  }

  visitedIds.add(placeholderId);

  try {
   // 依存する子プレースホルダーを先に解決
   for (const childId of source.placeholderIds) {
    this.resolvePlaceholderRecursively(childId, visitedIds);
   }

   // 値を抽選して解決
   if (source.values.length > 0) {
    const selectedValue = drawOmikuji(source.values) as PlaceholderSourceValue;
    if (selectedValue?.content !== undefined) {
     this.resolvedValues[source.name] = selectedValue.content;
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
    const value = this.resolvedValues[key.trim()];
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
