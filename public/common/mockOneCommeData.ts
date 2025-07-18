// public/common/mockOneCommeData.ts
import { z } from 'zod';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export const mockComment: Comment = {
 id: 'COMMENT_TESTER',
 service: 'youtube',
 name: 'CommentTester',
 url: 'about:blank:comment-tester',
 color: {
  r: 0,
  g: 0,
  b: 0
 },
 data: {
  id: 'yt-1752042912274',
  liveId: 'youtube-test',
  userId: 'テストユーザー',
  name: 'テストユーザー',
  isOwner: false,
  isModerator: false,
  isMember: false,
  autoModerated: false,
  timestamp: '2025-07-09T06:35:12.274Z',
  badges: [],
  hasGift: false,
  profileImage: '',
  comment: 'suika',
  displayName: 'テストユーザー',
  originalProfileImage: '',
  meta: {},
  speechText: 'テストユーザー suika'
 },
 meta: {}
};

// カラースキーマ（RGB）
const ColorSchema = z
 .object({
  r: z.number().min(0).max(255).default(0).catch(0),
  g: z.number().min(0).max(255).default(0).catch(0),
  b: z.number().min(0).max(255).default(0).catch(0)
 })
 .default({ r: 0, g: 0, b: 0 })
 .catch({ r: 0, g: 0, b: 0 });

// コメントデータのスキーマ
const CommentDataSchema = z
 .object({
  id: z.string().default('unknown-id').catch('unknown-id'),
  liveId: z.string().default('unknown-live').catch('unknown-live'),
  userId: z.string().default('anonymous').catch('anonymous'),
  name: z.string().default('unknown').catch('unknown'),
  isOwner: z.boolean().default(false).catch(false),
  isModerator: z.boolean().default(false).catch(false),
  isMember: z.boolean().default(false).catch(false),
  autoModerated: z.boolean().default(false).catch(false),
  timestamp: z
   .string()
   .datetime()
   .default(new Date().toISOString())
   .catch(new Date().toISOString()),
  badges: z.array(z.string()).default([]).catch([]),
  hasGift: z.boolean().default(false).catch(false),
  profileImage: z.string().default('').catch(''),
  comment: z.string().default('').catch(''),
  displayName: z.string().default('anonymous').catch('anonymous'),
  originalProfileImage: z.string().default('').catch(''),
  meta: z.record(z.unknown()).default({}).catch({}),
  speechText: z.string().default('').catch('')
 })
 .default({}); // 全体のデフォルト

// テスト用Comment スキーマ(本番では使えません)
export const mockCommentSchema = z
 .object({
  id: z.string().default('unknown-comment').catch('unknown-comment'),
  service: z.literal('youtube').default('youtube').catch('youtube'),
  name: z.string().default('unknown').catch('unknown'),
  url: z.string().url().default('about:blank').catch('about:blank'),
  color: ColorSchema.catch(ColorSchema.parse({})),
  data: CommentDataSchema.catch(CommentDataSchema.parse({})),
  meta: z.record(z.unknown()).default({}).catch({})
 })
 .default({}); // 全体のデフォルト
