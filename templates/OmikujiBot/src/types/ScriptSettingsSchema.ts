// src/types/ScriptSettingsSchema.ts
import { z } from 'zod';
import { ParameterItem } from './ScriptTypes';
import { scriptGameKeys, scriptGameMap } from '@/ScriptGame/ScriptGameMap';

export const ScriptSettingsSchema = createScriptSettingsSchema();

/**
 * ParameterItemのinputTypeから対応するZodスキーマを生成するヘルパー関数
 */
function createZodSchemaFromInputType(item: ParameterItem): z.ZodTypeAny {
 switch (item.inputType) {
  case 'string':
   if (item.values && item.values.length > 0) {
    const enumValues = item.values.map(String) as [string, ...string[]];
    return z.enum(enumValues).default(String(item.defaultValue)).catch(String(item.defaultValue));
   }
   return z
    .string()
    .default(item.defaultValue as string)
    .catch(item.defaultValue as string);

  case 'number':
   let numberSchema = z.coerce.number();
   if (typeof item.min === 'number') numberSchema = numberSchema.min(item.min);
   if (typeof item.max === 'number') numberSchema = numberSchema.max(item.max);
   return numberSchema.default(item.defaultValue as number).catch(item.defaultValue as number);

  case 'boolean':
   return z.coerce
    .boolean()
    .default(item.defaultValue as boolean)
    .catch(item.defaultValue as boolean);

  case 'select':
   if (!item.values || item.values.length === 0) {
    return z.string().default(String(item.defaultValue)).catch(String(item.defaultValue));
   }
   const enumValues = item.values.map(String) as [string, ...string[]];
   return z.enum(enumValues).default(String(item.defaultValue)).catch(String(item.defaultValue));

  default:
   return z.any().default(item.defaultValue).catch(item.defaultValue);
 }
}

/**
 * scriptGameMapから動的にScriptSettingsSchemaを生成する関数
 */
export function createScriptSettingsSchema(): z.ZodTypeAny {
 const schemaShape: Record<string, z.ZodTypeAny> = {};

 for (const key of scriptGameKeys) {
  const preset = scriptGameMap[key];
  if (preset && preset.settings && preset.settings.length > 0) {
   const gameSettingsShape: Record<string, z.ZodTypeAny> = {};
   for (const settingItem of preset.settings) {
    gameSettingsShape[String(settingItem.id)] = createZodSchemaFromInputType(settingItem);
   }
   schemaShape[key] = z.object(gameSettingsShape).default({}).catch({});
  } else {
   schemaShape[key] = z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({})
    .catch({});
  }
 }

 return z.object(schemaShape).default({}).catch({});
}

/**
 * 単一の scriptId に対応する ScriptParams のスキーマを生成
 */
export function createScriptParamsSchema(scriptId: string): z.ZodTypeAny {
 const shape: Record<string, z.ZodTypeAny> = {};
 const preset = scriptGameMap[scriptId];
 if (!preset || !preset.params) return z.object(shape).default({}).catch({});

 for (const params of preset.params) {
  shape[params.id] = createZodSchemaFromInputType(params);
 }

 return z.object(shape).default({}).catch({});
}
