import AnyGenerator from '@/packages/capsule/capsule.vue';

window.AppComponent = window.AppComponent || {};
window.AppComponent.component = AnyGenerator;
if (window.AppComponent.initApp) window.AppComponent.initApp();
