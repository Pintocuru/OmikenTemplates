// src/scripts/CreateComponentMapping
import { ComponentType } from '@/scripts/schema';
import BasicSquare from '@/packages/BasicSquare.vue';
import BasicCircle from '@/packages/BasicCircle.vue';
import capsule from '@packages/capsule.vue';
import instaUpVote from '@packages/instaUpVote.vue';
import CyberNeon from '@packages/CyberNeon.vue';
import minimal from '@packages/minimal.vue';
import holographic from '@packages/holographic.vue';
import ProgressLight from '@packages/ProgressLight.vue';
import ProgressDark from '@packages/ProgressDark.vue';

// 直接読み込んだコンポーネントのマッピング
const componentMapping: Record<ComponentType, any> = {
 BasicSquare,
 BasicCircle,
 capsule,
 instaUpVote,
 CyberNeon,
 minimal,
 holographic,
 ProgressLight,
 ProgressDark
};

// コンポーネントタイプに基づいてコンポーネントを取得する関数
export function getComponent(type: ComponentType) {
 return componentMapping[type] || componentMapping['BasicSquare'];
}
