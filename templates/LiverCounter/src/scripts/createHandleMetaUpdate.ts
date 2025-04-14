// createHandleMetaUpdate.ts
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { WordCounterState } from './types';

// メタ情報の更新を受け取るコールバック
export function createHandleMetaUpdate(state: WordCounterState) {
 return (meta: ServiceMeta | null) => {
  if (meta) {
   // 配信状態の更新
   state.isLive = meta.isLive || false;

   // 高評価数の更新
   if (meta.upVote) {
    // upVoteが文字列の場合、数値に変換
    const upVoteNum = parseInt(meta.upVote, 10);
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

   // 初期化フラグを更新（最初のメタデータ取得時）
   if (!state.isInitFlag) state.isInitFlag = true;
  }
 };
}
