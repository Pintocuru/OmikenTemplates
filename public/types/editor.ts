// src/types/editor.ts
import {
  OmikenTypeMap,
  OmikenType,
  CharaType,
  PresetType,
  TypesType,
} from "./index";

// エディター用型定義

// AppEditer
export interface AppEditerType {
  Omiken: OmikenType;
  Presets: Record<string, OmikenType>; // preset:Omiken
  Charas: Record<string, CharaType>; // preset:Chara
  Scripts: Record<string, PresetType>; // preset:Script
}

// メインカテゴリーの型
export type CategoryMain = ListCategory | "presets";
export type CategorySub = {
  types: never;
  rules: never;
  omikujis: never;
  places: never;
  presets: "Omiken" | "Chara" | "Script";
};
export type CategoryActive<T extends CategoryMain = CategoryMain> = {
  main: T; // 現在選択されているメインカテゴリー
  sub?: CategorySub[T]; // メインカテゴリーに対応するサブカテゴリー（オプショナル）
};

// リスト用カテゴリー
export type ListCategory = "types" | "rules" | "omikujis" | "places";
export type ListType = OmikenTypeMap[ListCategory];
export type ListEntry<T extends ListCategory> = {
  isOpen: boolean; // ダイアログの開閉状態
  type: T;
  mode: string | null; // 表示モード
  key: string | string[] | null;
};
// listEntry全体の型
export type ListEntryCollect = {
  [K in ListCategory]: ListEntry<K>;
};

// ファイル操作用
export type OmikenEntry<T extends ListCategory> = {
  type: T;
  update?: T extends "types" ? never : OmikenTypeMap[T];
  addKeys?: AddKeysCategory[T];
  delKeys?: T extends "types" ? TypesType[] : string | string[];
  reTypes?: T extends "types" ? Record<TypesType, string[]> : never;
};

type AddKeysCategory = {
  types: never;
  rules: PartialListItem<"rules"> & { types?: TypesType };
  omikujis:
    | (PartialListItem<"omikujis"> & { rulesId?: string })
    | (PartialListItem<"omikujis"> & { rulesId?: string })[];
  places: PartialListItem<"places"> | PartialListItem<"places">[];
};

// addItem用のPartial型(一部のキーだけでデータを作成できる)
type PartialListItem<T extends ListCategory> = Partial<OmikenTypeMap[T]>;

// おみくじデータ付きpresetデータ
export interface PresetOmikenType extends PresetType {
  item: OmikenType;
  mode?: "overwrite" | "append"; // 追加方法(上書き/追加)
}
