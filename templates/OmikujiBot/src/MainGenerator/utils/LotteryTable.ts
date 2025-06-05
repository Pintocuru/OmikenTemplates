// src/MainGenerator/utils/LotteryTable.ts
import { LotteryEntry } from '@/types';

// Base64画像集
const replay7 =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAQhJREFUOI2llM9VwzAMhz/xcmcDug5nrmWGsgl/MgM5Nse+jECPwARlgmYCcUjl58pWU8Lv4kiRP0mRHQGUUlLxXSPPEgF0vTkkT9euFrIneVZjxsP97ck5BZkN0A/j4oRNbvTDmOD/gYYJrOp+GM86iBQV8b1/5fPjma6dhqmqyuPTTwp4f7tDJJ7zdnechZ/2S+MDHDzPotfAvRoAEUG1OK1n8O3uCNQ/Sw3sIdFdCKuOoPnnSR1Qv1hF1ZcqjVTMwOB+8EvgUYICDvC1f0nPdlu7dsV6c0grUJw+n6AKz14iIul3Yratuc90M9tjJoPlJy5PUt1T6+ASPFotxrOLBH/paEYC8Ato3qBnx7uzrgAAAABJRU5ErkJggg==';

const Yellow7 =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAQVJREFUOI2tk8FxwjAQRZ88Nre4AfowDdFEDskhHOgBaAj3QQM+JXhi54DWLCstmCR/xjPS2n5f2i8FYCRVyNTmyLJCAMbvzx3D+QBAVbe/ZF/Ud800ruqWUiblyzF+sKJYrAEm07+otIVisf4X8GZ7uvB0cfjaPw2v6jZp62Z74u11CcQd5KD3stB9lnlVt/RdM8Hj/2HawXA+5IIO6snCrYlVIB4tmz63R3X0wAKV97ITYZRi4rQkMRdJiHr1fdfcwOF6inIXK1m1hs5V4dRnw99joF4GyT2wcA/8kannTGxr3DBFNlRdNwYB/BbdheuxNhQTrVyLXHmr1uOHLXrG8IECwA8gpIyTydwnPQAAAABJRU5ErkJggg==';

const GreenJewelry =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAALBJREFUOI1jYKAxYETj/6e2ucgW/N9ybzqGym0PZjJ4KaQzbHswE6tJXgrpcHZjYyMDAwMDw+mFL+BmwyyAG47LIEIAZlFjYyPMAgYGBgZGJnTXkgtw6WXCKkpFS6hqATbAgs92dIAUtnBgGi+BVw/cB8ipAd1QGCbWUmSA0we4NOJzMTY9TNgkcQUFoeDABuD5gBzN2ACa4xipmoqw+RylqKCmZQxoRQW1LUE3l3YAAOipQ8/4XQ0LAAAAAElFTkSuQmCC';

const RedJewelry =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAKdJREFUOI21lNENgCAMRA/iEo7gQo7AHt3CMIL7GEdwDPyiwdqiMfUlJqLeXdsgwM8EsS7evm1A2Zbl9uWeM6aUsOesOk0p8T0RAQDW42DvGsDmltETNYiIagAAhCir/YqljepTxxDXAI2hly5pZsvM49jVcAftbpCm9Xob2mJ2YAl7FWuaqL20RvE0Dg3+D76INURxwXUXaZ1fjgrPMIijwjtE+v7HCbU5RBenVMNyAAAAAElFTkSuQmCC';

const Red7 =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAQNJREFUOI2lVLsNwyAQfURZwhOkP2UUK3UqD+QJXFuMYtG4YgK2CCmiQ8eZQ3L8JBfm8z53gAOQ0YYzxnvQXM7x4D4/AQBx+WAM4Q/uHzwRABSOu7WQBVn0DMYQ4IkwhtAWYBdniGVqT4Q1JQBGgsf7ZpaKxTVxXCYAwD5vJcGaEqoeSMe9PnB8S1DMu5KgUw4+TVmSx2XCPm8HQ1qQN2YA2RNl+S/XeKLytdbGZarmeb9D/x4U17oEGo2SOuDXZOtCZU3EJ6NFqE0wrHvQJF9TKj2wTpNGS6Ail657hFYCXZ6Dc7mJ3b+GoZozTJQemLBic6ksSEEzwZUHT3IfBK6yaoEvJxmqPQZNX8AAAAAASUVORK5CYII=';

const Purple7 =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAQRJREFUOI2lVMENwyAMNFUXYQ76ikTn6BT5+5spUMcgfZKukVHcR+LUcgxK2pOQwDrd+QyJAwACG65Sb0FrOcfFnMpWvT9uP2gvCD5u+2ke4VojsuHr+YZpHk+ZSL5pkFM5LSy5ORVAxHoCFrcM5AikMCdGxN2ICQAop0J9N1DwkYKPxHVrSU5OZcfPqfAeLrprAw7Ei+IE0zxC8BEQcavnVCD4aCfgzlS3G0em07zG+ZtAzlN0Tqv4Lp2+C5li5To2cJVFfTdA8NEcHY9Ig0fGuOwYC8yutbg0scxqBk1xCXnhNejvgGojkUJaWL+slsEhYUusdif6j0lHYh+EMw3+VdUGH6L3vniFxhJCAAAAAElFTkSuQmCC';

const maskBar7 = '';

const Blue7 =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAVRJREFUOI2dVLFOwzAQfa4y+RdKxScgsWbgG5gZGEJX2DNb+QBWqyPiS4KEKvoDnUjhFzxFOobmrvbFBtQnOTq9+N7d2Xc2AAh5mALP0H4mxwnp3AAA6LoDQqj/0D7C2h4Akv3MMV/95ty2K3TdAQDQtiv5l0siFo6RDcCbWVzbIdRoPOH16Q0A0HjCZm2yQYoVsFAJm7WRZNgOoZ4FWZwjziKNJxHVwpO/AY6XTNb2yWI+8qF4b2w3noRT/mVHLZ4TaDwlHBFpnTRARpwAkHMDAaDtfpxVWMhcxBfTOeUWOTfAuSHpoBiNPxV5+3CR3VMCOTfM7oQr4CzvP77kmADQ3eOnPh7KdRFZ20vWupviVqx2S+Gt7fHyfCn2FMToAKTbzdq+2LLj9XfxCDhIcQ40tvsRN1fvCVftljLNGjwHs0n+7xsDnKa5JC6fCKWn+xwYAPgBvZvoOqno6ekAAAAASUVORK5CYII=';

const godBar = '';

// 抽選テーブル（65536分母で確率を設定）
export const lotteryTable: LotteryEntry[] = [
 // 確定役
 { name: '全回転GOD', numerator: 1, rank: 4, effectId: 41, badgeImg: '' },
 { name: 'GOD', numerator: 7, rank: 3, effectId: 31, badgeImg: '' },
 { name: '赤7揃い', numerator: 16, rank: 2, effectId: 24, badgeImg: Red7 },
 { name: '冥王揃い', numerator: 3, rank: 2, effectId: 23, badgeImg: '' },
 { name: '紫7揃い', numerator: 10, rank: 2, effectId: 22, badgeImg: Purple7 },
 { name: '青7揃い', numerator: 10, rank: 2, effectId: 21, badgeImg: Blue7 },
 // ボーナス当選
 { name: 'GOGO', numerator: 240, rank: 1, effectId: 13, badgeImg: '' },
 { name: 'ハイビスカス', numerator: 240, rank: 1, effectId: 12, badgeImg: '' },
 { name: 'パトランプ', numerator: 240, rank: 1, effectId: 11, badgeImg: '' },
 // 小役
 { name: '1枚役A', numerator: 6301, rank: 0, effectId: null, badgeImg: '' },
 { name: '1枚役B', numerator: 640, rank: 0, effectId: null, badgeImg: '' },
 { name: '1枚役C', numerator: 160, rank: 0, effectId: null, badgeImg: '' },
 { name: '上段リプレイ', numerator: 8293, rank: 0, effectId: null, badgeImg: replay7 }, // 1/7.9
 { name: '中段リプレイ', numerator: 656, rank: 0, effectId: null, badgeImg: replay7 }, // 1/99.9
 { name: 'フェイクリプレイ', numerator: 100, rank: 0, effectId: null, badgeImg: GreenJewelry }, // 1/655.4
 { name: '下段黄7', numerator: 3766, rank: 0, effectId: null, badgeImg: Yellow7 }, // 1/17.4
 { name: '右上がり黄7', numerator: 1135, rank: 0, effectId: null, badgeImg: Yellow7 }, // 1/57.7
 { name: '中段黄7', numerator: 70, rank: 0, effectId: null, badgeImg: Yellow7 }, // 1/936.2
 { name: 'レアSIN', numerator: 1, rank: 0, effectId: null, badgeImg: RedJewelry } // 1/65536
];

// デフォルト当選（テーブル外の場合）
export const DEFAULT_WIN: LotteryEntry = {
 name: 'ハズレ',
 numerator: 0,
 rank: 0,
 effectId: null,
 badgeImg: ''
};
