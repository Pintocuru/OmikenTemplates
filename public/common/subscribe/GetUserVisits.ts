// common/subscribe/GetUserVisits.ts
import { ConfigUserType } from '../commonTypes';
import { GetUserComments } from './GetUserComments';
import { ServiceAPI } from '../api/ServiceAPI';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { Service, ServiceType } from '@onecomme.com/onesdk/types/Service';

// サービスごとの結果の型定義
export interface ServiceVisitType {
 serviceKey: ServiceType; // 配信プラットフォーム
 liveId: string; // 配信のid
 frameData: Service | null; // 現在の配信枠情報
 totalCount: number; // フィルタされた配信枠のコメント数
 syokenCount: number; // 初見さん(初コメ)の数
 totalPrice: number; // 配信枠でのコメント総額
 user: Record<string, UserVisitType>;
}

// ユーザーコメント情報の型定義
export interface UserVisitType {
 isSyoken: boolean; // 初見判定
 profileImage: string; // アイコン画像
 count: number; // フィルタされた配信枠の個人のコメント数
 price: number; // 配信枠での個人のギフト総額
}

export function GetUserVisits(config: ConfigUserType) {
 const processor = new UserVisitsProcessor();
 const { fetchComments: userFetch } = GetUserComments(config, true);
 // Removed Vue ref, now using plain object
 let userVisitsData: Record<string, ServiceVisitType> = {};

 const fetchComments = async (
  callback: (userVisits: Record<string, ServiceVisitType>) => void
 ): Promise<boolean> => {
  const result = await userFetch((comments) => {
   if (!comments.length) return;
   // 処理して結果を取得
   userVisitsData = processor.mergeComments(comments);
   // 外部から処理を追加するcallback
   callback(userVisitsData);
  });
  // わんコメ接続時のみポーリングを開始
  if (result) processor.startServicePolling();
  return result;
 };

 const getUserVisits = () => userVisitsData;

 return {
  getUserVisits, // Getter function to access the current data
  fetchComments // 初期化
 };
}

// ユーザー訪問データを処理
class UserVisitsProcessor {
 // 内部状態
 private result: Record<string, ServiceVisitType> = {};
 private frames: Service[] | null = null;
 private apiPoller: ServiceAPI | null = null;

 constructor() {
  this.apiPoller = new ServiceAPI();
 }

 // 10秒ごとに枠情報を自動更新
 startServicePolling(): void {
  if (!this.apiPoller) return;

  this.apiPoller.startPolling((services) => {
   if (services) this.frames = services;
  }, 10000);
 }

 // コメントを処理して結果を返す
 processComments(comments: Comment[]): Record<string, ServiceVisitType> {
  return this.createVisitsFromComments(comments);
 }

 // 既存の結果に新しいコメントを追加
 mergeComments(comments: Comment[]): Record<string, ServiceVisitType> {
  const newVisits = this.createVisitsFromComments(comments);
  this.mergeVisits(newVisits);
  return this.result;
 }

 // 現在の結果を取得
 getResult(): Record<string, ServiceVisitType> {
  return this.result;
 }

 // 内部状態をリセット
 reset(): void {
  this.result = {};
 }

 // コメントから新しいユーザー訪問データを作成（内部メソッド）
 private createVisitsFromComments(comments: Comment[]): Record<string, ServiceVisitType> {
  const newVisits: Record<string, ServiceVisitType> = {};

  for (const comment of comments) {
   const { data, meta } = comment;
   if (!data || !meta) continue;

   // サービスとライブIDの処理
   this.initializeServiceData(newVisits, comment);

   // フレームデータの関連付け
   this.attachFrameData(newVisits, comment.service);

   // ユーザー情報の処理
   this.processUserData(newVisits, comment);
  }

  return newVisits;
 }

 // 既存の訪問データと新しい訪問データをマージ
 private mergeVisits(newVisits: Record<string, ServiceVisitType>): void {
  for (const serviceKey of Object.keys(newVisits)) {
   if (!this.result[serviceKey]) {
    this.result[serviceKey] = newVisits[serviceKey];
    continue;
   }

   // 配信枠が変わった場合は完全リセット
   if (this.result[serviceKey].liveId !== newVisits[serviceKey].liveId) {
    this.result[serviceKey] = newVisits[serviceKey];
    continue;
   }

   // ユーザーデータのマージ
   const existingUsers = this.result[serviceKey].user;
   const newUsers = newVisits[serviceKey].user;

   for (const userId of Object.keys(newUsers)) {
    if (!existingUsers[userId]) {
     existingUsers[userId] = newUsers[userId];
    } else {
     existingUsers[userId].count = newUsers[userId].count;
     existingUsers[userId].price += newUsers[userId].price;
    }
   }

   // totalCountは新しい値で上書き（加算しない）
   this.result[serviceKey].totalCount = newVisits[serviceKey].totalCount;
   this.result[serviceKey].syokenCount = newVisits[serviceKey].syokenCount;
   this.result[serviceKey].totalPrice = newVisits[serviceKey].totalPrice;
  }
 }

 // サービスデータの初期化（内部メソッド）
 private initializeServiceData(result: Record<string, ServiceVisitType>, comment: Comment): void {
  const { service: serviceKey } = comment;
  const { liveId } = comment.data;

  if (!result[serviceKey]) {
   result[serviceKey] = {
    serviceKey,
    liveId,
    frameData: null,
    totalCount: 0,
    syokenCount: 0,
    totalPrice: 0,
    user: {}
   };
  }

  // liveId が異なったら配信枠が変わったのでリセット
  if (liveId !== 'external' && liveId !== 'system') {
   if (result[serviceKey].liveId !== liveId) {
    result[serviceKey].liveId = liveId;
    result[serviceKey].user = {};
   }
  }

  // totalCountをインクリメント
  result[serviceKey].totalCount++;
 }

 // フレームデータの関連付け（内部メソッド）
 private attachFrameData(result: Record<string, ServiceVisitType>, serviceKey: string): void {
  if (result[serviceKey].frameData === null && this.frames) {
   for (const frame of this.frames) {
    const detectedService = detectServiceFromUrl(frame.url);
    if (
     detectedService &&
     result[serviceKey].serviceKey === detectedService &&
     frame.meta?.isLive
    ) {
     result[serviceKey].frameData = frame;
     break;
    }
   }
  }
 }

 // ユーザーデータの処理（内部メソッド）
 private processUserData(result: Record<string, ServiceVisitType>, comment: Comment): void {
  const { data, meta } = comment;
  if (!data || !meta) return;

  // commentからデータを取得
  const { service: serviceKey } = comment;
  const { userId, isRepeater, profileImage } = data;
  const { interval } = meta;

  // ユーザーの初期化
  if (!result[serviceKey].user[userId]) {
   result[serviceKey].user[userId] = {
    isSyoken: false,
    profileImage: profileImage || '',
    count: 0,
    price: 0
   };
  }

  const userInfo = result[serviceKey].user[userId];

  // 初回コメントの処理
  if (!isRepeater) {
   const isSyoken = interval === 0;
   userInfo.isSyoken = isSyoken;
   if (isSyoken) result[serviceKey].syokenCount++;
  }

  // インクリメント
  userInfo.count++;

  // ギフト金額/回数の更新
  if ('price' in data) {
   const commentPrice =
    'unit' in data && data.unit === '$'
     ? (data.price ?? 0) * 100 // ドルでの計算(1ドル100円)
     : (data?.price ?? 0); // 円での計算
   userInfo.price += commentPrice;
   result[serviceKey].totalPrice += commentPrice;
  } else if (data.hasGift) {
   // TODO 「メンバー加入」は一律+1なので、別途ステータスが必要かも
   userInfo.price++;
   result[serviceKey].totalPrice++;
  }
 }
}

// URLパターンからServiceTypeを判別する
export function detectServiceFromUrl(url: string): ServiceType | undefined {
 if (!url) return undefined;
 const lowerUrl = url.toLowerCase();

 // URLオブジェクトを作成して判定する
 try {
  // 相対パスやスキームがない場合は適切に処理
  const parsedUrl = new URL(lowerUrl.startsWith('http') ? lowerUrl : `https://${lowerUrl}`);
  const hostname = parsedUrl.hostname;

  // ホスト名に基づいてサービスを判定
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
  if (hostname.includes('twitch.tv')) return 'twitch';
  if (hostname.includes('twitcasting.tv')) return 'twicas';
  if (hostname.includes('showroom-live.com')) return 'showroom';
  if (hostname.includes('live.bilibili.com')) return 'bilibili';
  if (hostname.includes('mixch.tv')) return 'mixch';
  if (hostname.includes('nicovideo.jp') || hostname.includes('live.nicovideo.jp'))
   return 'niconama';
  if (hostname.includes('v-tips.jp')) return 'vtips';
  if (hostname.includes('kick.com')) return 'kick';
  if (hostname.includes('tiktok.com') && parsedUrl.pathname.includes('/live')) return 'tiktok';
  if (hostname.includes('mirrativ.com')) return 'mirrativ';
 } catch (error) {
  return undefined;
 }

 return undefined;
}
