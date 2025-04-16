const componentConfig = {
 color: 'blue',
 totalCounterSet: null,
 isHorizontalLayout: true
};
const counterSets = [
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
   title: '初コメ',
   unit: '人',
   countMode: 'syoken',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '!syoken',
   PARTY_SUCCESS: ''
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
   title: 'リスナー',
   unit: '人',
   countMode: 'user',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
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
   title: 'コメント',
   unit: 'コメ',
   countMode: 'comment',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 }
];
if (typeof window !== 'undefined') {
 window.componentConfig = componentConfig;
 window.counterSets = counterSets;
}
