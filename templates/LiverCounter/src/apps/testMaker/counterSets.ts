// テスト
import { CounterSet } from '@/scripts/schema';

// 複数のカウンターセットがある前提
export const counterSets: CounterSet[] = [
 {
  id: 'test1',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   component: 'basic',
   title: '初コメ',
   unit: '人',
   countMode: 'syoken',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '!syoken',
   PARTY_SUCCESS: '',
   BOT_NAME: 'info',
   BOT: {},
   BOT_EVENT: '',
   BOT_SUCCESS: ''
  }
 },
 {
  id: 'counter-1744322058413',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   component: 'basic',
   title: 'リスナー',
   unit: '人',
   countMode: 'user',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: '',
   BOT_NAME: 'info',
   BOT: {},
   BOT_EVENT: '',
   BOT_SUCCESS: ''
  }
 },
 {
  id: 'counter-1744322144895',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   component: 'basic',
   title: 'コメント',
   unit: 'コメ',
   countMode: 'comment',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: '',
   BOT_NAME: 'info',
   BOT: {},
   BOT_EVENT: '',
   BOT_SUCCESS: ''
  }
 }
];
