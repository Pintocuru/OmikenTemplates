// src/Characters/CharactersMap.ts
import { CharacterPreset } from '../types/PresetTypes.js';

export const charactersMap: Record<string, CharacterPreset> = {
 reimu: {
  id: 'reimu',
  name: 'ゆっくり霊夢',
  displayName: 'ゆっくり霊夢',
  description: '優しい振る舞いで人気者のゆっくり霊夢。じゃんけんはとても強い。',
  version: '0.0.1',
  author: 'Pintocuru',
  order: 101,
  tags: ['Yukkuri', 'Reimu'],
  url: 'https://nagipon-sozai.studio.site/',
  banner: 'reimu/Default.png',
  isIconDisplay: true,
  frameId: 'OmikenReimu',
  color: {
   nameColor: '#FFC107',
   textColor: '#ECEFF1',
   backgroundColor: '#FF4081'
  },
  image: {
   default: 'reimu/Default.png',
   happy: 'reimu/joy01.png',
   excited: 'reimu/joy04.png',
   laughing: 'reimu/relax01.png',
   blushing: 'reimu/shy02.png',
   surprised: 'reimu/surprise03.png',
   sad: 'reimu/sad01.png',
   angry: 'reimu/anger01.png',
   thinking: 'reimu/fun02.png',
   wink: 'reimu/relax03.png',
   singing: 'reimu/joy03.png',
   sleepy: 'reimu/contempt02.png'
  }
 },
 marisa: {
  id: 'marisa',
  name: 'ゆっくり魔理沙',
  displayName: 'ゆっくり魔理沙',
  description: '花とキノコが好きな、ゆっくり魔理沙。じゃんけんはちょっと弱い。',
  version: '0.0.1',
  author: 'Pintocuru',
  order: 102,
  tags: ['Yukkuri', 'Marisa'],
  url: 'https://nagipon-sozai.studio.site/',
  banner: 'marisa/Default.png',
  isIconDisplay: true,
  frameId: 'OmikenMarisa',
  color: {
   nameColor: '#FFE082',
   textColor: '#333333',
   backgroundColor: '#FF8F00'
  },
  image: {
   default: 'marisa/Default.png',
   happy: 'marisa/joy01.png',
   excited: 'marisa/joy04.png',
   laughing: 'marisa/relax01.png',
   blushing: 'marisa/shy02.png',
   surprised: 'marisa/surprise03.png',
   sad: 'marisa/sad01.png',
   angry: 'marisa/anger01.png',
   thinking: 'marisa/fun02.png',
   wink: 'marisa/relax03.png',
   singing: 'marisa/joy03.png',
   sleepy: 'marisa/contempt02.png'
  }
 }
};
