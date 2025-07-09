// common/subscribe/GetUserVisits.ts
import { ConfigUserType } from '../types/ConfigTypes';
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
 let userVisitsData: Record<string, ServiceVisitType> = {};

 const fetchComments = async (
  callback: (userVisits: Record<string, ServiceVisitType>, comments: Comment[]) => void
 ): Promise<boolean> => {
  const result = await userFetch((comments) => {
   // 空が返った場合はリセットなので、リセット処理
   if (comments.length === 0) {
    userVisitsData = {};
    callback({}, []);
    return;
   }

   userVisitsData = processor.mergeComments(comments);
   callback(userVisitsData, comments);
  });
  // わんコメ接続時のみポーリングを開始
  if (result) processor.startServicePolling();
  return result;
 };

 // UserVisitType に追加データを入れるユーティリティ関数
 const extendUserVisit = <T extends UserVisitType>(
  user: T,
  extra: Partial<Record<string, any>>
 ): T & typeof extra => Object.assign({}, user, extra);

 return {
  getUserVisits: () => userVisitsData,
  fetchComments,
  extendUserVisit
 };
}

/**
 * ユーザー訪問データを処理
 */
class UserVisitsProcessor {
 private result: Record<string, ServiceVisitType> = {};
 private frames: Service[] | null = null;
 private apiPoller: ServiceAPI;

 constructor() {
  this.apiPoller = new ServiceAPI();
 }

 // 10秒ごとに枠情報を自動更新
 startServicePolling(): void {
  this.apiPoller.startPolling((services) => {
   if (services) this.frames = services;
  }, 10000);
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

 // リセット
 reset(): void {
  this.result = {};
 }

 // コメントから新しいユーザー訪問データを作成
 private createVisitsFromComments(comments: Comment[]): Record<string, ServiceVisitType> {
  const visits: Record<string, ServiceVisitType> = {};

  for (const comment of comments) {
   if (!comment.data || !comment.meta) continue;

   this.initializeServiceData(visits, comment);
   this.attachFrameData(visits, comment.service);
   this.processUserData(visits, comment);
  }

  return visits;
 }

 // 既存の訪問データと新しい訪問データをマージ
 private mergeVisits(newVisits: Record<string, ServiceVisitType>): void {
  for (const [serviceKey, newVisit] of Object.entries(newVisits)) {
   const existing = this.result[serviceKey];

   if (!existing || existing.liveId !== newVisit.liveId) {
    this.result[serviceKey] = newVisit;
    continue;
   }

   // ユーザーデータのマージ
   for (const [userId, newUser] of Object.entries(newVisit.user)) {
    const existingUser = existing.user[userId];

    if (!existingUser) {
     existing.user[userId] = newUser;
    } else {
     existingUser.count = newUser.count;
     existingUser.price += newUser.price;
    }
   }

   // 統計情報の更新
   existing.totalCount = newVisit.totalCount;
   existing.syokenCount = newVisit.syokenCount;
   existing.totalPrice = newVisit.totalPrice;
  }
 }

 // サービスデータの初期化と配信枠の更新
 private initializeServiceData(visits: Record<string, ServiceVisitType>, comment: Comment): void {
  const { service: serviceKey } = comment;
  const { liveId } = comment.data;

  if (!visits[serviceKey]) {
   visits[serviceKey] = {
    serviceKey,
    liveId,
    frameData: null,
    totalCount: 0,
    syokenCount: 0,
    totalPrice: 0,
    user: {}
   };
  }

  // liveIdが変わったら配信枠リセット（external/systemは除く）
  const isSpecialId = liveId === 'external' || liveId === 'system';
  if (!isSpecialId && visits[serviceKey].liveId !== liveId) {
   visits[serviceKey].liveId = liveId;
   visits[serviceKey].user = {};
  }

  visits[serviceKey].totalCount++;
 }

 // フレームデータの関連付け
 private attachFrameData(visits: Record<string, ServiceVisitType>, serviceKey: string): void {
  if (visits[serviceKey].frameData || !this.frames) return;

  const frame = this.frames.find((f) => {
   const detectedService = detectServiceFromUrl(f.url);
   return detectedService === serviceKey && f.meta?.isLive;
  });

  if (frame) {
   visits[serviceKey].frameData = frame;
  }
 }

 // ユーザーデータの処理
 private processUserData(visits: Record<string, ServiceVisitType>, comment: Comment): void {
  const { data, meta, service: serviceKey } = comment;
  if (!data || !meta) return;

  const { userId, isRepeater, profileImage } = data;
  const visit = visits[serviceKey];

  // ユーザー初期化
  if (!visit.user[userId]) {
   visit.user[userId] = {
    isSyoken: false,
    profileImage: profileImage || '',
    count: 0,
    price: 0
   };
  }

  const user = visit.user[userId];

  // 初見判定
  if (!isRepeater) {
   const isSyoken = meta.interval === 0 || !meta.interval;
   user.isSyoken = isSyoken;
   if (isSyoken) visit.syokenCount++;
  }

  // コメント数取得(tcから取得、もしなければインクリメント)
  user.count = meta.tc ?? user.count++;

  // ギフト金額計算
  const price = this.calculatePrice(data);
  user.price += price;
  visit.totalPrice += price;
 }

 private calculatePrice(data: any): number {
  if ('price' in data) {
   const basePrice = data.price ?? 0;
   return data.unit === '$' ? basePrice * 100 : basePrice;
  }
  return data.hasGift ? 1 : 0;
 }
}

/*
 * URLパターンからServiceTypeを判別
 */
export function detectServiceFromUrl(url: string): ServiceType | null {
 if (!url) return null;

 const parsedUrl = new URL(url.toLowerCase().startsWith('http') ? url : `https://${url}`);
 const hostname = parsedUrl.hostname.toLowerCase();

 const serviceMap: Record<string, ServiceType> = {
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'twitch.tv': 'twitch',
  'twitcasting.tv': 'twicas',
  'showroom-live.com': 'showroom',
  'live.bilibili.com': 'bilibili',
  'mixch.tv': 'mixch',
  'nicovideo.jp': 'niconama',
  'live.nicovideo.jp': 'niconama',
  'v-tips.jp': 'vtips',
  'kick.com': 'kick',
  'tiktok.com': 'tiktok',
  'mirrativ.com': 'mirrativ'
 };

 // 通常のマッピング
 for (const [domain, service] of Object.entries(serviceMap)) {
  if (hostname.includes(domain)) return service;
 }

 return null;
}
