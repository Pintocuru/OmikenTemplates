const config = [
 {
  id: 'test',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: ['platforms'],
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  generator: {
   title: 'カウンター',
   theme: 'light',
   colorMode: 'primary',
   scale: 1
  },
  counter: {
   COUNT_MODE: 'comment',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 }
];
if (typeof window !== 'undefined') window.counterSets = config;
