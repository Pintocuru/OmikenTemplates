// src/composables/FunkCommentGetting.ts
import { ref } from 'vue';
import { DataType } from '@type';
import { AxiosResponse, CommentTemp } from './types';
import OneSDK from '@onecomme.com/onesdk';
import { PluginResponse } from '@onecomme.com/onesdk/types/Plugin';

export function FunkCommentGetting(pluginUid: string, mode?: 'diff' | 'all') {
 // 購読したコメント
 const newComments = ref<CommentTemp[]>([]);

 // 初期化
 async function initOneSDK() {
  // OneSDKの初期化
  OneSDK.setup({
   permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
   mode
  });
  OneSDK.connect();
  OneSDK.subscribe({
   action: 'comments',
   callback: (comments: CommentTemp[]) => (newComments.value = comments)
  });
 }

 // プラグインからデータ取得
 async function fetchDatas(types: DataType): Promise<string> {
  try {
   const url = `http://localhost:11180/api/plugins/${pluginUid}?mode=data&type=${types}`;
   const response = (await OneSDK.get(url, {})) as AxiosResponse<PluginResponse>;

   return response.data.response ?? '';
  } catch (error) {
   console.error('データの取得に失敗:', error);
   return '';
  }
 }

 return {
  newComments,
  initOneSDK,
  fetchDatas
 };
}
