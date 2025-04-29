// src/scripts/CreateComponentMapping
import { ComponentType } from '@/scripts/schema';
import basic from '@packages/basic.vue';
import mini from '@packages/mini.vue';
import capsule from '@packages/capsule.vue';
import BoardCounter from '@packages/BoardCounter.vue';

// 直接読み込んだコンポーネントのマッピング
const componentMapping: Record<ComponentType, any> = {
 basic,
 mini,
 capsule,
 BoardCounter
};

// コンポーネントタイプに基づいてコンポーネントを取得する関数
export function getComponent(type: ComponentType) {
 return componentMapping[type] || componentMapping['basic'];
}
