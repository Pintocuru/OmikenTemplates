// src/scripts/types.d.ts

declare module 'daisyui';
// vueの使用を宣言する
declare module '*.vue' {
 import { DefineComponent } from 'vue';
 const component: DefineComponent<{}, {}, any>;
 export default component;
}
