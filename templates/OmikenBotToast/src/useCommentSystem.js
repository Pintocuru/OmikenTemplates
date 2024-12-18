"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommentSystem = useCommentSystem;
// src/composables/useCommentSystem.ts
const vue_1 = require("vue");
const onesdk_1 = __importDefault(require("@onecomme.com/onesdk"));
function useCommentSystem(botUserId, pluginUid) {
    const charas = (0, vue_1.ref)({});
    const processedComments = (0, vue_1.ref)([]);
    const commentQueue = (0, vue_1.ref)([]);
    // キャラクターデータ取得
    async function fetchCharacters() {
        try {
            const url = `http://localhost:11180/api/plugins/${pluginUid}?mode=data&type=Charas`;
            const response = await onesdk_1.default.get(url, {});
            charas.value = response.data.response || {};
        }
        catch (error) {
            console.error('キャラクターデータの取得に失敗:', error);
            charas.value = {};
        }
    }
    // コメント処理のロジック
    function processComment(comment) {
        const chara = Object.values(charas.value).find((c) => c.name === comment.data.name);
        if (!chara) {
            console.warn(`キャラクターが見つかりません: ${comment.data.name}`);
            return null;
        }
        return {
            id: comment.data.id,
            content: comment.data.speechText || '',
            name: chara.name,
            textColor: chara.color?.['--lcv-text-color'] || 'white',
            backgroundColor: chara.color?.['--lcv-background-color'] || 'rgba(0, 0, 0, 0.7)',
            profileImage: comment.data.profileImage || null,
            lifeTime: calculateLifeTime(comment)
        };
    }
    // コメント表示時間計算
    function calculateLifeTime(comment) {
        const BASE_DURATION = 10000;
        const CHAR_THRESHOLD = 30;
        const extraTime = Math.max((comment.data.speechText?.length ?? 0) - CHAR_THRESHOLD, 0) * 100;
        return BASE_DURATION + extraTime;
    }
    // コメントシステムのセットアップ
    function setupCommentListener() {
        const subscription = onesdk_1.default.subscribe({
            action: 'comments',
            callback: (newComments) => {
                const now = Date.now();
                // 5秒以上経過したコメントは無視
                const recentComments = newComments.filter((comment) => now <= new Date(comment.data.timestamp).getTime() + 5000);
                // ボットユーザーのコメントのみ処理
                recentComments
                    .filter((comment) => comment.data.userId === botUserId)
                    .forEach((comment) => {
                    const processedComment = processComment(comment);
                    if (processedComment) {
                        processedComments.value.unshift(processedComment);
                    }
                });
            }
        });
        return () => {
            // クリーンアップ関数
            onesdk_1.default.unsubscribe(subscription);
        };
    }
    // コメント自動削除
    function startCommentCleaner() {
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            processedComments.value = processedComments.value.filter((comment) => now - comment.timestamp < comment.lifeTime);
        }, 1000);
        return () => clearInterval(cleanupInterval);
    }
    // OneSDKの初期化
    async function initializeOneSDK() {
        await fetchCharacters();
        onesdk_1.default.setup({
            permissions: onesdk_1.default.usePermission([onesdk_1.default.PERM.COMMENT]),
            mode: 'diff'
        });
        onesdk_1.default.connect();
    }
    // コンポーネントのライフサイクルフック
    const unsubscribeComment = setupCommentListener();
    const stopCommentCleaner = startCommentCleaner();
    (0, vue_1.onUnmounted)(() => {
        unsubscribeComment();
        stopCommentCleaner();
    });
    return {
        processedComments,
        initializeOneSDK
    };
}
