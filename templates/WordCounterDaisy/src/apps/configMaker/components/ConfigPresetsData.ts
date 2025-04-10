// src/apps/configMaker/components/ConfigPresetsData.ts に追加
import { ComponentConfig, CounterSet } from '@/scripts/schema';

// プリセット型の定義
export type ConfigPreset = {
 id: string;
 name: string;
 config: ComponentConfig;
 counterSets: CounterSet[];
};

// プリセットデータ
export const presets: ConfigPreset[] = [
 {
  id: 'test1',
  name: '視聴者数・高評価',
  config: {
   color: 'blue',
   totalCounterSet: null,
   isHorizontalLayout: true
  },
  counterSets: [
   {
    id: 'test2',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'platforms',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: '👀',
     unit: '',
     countMode: 'viewer',
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
     IS_DIFF_MODE: true,
     ENABLED_SERVICES: 'platforms',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: '👍️',
     unit: '',
     countMode: 'upVote',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   }
  ]
 },
 {
  id: 'test2',
  name: 'おはようカウンター',
  config: {
   color: 'blue',
   totalCounterSet: null,
   isHorizontalLayout: true
  },
  counterSets: [
   {
    id: 'counter-comments',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'platforms',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: ['おは(よ|よう|よー|よ！|みこ)']
    },
    counter: {
     title: 'おはようカウンター',
     unit: 'おは!',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   }
  ]
 },
 {
  id: 'test3',
  name: '初コメカウンター',
  config: {
   color: 'blue',
   totalCounterSet: null,
   isHorizontalLayout: false
  },
  counterSets: [
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
     unit: '',
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
     unit: '',
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
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: 'コメント数',
     unit: '',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   }
  ]
 },
 {
  id: 'test4',
  name: '今日のランチ代',
  config: {
   color: 'blue',
   totalCounterSet: {
    title: '今日のランチ代',
    unit: '円',
    countMode: 'none',
    targetCountdown: 0,
    multiplier: 1,
    PARTY: {},
    PARTY_EVENT: '',
    PARTY_SUCCESS: ''
   },
   isHorizontalLayout: true
  },
  counterSets: [
   {
    id: 'counter-comments',
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
     unit: '',
     countMode: 'syoken',
     targetCountdown: 0,
     multiplier: 100,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   },
   {
    id: 'counter-1744326822126',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: 'コメント',
     unit: '',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 0.1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   },
   {
    id: 'counter-1744326895790',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: '同接数',
     unit: '',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   },
   {
    id: 'counter-1744326930064',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: '高評価',
     unit: '',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   }
  ]
 }
];
