import AnyGenerator from '@/packages/basic/basic.vue';

window.AppComponent = window.AppComponent || {};
window.AppComponent.component = AnyGenerator;
if (window.AppComponent.initApp) window.AppComponent.initApp();
