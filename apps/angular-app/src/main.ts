/**
 * Angular 應用程式進入點
 *
 * 【Vue 對比】
 * Vue 3 的進入點（main.js / main.ts）：
 *   import { createApp } from 'vue'
 *   import App from './App.vue'
 *   const app = createApp(App)
 *   app.use(router)
 *   app.use(pinia)
 *   app.mount('#app')
 *
 * Angular 的進入點：
 *   platformBrowserDynamic().bootstrapModule(AppModule)
 *
 * 關鍵差異：
 * 1. Vue 用「函式呼叫鏈」組裝應用（createApp → use → mount）
 *    Angular 用「模組系統」組裝（NgModule 的 imports 陣列）
 *
 * 2. Vue 的插件（router, pinia）在 main.js 註冊
 *    Angular 的功能模組在 AppModule 的 imports 中註冊
 *
 * 3. Vue 掛載到 DOM id 選擇器（'#app'）
 *    Angular 自動尋找 bootstrap 元件的 selector（'app-root'）
 *
 * 4. Angular 需要 zone.js 來做變更偵測（Change Detection），
 *    Vue 則用 Proxy-based 的響應式系統，不需要額外的 polyfill。
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/**
 * 生產模式優化
 *
 * enableProdMode() 會關閉 Angular 的開發模式檢查：
 * - 關閉雙重變更偵測（Angular 開發模式會跑兩次 change detection 來抓錯）
 * - 移除 ng.probe 等 debug 工具
 *
 * 【Vue 對比】
 * Vue 透過 __VUE_PROD_DEVTOOLS__ 和建置工具的 process.env.NODE_ENV 來控制。
 * Vite 會在 build 時自動移除開發模式的程式碼（tree-shaking）。
 */
if (environment.production) {
  enableProdMode();
}

/**
 * 啟動 Angular 應用
 *
 * platformBrowserDynamic() 建立一個「瀏覽器平台」，
 * 然後用它來啟動（bootstrap）我們的根模組 AppModule。
 *
 * 「Dynamic」代表使用 JIT（Just-In-Time）編譯，
 * 模板在瀏覽器中即時編譯。生產環境通常用 AOT（Ahead-Of-Time），
 * 在建置時就把模板編譯完成，效能更好。
 *
 * 【Vue 對比】
 * Vue 也有類似的概念：
 * - @vue/compiler-sfc：建置時編譯 SFC 模板（類似 AOT）
 * - vue/dist/vue.esm-bundler.js：包含執行時編譯器（類似 JIT）
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error('應用程式啟動失敗：', err));
