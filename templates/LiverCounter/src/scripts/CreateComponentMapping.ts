// src/scripts/CreateComponentMapping
import { defineAsyncComponent } from 'vue';
import { ComponentType } from '@/scripts/schema';
import basic from '@packages/basic/basic.vue';
import capsule from '@packages/capsule/capsule.vue';

// 直接読み込んだコンポーネントのマッピング
const componentMapping: Record<ComponentType, any> = {
 basic,
 capsule
};

// コンポーネントタイプに基づいてコンポーネントを取得する関数
export function getComponent(type: ComponentType) {
 return componentMapping[type] || componentMapping['basic'];
}

// windowに設置したコンポーネントのマッピング
/**
const componentMapping: Record<ComponentType, any> = {
 basic: defineAsyncComponent(() => Promise.resolve(window.components.basic)),
 capsule: defineAsyncComponent(() => Promise.resolve(window.components.capsule))
};
*/
