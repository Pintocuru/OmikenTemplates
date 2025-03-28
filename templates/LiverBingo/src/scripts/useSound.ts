// src/scripts/useSound.ts

import clickSound from '@assets/sound/決定ボタンを押す12.mp3';
import hoverSound from '@assets/sound/決定ボタンを押す2.mp3';
import resetSound from '@assets/sound/ゲージ回復3.mp3';
import cheersSound from '@assets/sound/歓声と拍手.mp3';
import singleSound from '@assets/sound/「おめでとうございます」.mp3';
import multi1Sound from '@assets/sound/「すごいすごい」.mp3';
import multi2Sound from '@assets/sound/「エクセレント」.mp3';

export function useSound() {
 const sounds = {
  click: new Audio(clickSound),
  hover: new Audio(hoverSound),
  reset: new Audio(resetSound),
  cheers: new Audio(cheersSound),
  single: new Audio(singleSound),
  multi_1: new Audio(multi1Sound),
  multi_2: new Audio(multi2Sound)
 };

 const playSound = (soundName: keyof typeof sounds) => {
  const sound = sounds[soundName];
  sound.currentTime = 0;
  sound.play();
 };

 return {
  soundClick: () => playSound('click'),
  soundHover: () => playSound('hover'),
  soundReset: () => playSound('reset'),
  soundCheers: () => playSound('cheers'),
  soundSingle: () => playSound('single'),
  soundMulti: () => {
   const randomKey = Math.random() < 0.5 ? 'multi_1' : 'multi_2';
   playSound(randomKey);
  }
 };
}
