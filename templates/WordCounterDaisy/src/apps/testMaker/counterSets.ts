// テスト
import { CounterSet } from '@/scripts/schema';

// 複数のカウンターセットがある前提
export const counterSets: CounterSet[] = [
 {
  id: 'test3',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: 'コメント数',
   COUNT_MODE: 'comment',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
 {
  id: 'test3',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: ['おはよう', 'おはぴん', 'こんにち']
  },
  counter: {
   title: '「おはよう」',
   COUNT_MODE: 'comment',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
 {
  id: 'test3',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'all',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: '初見',
   COUNT_MODE: 'syoken',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
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
   title: '閲覧数',
   COUNT_MODE: 'viewer',
   TARGET_DOWN: 0,
   MULTIPLIER: 10,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
 {
  id: 'test2',
  userVisits: {
   IS_DIFF_MODE: true,
   ENABLED_SERVICES: 'all',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: 'いいね！',
   COUNT_MODE: 'upVote',
   TARGET_DOWN: 0,
   MULTIPLIER: 10,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 }
];
