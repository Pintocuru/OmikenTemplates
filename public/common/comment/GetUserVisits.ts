// common/comment/GetUserVisits.ts
import { ref, Ref, computed, onMounted, onUnmounted } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { Service, ServiceType } from '@onecomme.com/onesdk/types/Service';
import { ServiceAPI } from '../api/serviceAPI';

// サービスごとの結果の型定義
export interface ServiceVisitType {
 service: ServiceType;
 liveId: string;
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
 // フレームサービスのインスタンス化
 const frameService = new FrameService(10000); // 10秒ごとに更新

 // ユーザー訪問プロセッサーのインスタンス化
 const processor = new UserVisitsProcessor();

 // ユーザー訪問の計算
 const userVisits = computed(() => {
  processor.setComments(userComments.value);
  return processor.process();
 });

 // マウント時にフレーム取得を開始
 onMounted(() => {
  frameService.start();
 });

 // アンマウント時にフレーム取得を停止
 onUnmounted(() => {
  frameService.stop();
 });

 return {
  userVisits,
  frames: frameService.frames
 };
}

// ユーザー訪問データを処理
export class UserVisitsProcessor {
 private comments: Comment[];

 constructor(comments: Comment[] = []) {
  this.comments = comments;
 }

 // コメントを設定
 setComments(comments: Comment[]): void {
  this.comments = comments;
 }

 /**
  * ユーザー訪問データを処理する
  */
 process(): Record<string, ServiceVisitType> {
  const result: Record<string, ServiceVisitType> = {};

  this.comments.forEach((comment) => {
   const { data, meta } = comment;
   if (!data || !meta) return;

   // commentからデータを取得
   const { service } = comment;
   const { liveId, userId, isRepeater, profileImage, hasGift } = data;
   const { no = 0, lc = 0, interval = 0 } = meta;

   // liveIdの初期化
   if (!result[service]) {
    result[service] = {
     service,
     liveId,
     user: {}
    };
   }

   // liveId が異なったら配信枠が変わったのでリセット
   if (result[service].liveId !== liveId) {
    result[service].user = {};
    result[service].liveId = liveId;
   }

   // userIdの初期化（存在しない場合のみ）
   if (!result[service].user[userId]) {
    result[service].user[userId] = {
     isSyoken: false,
     profileImage: profileImage || '',
     count: 0,
     totalCount: 0,
     price: 0
    };
   }

   // ユーザー情報への参照を取得
   const userInfo = result[service].user[userId];

   // 初回コメントの処理
   if (!isRepeater) {
    userInfo.isSyoken = interval === 0;
    userInfo.profileImage = profileImage || userInfo.profileImage;
   }

   // カウント情報の更新
   userInfo.count = no;
   userInfo.totalCount = lc;

   // ギフト金額/回数の更新
   if ('price' in data) {
    const commentPrice = data.price ?? 0;
    userInfo.price += commentPrice;
   } else if (hasGift) {
    userInfo.price++;
   }
  });

  return result;
 }
}

/**
 * フレーム情報を定期的に取得するクラス
 */
export class FrameService {
 private serviceAPI: ServiceAPI;
 private intervalId: number | null = null;
 private frameData = ref<Service[] | null>([]);
 private intervalMs: number;

 constructor(intervalMs: number = 10000) {
  this.serviceAPI = new ServiceAPI();
  this.intervalMs = intervalMs;
 }

 /**
  * フレームデータの参照を取得
  */
 get frames() {
  return this.frameData;
 }

 /**
  * フレーム情報の取得を開始
  */
 start(): void {
  // 初回実行
  this.fetchFrames();

  // 定期実行のセットアップ
  this.intervalId = window.setInterval(() => {
   this.fetchFrames();
  }, this.intervalMs);
 }

 /**
  * フレーム情報の取得を停止
  */
 stop(): void {
  if (this.intervalId !== null) {
   clearInterval(this.intervalId);
   this.intervalId = null;
  }
 }

 /**
  * フレーム情報を取得
  */
 private async fetchFrames(): Promise<void> {
  try {
   this.frameData.value = await this.serviceAPI.getServices();
  } catch (error) {
   console.error('Failed to fetch frames:', error);
  }
 }
}
