/**
 * HeaderComponent — 頂部導覽列（Seoul Editorial 風格）
 *
 * ============================================================
 * 【Vue 對比】Router.events Observable vs useRoute() composable
 * ============================================================
 *
 * 這個元件需要偵測「目前是否在首頁」，來決定是否顯示返回按鈕。
 *
 * Vue 的做法（vue-app/components/common/AppHeader.vue）：
 *   <script setup>
 *   const route = useRoute()
 *   const router = useRouter()
 *   const isHome = computed(() => route.name === 'home')
 *   const goBack = () => router.back()
 *   </script>
 *
 * Angular 的做法完全不同：
 * 1. 注入 Router 服務
 * 2. 訂閱 Router.events（這是一個 Observable 串流）
 * 3. 過濾出 NavigationEnd 事件
 * 4. 從事件中取得當前 URL
 * 5. 在 template 中用 async pipe 訂閱
 *
 * 為什麼 Angular 需要 Observable？
 * - Angular 的路由資訊不是「響應式」的（不像 Vue 的 route 是 reactive proxy）
 * - 需要主動「訂閱」路由事件才能知道路由變化
 * - Observable 配合 async pipe 可以自動管理訂閱/取消訂閱的生命週期
 *
 * 【Vue 對比】async pipe
 * Angular：<div *ngIf="isHome$ | async">...</div>
 *   - async pipe 自動訂閱 Observable，自動在元件銷毀時取消訂閱
 *   - 不需要手動 subscribe/unsubscribe
 *
 * Vue：<div v-if="isHome">...</div>
 *   - computed 自動追蹤依賴，不需要手動管理
 *   - 更簡潔，但底層機制完全不同（Proxy vs Observable）
 * ============================================================
 */

import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * isHome$ — 是否在首頁的 Observable
   *
   * $ 後綴是 Angular/RxJS 社群慣例，表示這是一個 Observable。
   *
   * 【Vue 對比】
   * Vue：const isHome = computed(() => route.name === 'home')
   *   - computed 回傳一個 Ref<boolean>，模板直接讀取 .value
   *
   * Angular：isHome$ 是 Observable<boolean>
   *   - 模板中用 async pipe 消費：*ngIf="isHome$ | async"
   *   - async pipe 會自動處理訂閱和取消訂閱
   *
   * Router.events 是一個所有路由事件的串流，包含：
   * - NavigationStart（導覽開始）
   * - NavigationEnd（導覽完成）
   * - NavigationCancel、NavigationError 等
   *
   * 我們用 pipe 運算子鏈來轉換串流：
   * 1. filter：只保留 NavigationEnd 事件（其他事件丟棄）
   * 2. map：從事件中取出 URL，判斷是否為首頁路徑
   */
  isHome$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {
    this.isHome$ = this.router.events.pipe(
      /**
       * filter 運算子 — 過濾串流中的事件
       *
       * 【Vue 對比】
       * Vue 不需要過濾，因為 route 物件已經是「當前路由」的快照。
       * Angular 的 Router.events 包含所有類型的事件，
       * 必須手動過濾出我們關心的 NavigationEnd。
       *
       * 類比：Vue 的 watch(route, ...) 只在路由變化時觸發，
       * 而 Router.events 會發送導覽過程中的「每一步」事件。
       */
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),

      /**
       * map 運算子 — 轉換串流中的值
       *
       * 將 NavigationEnd 事件轉換為 boolean（是否在首頁）。
       *
       * 【Vue 對比】
       * Vue：computed(() => route.path === '/')
       * Angular：map(event => event.urlAfterRedirects === '/')
       *
       * urlAfterRedirects 比 url 更準確，因為它反映了重新導向後的最終 URL。
       */
      map((event) => event.urlAfterRedirects === '/'),
    );
  }

  /**
   * goBack — 返回上一頁
   *
   * 【Vue 對比】
   * Vue：router.back() 或 router.go(-1)
   * Angular：location.back()
   *
   * 注意：Angular 用的是 @angular/common 的 Location 服務，
   * 不是瀏覽器原生的 window.location。
   * Location 服務可以正確處理 Angular 的路由歷史，
   * 包括 hash 路由和 path 路由兩種模式。
   */
  goBack(): void {
    this.location.back();
  }
}
