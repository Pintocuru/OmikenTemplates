// templates/common/settings.ts

// 設定オブジェクト SETTINGS
export const SETTINGS: SettingsTemplates = {
 isCreateService: true, // わんコメに自動で枠を作成してもいいか
 BASE_URL: 'http://localhost:11180/api', // わんコメのapi
 basicDelaySeconds: 1, // わんコメに投稿する際の基本遅延(秒)
 BOT_USER_ID: 'FirstCounter',
 BOT_DEFAULT_NAME: 'おみくじBOT'
};

interface SettingsTemplates {
 isCreateService: boolean;
 BASE_URL: string;
 basicDelaySeconds: number;
 BOT_USER_ID: string;
 BOT_DEFAULT_NAME: string;
}
