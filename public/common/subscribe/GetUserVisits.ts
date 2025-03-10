// common/subscribe/GetUserVisits.ts
import { ref } from 'vue';
import { ConfigUserType } from '../commonTypes';
import { GetUserComments } from './GetUserComments';
import { ServiceAPI } from '../api/ServiceAPI';
import { Comment, CommentData } from '@onecomme.com/onesdk/types/Comment';
import { Service, ServiceType } from '@onecomme.com/onesdk/types/Service';

// サービスごとの結果の型定義
export interface ServiceVisitType {
 serviceKey: ServiceType; // 配信プラットフォーム
 liveId: string; // 配信のid
 frameData: Service | null; // 現在の配信枠情報
 totalCount: number; // フィルタされた配信枠のコメント数
 syokenCount: number; // 初見さん(初コメ)の数
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
 const userVisits = ref<Record<string, ServiceVisitType>>({});

 const fetchComments = async (
  callback?: (userVisits: Record<string, ServiceVisitType>) => void
 ): Promise<boolean> => {
  return await userFetch((comments) => {
   if (!comments.length) return;
   // 処理して結果を取得
   userVisits.value = processor.mergeComments(comments);

   // 外部から処理を追加するcallback
   if (callback) callback(userVisits.value);
  });
 };

 return {
  userVisits, // ユーザーのコメント数やギフト回数
  fetchComments // 初期化
 };
}

// ユーザー訪問データを処理
class UserVisitsProcessor {
 // 内部状態
 private result: Record<string, ServiceVisitType> = {};
 frames: Service[] | null = null;

 constructor() {
  // 10秒ごとに枠情報を自動更新
  new ServiceAPI().startPolling((services) => {
   if (services) this.frames = services;
  });
 }

 // コメントを処理して結果を返す
 processComments(comments: Comment[]): Record<string, ServiceVisitType> {
  const newVisits = this.createVisitsFromComments(comments);
  return newVisits;
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

  comments.forEach((comment) => {
   const { data, meta } = comment;
   if (!data || !meta) return;

   // サービスとライブIDの処理
   this.initializeServiceData(newVisits, comment);

   // フレームデータの関連付け
   this.attachFrameData(newVisits, comment.service);

   // ユーザー情報の処理
   this.processUserData(newVisits, comment);
  });

  return newVisits;
 }

 // 新しいデータを既存の結果とマージ（内部メソッド）
 private mergeVisits(newVisits: Record<string, ServiceVisitType>): void {
  Object.keys(newVisits).forEach((serviceKey) => {
   if (!this.result[serviceKey]) {
    this.result[serviceKey] = newVisits[serviceKey];
   } else {
    // 既存のデータに加算
    const existingUsers = this.result[serviceKey].user;
    const newUsers = newVisits[serviceKey].user;

    Object.keys(newUsers).forEach((userId) => {
     if (!existingUsers[userId]) {
      existingUsers[userId] = newUsers[userId];
     } else {
      // price は加算
      existingUsers[userId].count = newUsers[userId].count;
      existingUsers[userId].price += newUsers[userId].price;
     }
    });
    // totalCount を加算
    this.result[serviceKey].totalCount += newVisits[serviceKey].totalCount;
   }
  });
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
    user: {}
   };
  }

  // liveId が異なったら配信枠が変わったのでリセット
  if (result[serviceKey].liveId !== liveId) {
   result[serviceKey].liveId = liveId;
   result[serviceKey].totalCount = 0;
   result[serviceKey].user = {};
  }

  // totalCountをインクリメント
  result[serviceKey].totalCount++;
 }

 // フレームデータの関連付け（内部メソッド）
 private attachFrameData(result: Record<string, ServiceVisitType>, serviceKey: string): void {
  if (result[serviceKey].frameData === null && this.frames) {
   this.frames.forEach((frame) => {
    const detectedService = detectServiceFromUrl(frame.url);
    if (
     detectedService &&
     result[serviceKey].serviceKey === detectedService &&
     frame.meta?.isLive
    ) {
     result[serviceKey].frameData = frame;
    }
   });
  }
 }

 // ユーザーデータの処理（内部メソッド）
 private processUserData(result: Record<string, ServiceVisitType>, comment: Comment): void {
  const { data, meta } = comment;
  if (!data || !meta) return;

  // commentからデータを取得
  const { service: serviceKey } = comment;
  const { userId, isRepeater, profileImage } = data;
  const { no = 0, lc = 0, interval = 0 } = meta;

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
   userInfo.isSyoken = interval === 0;
   if (interval === 0) result[serviceKey].syokenCount = +1;
  }

  // インクリメント
  userInfo.count++;

  // ギフト金額/回数の更新
  this.updateGiftInfo(userInfo, data);
 }

 // ギフト情報の更新（内部メソッド）
 private updateGiftInfo(userInfo: UserVisitType, data: CommentData): void {
  if ('price' in data) {
   const commentPrice = data.price ?? 0;
   userInfo.price += commentPrice;
  } else if (data.hasGift) {
   userInfo.price++;
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
  // ホスト名とパスに基づいてサービスを判定
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
  if (hostname.includes('tiktok.com') && hostname.includes('/live')) return 'tiktok';
  if (hostname.includes('mirrativ.com')) return 'mirrativ';
 } catch (error) {
  return undefined;
 }

 // 該当するサービスがない場合は undefined を返す
 return undefined;
}
