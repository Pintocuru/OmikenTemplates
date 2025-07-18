// scriptGame/ScriptGameMap.ts
import { ScriptPreset } from '@type/';
import BomberSpin from './BomberSpin.js';
import './BomberSpin.css';
import GouseiSuika from './GouseiSuika.js';
import './GouseiSuika.css';
import DwarfBomb from './DwarfBomb.js';
import './DwarfBomb.css';
import GachaOmikuji from './GachaOmikuji.js';
import StealEmAll from './StealEmAll.js';

export const scriptGameMap: Record<string, ScriptPreset> = {
 BomberSpin,
 GouseiSuika,
 DwarfBomb
 // GachaOmikuji,
 // StealEmAll
} as const;

// 自動的にキー一覧と型を抽出（TypeScriptのみ）
export const scriptGameKeys = Object.keys(scriptGameMap);
export type ScriptGameKey = keyof typeof scriptGameMap;
