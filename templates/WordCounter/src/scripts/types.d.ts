// src/scripts/types.d.ts

// vueの使用を宣言する
declare module '*.vue' {
 import { DefineComponent } from 'vue';
 const component: DefineComponent<{}, {}, any>;
 export default component;
}
