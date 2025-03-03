// src/apps/AnyGenerator/generator.ts
import AnyGenerator from '@/components/BasicCounter.vue';

window.AppComponent = window.AppComponent || {};
window.AppComponent.component = AnyGenerator;

// OneSDK が準備完了済みなら `initVueApp` を実行
if (window.AppComponent.initApp) window.AppComponent.initApp();
