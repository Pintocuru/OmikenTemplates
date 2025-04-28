// src/apps/scripts/partyService.ts
import { CounterConfig } from './schema';
import { postWordParty, postSystemMessage } from '@common/api/PostOneComme';

export function createPartyService(counterConfig: CounterConfig, isCountdown: boolean) {
 // イベント条件に応じてWordParty/Botメッセージを発火
 const triggerParty = (eventMessage: string | undefined) => {
  if (eventMessage) postWordParty(eventMessage, -2);
 };
 const triggerBot = (eventMessage: string | undefined) => {
  if (eventMessage) postSystemMessage(eventMessage, counterConfig.BOT_NAME);
 };

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
  const isCountDecreasing = newCount < oldCount;

  // イベント発火条件
  const shouldFireEvent = (!isCountdown && isCountIncreasing) || (isCountdown && isCountDecreasing);
  if (shouldFireEvent) {
   triggerParty(counterConfig.PARTY_EVENT);
   triggerBot(counterConfig.BOT_EVENT);
  }

  // 特定のカウント数に達した場合のメッセージ
  triggerParty(counterConfig.PARTY[newCount]);
  triggerBot(counterConfig.BOT[newCount]);

  // 目標達成時の成功イベント
  const isSuccess = isCountdown
   ? newCount === 0
   : getActualCount() >= counterConfig.targetCountdown;

  if (isSuccess) {
   triggerParty(counterConfig.PARTY_SUCCESS);
   triggerBot(counterConfig.BOT_SUCCESS);
  }
 };
}
