/**
 * 根模組 — AppModule
 *
 * ============================================================
 * 【Vue 對比】NgModule vs Vue 的 app.use()
 * ============================================================
 *
 * Angular 使用「模組系統」（NgModule）來組織應用程式。
 * 每個 NgModule 是一個用 @NgModule 裝飾器標記的 class，
 * 它聲明了這個模組「擁有什麼」、「需要什麼」、「提供什麼」。
 *
 * Vue 3 沒有模組的概念，而是用更扁平的方式組裝：
 *   const app = createApp(App)
 *   app.use(router)          // 對應 Angular 的 imports: [RouterModule]
 *   app.use(pinia)           // 對應 Angular 的 imports: [StoreModule]
 *   app.component('MyComp')  // 對應 Angular 的 declarations
 *   app.mount('#app')
 *
 * @NgModule 的四個核心屬性：
 *
 * 1. declarations — 宣告「屬於這個模組的元件/指令/管道」
 *    【Vue 對比】Vue 用 app.component() 全域註冊，或在 SFC 中直接 import
 *
 * 2. imports — 引入「其他模組」（取得它們 export 的東西）
 *    【Vue 對比】Vue 用 app.use() 安裝插件
 *
 * 3. providers — 設定「依賴注入的服務」
 *    【Vue 對比】Vue 用 app.provide() / inject()，
 *    但 Angular 的 DI 系統更強大（支援階層式注入、Token、工廠函式等）
 *
 * 4. bootstrap — 指定「根元件」（只有根模組才需要）
 *    【Vue 對比】Vue 用 createApp(App) 直接指定根元件
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * NgRx Store — 狀態管理
 *
 * 【Vue 對比】
 * Angular 生態系用 NgRx（Redux 模式），Vue 生態系用 Pinia。
 *
 * NgRx 的核心概念：
 * - Store：全域狀態容器（類似 Pinia 的 defineStore）
 * - Actions：描述「發生了什麼事」的物件（類似 Pinia 的 actions，但更顯式）
 * - Reducers：純函式，根據 Action 計算新狀態（Pinia 沒有，直接修改 state）
 * - Effects：處理副作用（API 呼叫等），類似 Pinia actions 中的 async 邏輯
 * - Selectors：從 Store 中選取資料的純函式（類似 Pinia 的 getters）
 *
 * NgRx 比 Pinia 更囉嗦，但也更可預測：
 * - 狀態只能透過 dispatch Action → Reducer 來更新（單向資料流）
 * - 每次狀態變更都有完整的追蹤紀錄（DevTools 可時間旅行）
 *
 * StoreModule.forRoot({}) — 在根模組初始化 Store
 * EffectsModule.forRoot([]) — 在根模組初始化 Effects
 * forRoot vs forChild：
 *   - forRoot()：只在 AppModule 呼叫一次，建立 singleton 服務
 *   - forChild()：在功能模組中使用，註冊額外的 reducer/effects
 *   【Vue 對比】Pinia 沒有這個區分，defineStore 自動是 singleton
 */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '@env/environment';

// TODO: Task 3 完成後引入 CoreModule（HTTP 攔截器、全域服務）
// TODO: Task 4 完成後引入 SharedModule（共用元件如 Header, Footer, LoadingBar）

@NgModule({
  /**
   * declarations — 宣告屬於此模組的元件
   *
   * 目前只有根元件 AppComponent。
   * 每個元件只能屬於「一個」模組，不能重複宣告。
   *
   * 【Vue 對比】
   * Vue 的元件不需要「宣告」歸屬，直接 import 就能用。
   * Angular 的嚴格歸屬機制可以防止元件被意外使用，
   * 但也增加了管理複雜度。
   */
  declarations: [
    AppComponent,
  ],

  /**
   * imports — 引入其他模組
   *
   * BrowserModule：提供瀏覽器環境必要的服務（DOM 操作、事件處理等）
   *   只能在 AppModule 引入一次。子模組用 CommonModule。
   *
   * BrowserAnimationsModule：Angular Material 的動畫支援
   *   【Vue 對比】Vue 用內建的 <Transition> 元件，不需要額外模組
   *
   * AppRoutingModule：路由設定
   *   【Vue 對比】Vue 用 app.use(router)
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // CoreModule,   // TODO: Task 3 完成後取消註解
    // SharedModule, // TODO: Task 4 完成後取消註解

    /**
     * NgRx Store 初始化
     *
     * forRoot({}) 傳入空的 reducers 物件，
     * Task 2 會加入實際的 theme reducer。
     */
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),

    /**
     * NgRx DevTools — 只在開發環境啟用
     *
     * 【Vue 對比】
     * Vue 有 Vue DevTools 瀏覽器擴充功能，
     * Pinia 的 DevTools 支援是自動啟用的（開發模式）。
     * NgRx 需要手動設定 StoreDevtoolsModule。
     */
    StoreDevtoolsModule.instrument({
      maxAge: 25,                         // 保留最近 25 個 action 紀錄
      logOnly: environment.production,    // 生產環境只記錄、不允許修改
    }),
  ],

  /**
   * providers — 依賴注入的服務提供者
   *
   * 【Vue 對比】
   * Angular 的 DI 是框架核心，幾乎所有服務都透過 DI 注入。
   * Vue 的 provide/inject 主要用於跨層級傳遞，
   * 大部分狀態管理用 Pinia、composables 處理。
   *
   * Angular DI 的優勢：
   * - 自動處理服務的生命週期（singleton、每次注入新實例等）
   * - 方便做測試替換（mock injection）
   * - 階層式注入器（元件層級可覆蓋父層的服務）
   */
  providers: [],

  /**
   * bootstrap — 指定啟動元件
   *
   * Angular 會找到 HTML 中的 <app-root>，
   * 並用 AppComponent 的模板替換它。
   *
   * 通常只有一個 bootstrap 元件。
   */
  bootstrap: [AppComponent],
})
export class AppModule {}
