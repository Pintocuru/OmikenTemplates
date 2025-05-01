// src/apps/scripts/partyService.ts
import { CounterConfig } from './schema';
import { postWordParty, postSystemMessage } from '@common/api/PostOneComme';

export function createPartyService(counterConfig: CounterConfig) {
 // イベント条件に応じてWordParty/Botメッセージを発火
 const triggerParty = (msg?: string) => msg && postWordParty(msg, -2);
 const triggerBot = (msg?: string) => msg && postSystemMessage(msg, counterConfig.BOT_NAME);

 // カウントの変化に基づいてパーティーイベントを処理
 return (
  newCount: number,
  oldCount: number,
  isInitialized: boolean,
  getActualCount: () => number
 ) => {
  if (!isInitialized) return;

  // カウントの変化方向を確認
  const isCountIncreasing = newCount > oldCount;

  // イベント発火条件
  if (isCountIncreasing) {
   triggerParty(counterConfig.PARTY_EVENT);
   triggerBot(counterConfig.BOT_EVENT);
  }

  // 特定のカウント数に達した場合のメッセージ
  triggerParty(counterConfig.PARTY[newCount]);
  triggerBot(counterConfig.BOT[newCount]);

  // 目標達成時の成功イベント
  if (getActualCount() >= counterConfig.targetCountdown) {
   triggerParty(counterConfig.PARTY_SUCCESS);
   triggerBot(counterConfig.BOT_SUCCESS);
  }
 };
}
