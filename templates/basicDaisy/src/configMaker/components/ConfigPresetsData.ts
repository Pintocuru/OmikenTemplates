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
  id: 'test3',
  name: '初コメカウンター',
  config: {
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
     component: 'BasicCircle',
     typeColor: 'pink',
     title: '初コメ',
     unit: '人',
     countMode: 'syoken',
     targetCountdown: 10,
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
     component: 'BasicCircle',
     typeColor: 'blue',
     title: 'リスナー',
     unit: '人',
     countMode: 'user',
     targetCountdown: 30,
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
     component: 'BasicCircle',
     typeColor: 'green',
     title: 'コメント',
     unit: '',
     countMode: 'comment',
     targetCountdown: 500,
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
  ]
 },
 {
  id: 'test1',
  name: '視聴者数・高評価',
  config: {
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
     component: 'instaUpVote',
     typeColor: 'default',
     title: '',
     unit: '',
     countMode: 'viewer',
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
     component: 'instaUpVote',
     typeColor: 'default',
     title: '',
     unit: '',
     countMode: 'upVote',
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
  ]
 },
 {
  id: 'test2',
  name: 'おはようカウンター',
  config: {
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
     component: 'BasicSquare',
     typeColor: 'default',
     title: 'おはようカウンター',
     unit: 'おは!',
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
  ]
 },
 {
  id: 'test4',
  name: '今日のランチ代',
  config: {
   totalCounterSet: {
    component: 'instaUpVote',
    typeColor: 'default',
    title: '今日のランチ代',
    unit: '円',
    countMode: 'none',
    targetCountdown: 0,
    multiplier: 1,
    PARTY: {},
    PARTY_EVENT: '',
    PARTY_SUCCESS: '',
    BOT_NAME: '',
    BOT: {},
    BOT_EVENT: '',
    BOT_SUCCESS: ''
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
     component: 'CyberNeon',
     typeColor: 'red',
     title: '初コメ',
     unit: '',
     countMode: 'syoken',
     targetCountdown: 0,
     multiplier: 10,
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
     component: 'CyberNeon',
     typeColor: 'yellow',
     title: 'あいさつ',
     unit: '',
     countMode: 'user',
     targetCountdown: 0,
     multiplier: 5,
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
     component: 'CyberNeon',
     typeColor: 'green',
     title: 'コメント',
     unit: '',
     countMode: 'comment',
     targetCountdown: 0,
     multiplier: 0.1,
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
     component: 'CyberNeon',
     typeColor: 'blue',
     title: '同接数',
     unit: '',
     countMode: 'viewer',
     targetCountdown: 0,
     multiplier: 5,
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
     component: 'CyberNeon',
     typeColor: 'purple',
     title: '高評価',
     unit: '',
     countMode: 'upVote',
     targetCountdown: 0,
     multiplier: 5,
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
     component: 'CyberNeon',
     typeColor: 'pink',
     title: 'ギフト',
     unit: '',
     countMode: 'gift',
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
  ]
 },
 {
  id: 'test6',
  name: 'アル&ビィ投票',
  config: {
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
     component: 'holographic',
     typeColor: 'red',
     title: '猫使アル',
     unit: '',
     countMode: 'user',
     targetCountdown: 0,
     multiplier: 1,
     PARTY: {},
     PARTY_EVENT: '',
     PARTY_SUCCESS: '!目標達成',
     BOT_NAME: 'info',
     BOT: {},
     BOT_EVENT: '',
     BOT_SUCCESS: ''
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
     component: 'holographic',
     typeColor: 'blue',
     title: '猫使ビィ',
     unit: '',
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
   }
  ]
 }
];
