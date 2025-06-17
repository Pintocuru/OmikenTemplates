// src/MainGenerator/utils/processors/ScriptManager.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CommentRule } from '@/types/OmikujiTypes';
import { ScriptClass } from '@/types/PresetTypes';
import { omikujiSampleData } from '@/omikujiSampleData';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';

export class ScriptManager {
 private readonly scriptInstances: Record<string, ScriptClass> = {};

 constructor() {
  this.initializeScripts();
 }

 /**
  * 外部スクリプトの初期化
  */
 private initializeScripts(): void {
  try {
   const commentRules: Record<string, CommentRule> = omikujiSampleData.comments;

   for (const rule of Object.values(commentRules)) {
    const { scriptId, scriptParams: scriptSettings } = rule;

    if (scriptId && scriptGameMap[scriptId]) {
     const scriptInstance = scriptGameMap[scriptId].execute;

     if (scriptSettings) {
      scriptInstance.setup(scriptSettings);
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
 executeScript(comment: Comment, rule: CommentRule): any {
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
   // TODO:rule.omikuji はparamsではない。必ずエラーになる
   return scriptInstance.run(comment, rule.omikuji);
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
