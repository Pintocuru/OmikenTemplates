// src/apps/configMaker/components/ConfigPresetsData.ts に追加
import { ComponentConfig, CounterSet } from '@/scripts/schema';

// TODO:データ変更のため修正をする

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
  id: 'test3',
  name: '初コメカウンター',
  config: {
   color: 'blue',
   totalCounterSet: null,
   isHorizontalLayout: true
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
  ]
 },
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
    id: 'counter-1744353766567',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: ['おは', 'こん']
    },
    counter: {
     title: 'あいさつ',
     unit: '',
     countMode: 'user',
     targetCountdown: 0,
     multiplier: 5,
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
     countMode: 'viewer',
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
     countMode: 'upVote',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: ''
    }
   },
   {
    id: 'counter-1744351060756',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: 'ギフト',
     unit: '',
     countMode: 'gift',
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
  id: 'test5',
  name: 'コメント耐久',
  config: {
   color: 'blue',
   totalCounterSet: null,
   isHorizontalLayout: true
  },
  counterSets: [
   {
    id: 'counter-1744351060756',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'platforms',
     ALLOWED_IDS: ['!zibun-no-ID'],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: []
    },
    counter: {
     title: '残りコメント数',
     unit: 'コメ',
     countMode: 'comment',
     targetCountdown: 500,
     multiplier: 1,
     PARTY: {
      '400': '!残り400',
      '300': '!残り300',
      '200': '!残り200',
      '100': '!残り100'
     },
     PARTY_EVENT: '',
     PARTY_SUCCESS: '!目標達成'
    }
   }
  ]
 },
 {
  id: 'test6',
  name: 'アル&ビィ投票',
  config: {
   color: 'green',
   totalCounterSet: null,
   isHorizontalLayout: true
  },
  counterSets: [
   {
    id: 'counter-1744351060756',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: ['ある', 'アル']
    },
    counter: {
     title: '猫使アル',
     unit: '',
     countMode: 'user',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: '!目標達成'
    }
   },
   {
    id: 'counter-1744369186724',
    userVisits: {
     IS_DIFF_MODE: false,
     ENABLED_SERVICES: 'all',
     ALLOWED_IDS: [],
     ACCESS_LEVEL: 1,
     IS_GIFT: false,
     KEYWORDS: ['びぃ', 'びい', 'ビィ']
    },
    counter: {
     title: '猫使ビィ',
     unit: '',
     countMode: 'user',
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
