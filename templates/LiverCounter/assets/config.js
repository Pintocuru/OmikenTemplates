const componentConfig = {
  "color": "blue",
  "totalCounterSet": null,
  "isHorizontalLayout": true
};
const counterSets = [
  {
    "id": "test2",
    "userVisits": {
      "IS_DIFF_MODE": false,
      "ENABLED_SERVICES": "platforms",
      "ALLOWED_IDS": [],
      "ACCESS_LEVEL": 1,
      "IS_GIFT": false,
      "KEYWORDS": []
    },
    "counter": {
      "title": "👀",
      "unit": "",
      "countMode": "viewer",
      "targetCountdown": 0,
      "multiplier": 1,
      "PARTY": {},
      "PARTY_EVENT": "",
      "PARTY_SUCCESS": ""
    }
  },
  {
    "id": "test3",
    "userVisits": {
      "IS_DIFF_MODE": true,
      "ENABLED_SERVICES": "platforms",
      "ALLOWED_IDS": [],
      "ACCESS_LEVEL": 1,
      "IS_GIFT": false,
      "KEYWORDS": []
    },
    "counter": {
      "title": "👍️",
      "unit": "",
      "countMode": "upVote",
      "targetCountdown": 0,
      "multiplier": 1,
      "PARTY": {},
      "PARTY_EVENT": "",
      "PARTY_SUCCESS": ""
    }
  }
];
if (typeof window !== 'undefined') {
window.componentConfig = componentConfig;
window.counterSets = counterSets;
}