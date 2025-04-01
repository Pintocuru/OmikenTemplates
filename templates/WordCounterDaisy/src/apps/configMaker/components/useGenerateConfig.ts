// src/apps/configMaker/components/useGenerateConfig.ts
import { Ref } from 'vue';
import { CounterSet } from '@/scripts/schema';

// 定数
const CONFIG_FILE_NAME = 'config.js';
const CONFIG_MIME_TYPE = 'application/javascript';

export function useGenerateConfig(counterSets: Ref<CounterSet[]>) {
 // JavaScript設定ファイルの内容を生成
 const buildConfigFileContent = (): string => {
  return (
   `const config = ${JSON.stringify(counterSets.value, null, 2)};\n` +
   `if (typeof window !== 'undefined') window.counterSets = config;`
  );
 };

 // 設定をファイルとしてダウンロード
 const generateConfig = async (): Promise<boolean> => {
  try {
   const content = buildConfigFileContent();
   const blob = new Blob([content], { type: CONFIG_MIME_TYPE });
   const url = URL.createObjectURL(blob);

   const link = document.createElement('a');
   Object.assign(link, { href: url, download: CONFIG_FILE_NAME, style: { display: 'none' } });

   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(url);

   return true;
  } catch (error) {
   console.error('Error generating config file:', error);
   return false;
  }
 };

 return {
  generateConfig
 };
}
