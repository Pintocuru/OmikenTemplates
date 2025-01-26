// src/config.js

const CONFIG = {
 // リストに表示させないID
 // リスナーリストにIDが書いてあるので、それをコピーしてください
 DISALLOWED_USER_IDS: ['']
};

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
