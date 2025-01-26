// common/ApiHandler.ts
import { DataType } from '@/public/types';
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
