// src/ConfigMaker/script/useScriptSettingsStore.ts - スクリプト設定専用store
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';

export const useScriptSettingsStore = defineStore('scriptSettings', () => {
 const omikujiStore = useOmikujiStore();

 const settings = computed(() => omikujiStore.data.scriptSettings);

 /**
  * TODO:
  * scriptSettings は、予め MainGenerator と共用という形で
  * Scriptsを用意する必要がある
  * (CROSの関係で動的には読めない)
  */

 const update = (key: string, newSettings: Record<string, any>) => {
  omikujiStore.data.scriptSettings[key] = newSettings;
 };

 const remove = (key: string) => {
  delete omikujiStore.data.scriptSettings[key];
 };

 const get = (key: string) => {
  return omikujiStore.data.scriptSettings[key] || {};
 };

 return {
  settings,
  update,
  remove,
  get
 };
});
