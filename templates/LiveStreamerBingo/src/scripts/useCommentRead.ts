// composables/useCommentRead.ts
import { onMounted, reactive, ref, watch } from 'vue';
import { BingoItem } from './types';
import { createProcessComment } from './CreateProcessComment';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserComments } from '@common/subscribe/GetUserComments';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';

export function useCommentRead() {
 // State to manage initialization
 const state = reactive({
  isInitFlag: false,
  configUser: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: [],
   ALLOWED_IDS: [],
   IS_GIFT: false,
   KEYWORDS: []
  }
 });

 // ビンゴ内容が変化する度に取得する条件も変化させる
 const initializeGetUserVisits = (newConfig: ConfigUserType) => {
  // Update config
  state.configUser = newConfig;

  // フィルタリングしたコメントを取得
  const { fetchComments: userFetch } = GetUserComments(state.configUser);
  // Re-initialize fetchComments with the new config
  const { fetchComments: visitFetch } = GetUserVisits(state.configUser);
  // コメントを受け取った時の処理
  const { processCommentUser, processCommentVisit } = createProcessComment();

  // Execute fetchComments
  userFetch((comments) => {
   processCommentUser(comments);
  });
  visitFetch((visits) => {
   processCommentVisit(visits);
  });
 };

 return { initializeGetUserVisits };
}
