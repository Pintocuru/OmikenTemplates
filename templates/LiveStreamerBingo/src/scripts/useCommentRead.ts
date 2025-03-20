// composables/useCommentRead.ts
import { onMounted, ref, watch } from 'vue';
import { BingoItem } from './types';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';

export function useCommentRead() {
 let config: ConfigUserType = {
  IS_DIFF_MODE: false,
  ENABLED_SERVICES: [],
  ALLOWED_IDS: [],
  IS_GIFT: false,
  KEYWORDS: []
 };

 // State to manage initialization
 const state = ref({
  isInitFlag: false
 });

 //
 const initializeGetUserVisits = (newConfig: ConfigUserType) => {
  // Update config
  config = newConfig;

  // Re-initialize fetchComments with the new config
  const { fetchComments } = GetUserVisits(config);

  // Execute fetchComments
  fetchComments((visits) => {
   processComment(visits);
  });
 };

 // Watch for changes in config and re-initialize
 watch(
  () => config,
  (newConfig) => {
   initializeGetUserVisits(newConfig);
  },
  { immediate: true }
 );

 // Initial mount
 onMounted(() => {
  initializeGetUserVisits(config);
 });

 return {};
}
