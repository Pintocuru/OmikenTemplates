// src/MainGenerator/utils/processors/ScriptManager.ts
import { CommentRuleType, OmikujiDataType, TimerRuleType } from '@/types/OmikujiTypesSchema';
import { ScriptClass } from '@/types/PresetTypes';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export class ScriptManager {
 private readonly scriptInstances: Record<string, ScriptClass<any, any, any, any, any>> = {};
 omikujiData: OmikujiDataType;

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
  this.initializeScripts();
 }

 /**
  * 外部スクリプトの初期化
  */
 private initializeScripts(): void {
  try {
   const commentRules: Record<string, CommentRuleType> = this.omikujiData.comments;
   const timerRules: Record<string, TimerRuleType> = this.omikujiData.timers;

   for (const rule of Object.values(commentRules)) {
    const { scriptId } = rule;

    if (scriptId && scriptGameMap[scriptId]) {
     const scriptInstance = scriptGameMap[scriptId].execute;

     if (this.omikujiData.scriptSettings) {
      // 型アサーションを使用して型の不整合を解決
      scriptInstance.setup(this.omikujiData.scriptSettings as any);
     }

     this.scriptInstances[scriptId] = scriptInstance;
    }
   }
   for (const rule of Object.values(timerRules)) {
    const { scriptId } = rule;

    if (scriptId && scriptGameMap[scriptId]) {
     const scriptInstance = scriptGameMap[scriptId].execute;

     if (this.omikujiData.scriptSettings) {
      // 型アサーションを使用して型の不整合を解決
      scriptInstance.setup(this.omikujiData.scriptSettings as any);
     }

     this.scriptInstances[scriptId] = scriptInstance;
    }
   }
  } catch (error) {
   console.error('スクリプト初期化エラー:', error);
  }
 }

 /**
  * スクリプトインスタンスを取得
  */
 getScriptInstance(scriptId: string): ScriptClass | null {
  return this.scriptInstances[scriptId] || null;
 }

 /**
  * スクリプト実行
  */
 executeScript(comment: Comment, rule: CommentRuleType | TimerRuleType): any {
  const { scriptId } = rule;

  if (!scriptId || !scriptGameMap[scriptId]) {
   return null;
  }

  const scriptInstance = this.getScriptInstance(scriptId);
  if (!scriptInstance) {
   console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`);
   return null;
  }

  try {
   // 型アサーションを使用して型の不整合を解決
   return scriptInstance.run(comment, (rule.scriptParams ?? {}) as any);
  } catch (error) {
   console.error(`スクリプト実行エラー (${scriptId}):`, error);
   return null;
  }
 }

 /**
  * スクリプトの再初期化
  */
 reinitializeScripts(): void {
  Object.keys(this.scriptInstances).forEach((key) => {
   delete this.scriptInstances[key];
  });
  this.initializeScripts();
 }
}
