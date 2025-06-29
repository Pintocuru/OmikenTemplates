// scriptGame/ScriptGameMap.ts
import { ScriptPreset } from '@/types/PresetTypes.js';
import BomberSpin from './BomberSpin.js';
import GouseiSuika from './GouseiSuika.js';
import DwarfBomb from './DwarfBomb.js';
import GachaOmikuji from './GachaOmikuji.js';

export const scriptGameMap: Record<string, ScriptPreset> = {
 BomberSpin,
 GouseiSuika,
 DwarfBomb,
 GachaOmikuji
};
