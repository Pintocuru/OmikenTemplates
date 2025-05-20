// common/CommonSchema.ts
import { z } from 'zod';

// @onecomme.com/onesdk/types/Service から system を除いたもの
export const serviceTypeValues = [
 'youtube',
 'twicas',
 'twitch',
 'niconama',
 'showroom',
 'bilibili',
 'mirrativ',
 'mixch',
 'twitter',
 'doneru',
 'tiktok',
 'streamlabs',
 'kick',
 'vtips',
 'external'
] as const;
export const ServiceTypeEnum = z.enum(serviceTypeValues);
export type ServiceType = (typeof serviceTypeValues)[number];

// subscribe/GetUserComments.ts 用の Config
export const ConfigUserSchema = z.object({
 IS_DIFF_MODE: z.boolean().default(false).catch(false),
 ENABLED_SERVICES: z
  .union([z.literal('all'), z.literal('platforms'), ServiceTypeEnum])
  .default('all')
  .catch('all'),
 ALLOWED_IDS: z.array(z.string()).default([]).catch([]),
 ACCESS_LEVEL: z
  .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
  .optional()
  .default(1)
  .catch(1),
 IS_GIFT: z.boolean().default(false).catch(false),
 KEYWORDS: z.array(z.string()).default([]).catch([])
});

// 推論される型
export type ConfigUserType = z.infer<typeof ConfigUserSchema>;
