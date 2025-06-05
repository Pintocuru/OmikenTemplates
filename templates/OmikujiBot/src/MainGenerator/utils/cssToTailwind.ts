// src/utils/cssToTailwind.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import OneSDK from '@onecomme.com/onesdk';

/**
 * CSS変数から色情報のみを抽出してスタイルを生成するユーティリティ関数
 */
export interface CommentColorStyles {
 backgroundStyle: Record<string, string>;
 textStyle: Record<string, string>;
 membershipStyle: Record<string, string>;
 hasCustomBackground: boolean;
 hasCustomText: boolean;
 hasCustomMembership: boolean;
}

/**
 * CSS変数から色情報を取得
 */
export function getCommentColorStyles(comment: Comment): CommentColorStyles {
 const cssVars = OneSDK.getCommentStyle(comment);

 const result: CommentColorStyles = {
  backgroundStyle: {},
  textStyle: {},
  membershipStyle: {},
  hasCustomBackground: false,
  hasCustomText: false,
  hasCustomMembership: false
 };

 if (!cssVars) {
  return result;
 }

 // 背景色の設定
 if (cssVars['--lcv-background-color']) {
  result.backgroundStyle.backgroundColor = cssVars['--lcv-background-color'];
  result.hasCustomBackground = true;
 }

 // テキスト色の設定
 if (cssVars['--lcv-text-color']) {
  result.textStyle.color = cssVars['--lcv-text-color'];
  result.hasCustomText = true;
 }

 // メンバーシップ色の設定
 if (cssVars['--lcv-membership-color']) {
  result.membershipStyle.backgroundColor = cssVars['--lcv-membership-color'];
  result.hasCustomMembership = true;
 }

 return result;
}
