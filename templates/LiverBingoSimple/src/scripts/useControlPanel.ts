// src/scripts/useControlPanel.ts
import { ref, Ref } from 'vue';

export function useControlPanel() {
 // コントロールパネルの表示状態
 const isControlPanelVisible: Ref<boolean> = ref(false);

 // コントロールパネルの表示・非表示を切り替え
 const toggleControlPanel = (isOpen?: boolean) => {
  if (isOpen !== undefined) isControlPanelVisible.value = isOpen;
  else isControlPanelVisible.value = !isControlPanelVisible.value;
 };

 return {
  isControlPanelVisible,
  toggleControlPanel
 };
}
