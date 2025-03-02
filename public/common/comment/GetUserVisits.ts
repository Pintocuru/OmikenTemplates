// common/comment/GetUserVisits.ts
import { ref, Ref } from 'vue';
import { Comment, CommentData } from '@onecomme.com/onesdk/types/Comment';
import { Service, ServiceType } from '@onecomme.com/onesdk/types/Service';
import { ServiceAPI } from '../api/serviceAPI';

// サービスごとの結果の型定義
export interface ServiceVisitType {
 serviceKey: ServiceType;
 liveId: string;
 frameData: Service | null;
 user: {
  [userId: string]: UserVisitType;
 };
}

// ユーザーコメント情報の型定義
export interface UserVisitType {
 isSyoken: boolean;
 profileImage: string;
 count: number;
 totalCount: number;
 price: number;
}

export function GetUserVisits(userComments: Ref<Comment[]>) {
 // 10秒ごとに枠情報を自動更新
 const frames = ref<Service[] | null>([]);
 new ServiceAPI().startPolling((services) => {
  if (services) frames.value = services;
 });

 // ユーザー訪問の計算
 const userVisits = ref<Record<string, ServiceVisitType>>({});

 // UserVisitsProcessorのインスタンスを作成
 const processor = new UserVisitsProcessor();

 // `userComments` の変更を監視し、`userVisits` を更新
 watch(
  [userComments, frames],
  ([newComments, newFrames]) => {
   if (!newComments.length) return;

   // フレームデータを更新
   processor.setFrames(newFrames);

   // 処理して結果を取得
   const result = processor.mergeComments(newComments);

   // リアクティブな値を更新
   userVisits.value = { ...result };
  },
  { deep: true }
 );

 return {
  userVisits,
  frames
 };
}

// ユーザー訪問データを処理

export class UserVisitsProcessor {
 // 内部状態
 private result: Record<string, ServiceVisitType> = {};

 constructor(private frames: Service[] | null = null) {}

 // 新しいフレームデータをセット
 setFrames(frames: Service[] | null): void {
  this.frames = frames;
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
      existingUsers[userId].count += newUsers[userId].count;
      existingUsers[userId].totalCount += newUsers[userId].totalCount;
      existingUsers[userId].price += newUsers[userId].price;
     }
    });
   }
  });
 }

 // サービスデータの初期化（内部メソッド）
 private initializeServiceData(result: Record<string, ServiceVisitType>, comment: Comment): void {
  const { service: serviceKey } = comment;
  const { liveId } = comment.data;

  if (!result[serviceKey]) {
   result[serviceKey] = {
    serviceKey: serviceKey,
    liveId,
    frameData: null,
    user: {}
   };
  }

  // liveId が異なったら配信枠が変わったのでリセット
  if (result[serviceKey].liveId !== liveId) {
   result[serviceKey].user = {};
   result[serviceKey].liveId = liveId;
  }
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
    totalCount: 0,
    price: 0
   };
  }

  const userInfo = result[serviceKey].user[userId];

  // 初回コメントの処理
  if (!isRepeater) {
   userInfo.isSyoken = interval === 0;
   userInfo.profileImage = profileImage || userInfo.profileImage;
  }

  // カウント情報の更新
  userInfo.count = no;
  userInfo.totalCount = lc;

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
