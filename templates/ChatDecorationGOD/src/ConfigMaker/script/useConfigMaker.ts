// src/apps/configMaker/components/configMaker.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ConfigUserType, ConfigUserSchema } from '@common/CommonSchema';

// 定数
const FILE_NAME = 'config.js';
const MIME_TYPE = 'application/javascript';

export const useConfigMaker = defineStore('configMaker', () => {
 // State
 const parsed = ConfigUserSchema.safeParse(window?.CONFIG);
 const config = ref<ConfigUserType>(parsed.success ? parsed.data : ConfigUserSchema.parse({}));

 // JavaScript設定ファイルの内容を生成
 const buildConfigFileContent = (CONFIG: ConfigUserType): string => {
  return (
   `const CONFIG = ${JSON.stringify(CONFIG, null, 2)};\n` +
   `if (typeof window !== 'undefined') {\n` +
   `window.CONFIG = CONFIG;\n` +
   `}`
  );
 };

 // 現在の設定をファイルとしてダウンロード
 const generateConfig = async () => {
  try {
   const currentConfig = config.value;
   const content = buildConfigFileContent(currentConfig);

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

 // プリセットを適用する関数
 const applyPreset = (configs: ConfigUserType) => {
  try {
   // Zodを使用して検証
   const validConfig = ConfigUserSchema.parse(configs);

   // 検証が成功したら適用
   config.value = validConfig;

   return true;
  } catch (error) {
   console.error('プリセットの適用中にエラーが発生しました:', error);
   return false;
  }
 };

 return {
  config,
  generateConfig,
  applyPreset
 };
});
