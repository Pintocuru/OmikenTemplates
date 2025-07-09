// src/apps/configMaker/components/ConfigPresetsData.ts に追加
import { ConfigUserType } from '@public/common/CommonSchema';

// プリセット型の定義
export type ConfigPreset = {
 id: string;
 name: string;
 config: ConfigUserType; // 仮データ
};

// プリセットデータ
export const presets: ConfigPreset[] = [];
