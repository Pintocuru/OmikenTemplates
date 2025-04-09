const componentConfig = {
 color: 'green',
 isHorizontalLayout: true,
 totalCounterSet: null
};

const counterSets = [
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
   unit: 'コメ',
   countMode: 'comment',
   targetCountdown: 0,
   multiplier: 1,
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
   countMode: 'comment',
   unit: 'おは!',
   targetCountdown: 0,
   multiplier: 1,
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
   unit: '人',
   countMode: 'syoken',
   targetCountdown: 0,
   multiplier: 1,
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
   unit: '',
   countMode: 'viewer',
   targetCountdown: 0,
   multiplier: 10,
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
   unit: '',
   countMode: 'upVote',
   targetCountdown: 0,
   multiplier: 10,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 }
];
if (typeof window !== 'undefined') window.componentConfig = componentConfig;
if (typeof window !== 'undefined') window.counterSets = counterSets;
