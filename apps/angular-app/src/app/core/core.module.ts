/**
 * CoreModule — 核心模組（全域服務 + HTTP 攔截器）
 *
 * ============================================================
 * 【Vue 對比】CoreModule vs main.js 設定
 * ============================================================
 *
 * Angular 的 CoreModule 是一個「只引入一次」的模組，
 * 用來提供全域 singleton 服務和 HTTP 攔截器。
 *
 * Vue 沒有 CoreModule 的概念，而是在 main.js 中設定：
 *
 *   // main.js（Vue）
 *   import axios from 'axios'
 *   import { setupInterceptors } from './api/loading'
 *
 *   setupInterceptors(axios)  // 設定全域攔截器
 *   app.provide('httpClient', axios)  // 全域注入 HTTP client
 *
 *   // Angular（CoreModule）
 *   @NgModule({
 *     imports: [HttpClientModule],
 *     providers: [
 *       { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
 *     ]
 *   })
 *   export class CoreModule { ... }
 *
 * 為什麼要有 CoreModule？
 * 1. 防止被多次引入（有 guard 機制）
 * 2. 集中管理全域服務
 * 3. 職責分離（和 SharedModule 分開）
 *
 * CoreModule vs SharedModule：
 * - CoreModule：singleton 服務、攔截器（只引入一次）
 * - SharedModule：共用元件、指令、管道（可被多次引入）
 *
 * 【Vue 對比】
 * Vue 不區分 Core/Shared，通常用：
 * - plugins/ 目錄放全域設定（類似 CoreModule）
 * - components/common/ 放共用元件（類似 SharedModule）
 * ============================================================
 */

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  /**
   * imports — 引入 HttpClientModule
   *
   * 提供 Angular 的 HttpClient 服務。
   *
   * 【Vue 對比】
   * Vue 用 Axios：import axios from 'axios'
   * Angular 用 HttpClient：constructor(private http: HttpClient) {}
   *
   * Axios 是第三方套件，HttpClient 是 Angular 內建的。
   */
  imports: [
    HttpClientModule,
  ],

  /**
   * providers — 註冊全域服務
   *
   * HTTP_INTERCEPTORS — 使用 multi: true 的 InjectionToken
   * 可以註冊多個攔截器，Angular 會按順序鏈式呼叫。
   *
   * 【Vue 對比】
   * Axios 的攔截器也可以註冊多個：
   *   httpClient.interceptors.request.use(interceptor1)
   *   httpClient.interceptors.request.use(interceptor2)
   *
   * 差異在於 Angular 用 DI token 統一管理，
   * Axios 直接在 httpClient 實例上掛載。
   */
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  /**
   * 防止重複引入的 Guard（保護機制）
   *
   * 【Vue 對比】
   * Vue 不需要這個機制，因為 app.use() 只會執行一次。
   *
   * Angular 的 NgModule 可能被多個模組引入，
   * 如果 CoreModule 被引入兩次，singleton 服務會被建立兩次，
   * 導致不可預測的行為（例如兩個 loading 計數器）。
   *
   * @Optional() — 讓這個參數變成可選的（第一次引入時找不到，不會報錯）
   * @SkipSelf() — 跳過自己，只從「父注入器」尋找（避免自己注入自己的無限迴圈）
   *
   * 如果 parentModule 存在，表示 CoreModule 已經被引入過一次了。
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule 只能被 AppModule 引入一次！如果需要在子模組中使用共用元件，請用 SharedModule。',
      );
    }
  }
}
