// src/apps/configMaker/components/configMaker.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
 ComponentConfig,
 componentConfigSchema,
 CounterSet,
 counterSetsSchema,
 createDefaultCounterSet,
 createDefaultComponentConfig
} from '@/scripts/schema';

// 定数
const FILE_NAME = 'config.js';
const MIME_TYPE = 'application/javascript';

export const useConfigMaker = defineStore('configMaker', () => {
 // State
 const componentConfig = ref<ComponentConfig>(
  window?.componentConfig && componentConfigSchema.safeParse(window.componentConfig).success
   ? componentConfigSchema.parse(window.componentConfig)
   : createDefaultComponentConfig()
 );

 const counterSets = ref<CounterSet[]>(
  window?.counterSets && counterSetsSchema.safeParse(window.counterSets).success
   ? counterSetsSchema.parse(window.counterSets)
   : [createDefaultCounterSet()]
 );
 const activeSetId = ref<string>(counterSets.value[0].id);

 // JavaScript設定ファイルの内容を生成
 const buildConfigFileContent = (config: ComponentConfig, sets: CounterSet[]): string => {
  return (
   `const componentConfig = ${JSON.stringify(config, null, 2)};\n` +
   `const counterSets = ${JSON.stringify(sets, null, 2)};\n` +
   `if (typeof window !== 'undefined') {\n` +
   `window.componentConfig = componentConfig;\n` +
   `window.counterSets = counterSets;\n` +
   `}`
  );
 };

 // 現在の設定をファイルとしてダウンロード
 const generateConfig = async () => {
  try {
   const currentConfig = componentConfig.value;
   const currentSets = counterSets.value;
   const content = buildConfigFileContent(currentConfig, currentSets);

   const blob = new Blob([content], { type: MIME_TYPE });
   const url = URL.createObjectURL(blob);

   const link = document.createElement('a');
   link.href = url;
   link.download = FILE_NAME;

   // リンクをDOMに追加、クリック、そして削除
   document.body.appendChild(link);
   link.click();

   // クリーンアップ
   setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
   }, 100);

   return true;
  } catch (error) {
   console.error('設定ファイルの生成中にエラーが発生しました:', error);
   return false;
  }
 };

 return {
  componentConfig,
  counterSets,
  activeSetId,
  generateConfig
 };
});
