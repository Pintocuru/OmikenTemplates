// common/ApiHandler.ts
import { DataType } from '../../public/types';
import OneSDK from '@onecomme.com/onesdk';

// プラグインからデータを読み込み
export const fetchData = async <T extends DataType>(PLUGIN_UID: string, type: T) => {
 try {
  const url = `http://localhost:11180/api/plugins/${PLUGIN_UID}?mode=data&type=${type}`;
  const response = await OneSDK.get(url, {});
  return response.status === 200 ? JSON.parse(response.data.response) : null;
 } catch (error) {
  console.error(`${type}データの取得に失敗:`, error);
  return null;
 }
};

// プラグインからデータを読み込み
export const getListenerList = async () => {
 try {
  const url = `http://localhost:11180/api/listeners`;
  const response = await OneSDK.get(url, {});
  return response.status === 200 ? response.data : null;
 } catch (error) {
  console.error(`データの取得に失敗:`, error);
  return null;
 }
};

// Gamesにある、rule.idと同じデータを取得する
export const getGameData = async (PLUGIN_UID: string, PLUGIN_RULE_ID: string) => {
 const gamesData = await fetchData<DataType.Games>(PLUGIN_UID, DataType.Games);
 return gamesData[PLUGIN_RULE_ID];
};
