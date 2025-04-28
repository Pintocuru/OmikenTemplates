// src/apps/scripts/metaProcessor.ts
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { WordCounterState } from './types';

export function createMetaProcessor(state: WordCounterState) {
 return (meta: ServiceMeta | null) => {
  if (!meta) return;

  // 配信状態の更新
  state.isLive = meta.isLive || false;

  // 高評価数の更新
  if (meta.upVote) {
   const upVoteNum = parseInt(String(meta.upVote), 10);
   if (!isNaN(upVoteNum)) {
    state.upVoteCount = upVoteNum;

    // 最高値の更新
    if (upVoteNum > state.peakUpVoteCount) {
     state.peakUpVoteCount = upVoteNum;
    }
   }
  }

  // 視聴者数の更新
  if (meta.viewer !== undefined) {
   state.viewerCount = meta.viewer;

   // 最高値の更新
   if (meta.viewer > state.peakViewerCount) {
    state.peakViewerCount = meta.viewer;
   }
  }

  // 初期化完了フラグを更新
  if (!state.isInitFlag) {
   state.isInitFlag = true;
  }
 };
}
