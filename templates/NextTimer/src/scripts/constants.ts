// constants.ts

export const TIME_CONSTANTS = {
 SECOND_ADJUST: 10,
 AFTER_SHOW: 5,
 COUNT_PARTY: {
  30: 'halfway',
  60: 'start'
 },
 COUNT_PARTY_START: 'start',
 COUNT_PARTY_FINISH: 'finish'
} as const;

export const TIME_PATTERNS = {
 absolute:
  /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時]([０-９0-9]{1,2})(?:[:：分ふん])?(?::?([０-９0-9]{1,2})(?:[秒びょう])?)?/g,
 relative:
  /([０-９0-9]{1,3})(?:分後|ふんご|秒後|びょうご)|(?:in\s+)([0-9]{1,3})\s+(min(?:ute)?s?|sec(?:ond)?s?)/gi
} as const;

export type CountPartyKey = keyof typeof TIME_CONSTANTS.COUNT_PARTY;
