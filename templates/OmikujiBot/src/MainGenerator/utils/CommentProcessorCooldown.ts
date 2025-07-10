// src/MainGenerator/utils/CommentProcessorCooldown.ts

const timeThreshold = 5; // これ以上経過した古いコメントは判定しない(秒)
const processingCooldownSeconds = 3; // 処理クールダウン時間

// 時間閾値内かどうかをチェック
export function isWithinTimeThreshold(timestamp: string, currentTime: number): boolean {
 const secondsSinceComment = (currentTime - new Date(timestamp).getTime()) / 1000;
 return secondsSinceComment <= timeThreshold;
}

// 処理のクールダウン時間内かどうかをチェック
export function isWithinProcessingCooldown(
 currentTime: number,
 lastProcessedTime: number
): boolean {
 return (currentTime - lastProcessedTime) / 1000 < processingCooldownSeconds;
}
