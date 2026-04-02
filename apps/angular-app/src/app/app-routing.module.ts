/**
 * 路由模組 — AppRoutingModule
 *
 * ============================================================
 * 【Vue 對比】Vue Router vs Angular Router
 * ============================================================
 *
 * 兩者的核心概念非常相似，但語法和設定方式不同：
 *
 * ┌─────────────────┬──────────────────────┬──────────────────────┐
 * │ 概念            │ Vue Router           │ Angular Router       │
 * ├─────────────────┼──────────────────────┼──────────────────────┤
 * │ 路由定義        │ routes 陣列          │ Routes 陣列          │
 * │ 掛載點          │ <router-view>        │ <router-outlet>      │
 * │ 導航連結        │ <router-link>        │ <a routerLink>       │
 * │ 動態參數        │ :id                  │ :id                  │
 * │ 延遲載入        │ () => import(...)    │ loadChildren         │
 * │ 路由守衛        │ beforeEach / 路由級  │ CanActivate guards   │
 * │ 路由元資料      │ meta: { ... }        │ data: { ... }        │
 * │ 程式導航        │ router.push()        │ router.navigate()    │
 * └─────────────────┴──────────────────────┴──────────────────────┘
 *
 * 最大差異：Angular 路由基於「模組」做延遲載入（loadChildren）。
 * 每個延遲載入的路由都指向一個「功能模組」（Feature Module），
 * 該模組包含自己的元件、路由、服務等。
 *
 * Vue Router 則直接延遲載入「元件」：
 *   component: () => import('./pages/HomePage.vue')
 *
 * Angular 的模組化延遲載入粒度更大，
 * 但也代表每個頁面/功能都需要建立一個完整的模組。
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * 路由定義
 *
 * 【Vue 對比】
 * Vue Router 的路由定義：
 *   const routes = [
 *     { path: '/', component: () => import('./pages/HomePage.vue') },
 *     { path: '/group/:id', component: () => import('./pages/GroupPage.vue') },
 *   ]
 *
 * Angular 使用 loadChildren 做模組級延遲載入：
 * - 路徑指向一個模組（不是元件）
 * - 該模組內部有自己的子路由定義
 * - 打包時會自動分割成獨立的 chunk
 *
 * 注意：下方引用的模組尚未建立（Task 5-7 會實作），
 * 這是正常的，Angular CLI 在實際導航到該路由時才會載入。
 */
const routes: Routes = [
  {
    path: '',
    /**
     * 延遲載入 HomeModule
     *
     * 【Vue 對比】
     * Vue：component: () => import('@/pages/HomePage.vue')
     * Angular：loadChildren 載入整個模組，模組內再定義元件和子路由
     *
     * 這種方式的好處是一個「功能區塊」的所有相關檔案
     * （元件、服務、子路由）都打包在同一個 chunk 中。
     */
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'group/:id',
    /**
     * 動態路由參數
     *
     * 【Vue 對比】
     * Vue：path: '/group/:id' → 用 useRoute().params.id 取得
     * Angular：path: 'group/:id' → 用 ActivatedRoute.params 取得（Observable）
     *
     * Angular 的路由參數是 Observable，可以訂閱參數變化：
     *   this.route.params.subscribe(params => { ... })
     *
     * Vue 的路由參數是響應式 ref，可以用 watch 監聽：
     *   watch(() => route.params.id, (newId) => { ... })
     */
    loadChildren: () =>
      import('./features/group/group.module').then((m) => m.GroupModule),
  },
  {
    path: 'member/:id',
    loadChildren: () =>
      import('./features/member/member.module').then((m) => m.MemberModule),
  },
  {
    /**
     * 萬用路由（Wildcard Route）— 處理 404
     *
     * 【Vue 對比】
     * Vue：{ path: '/:pathMatch(.*)*', component: NotFoundPage }
     * Angular：{ path: '**', redirectTo: '' }
     *
     * 這裡選擇重導向到首頁，而不是顯示 404 頁面。
     * 注意：萬用路由必須放在最後面，因為路由是按順序比對的。
     */
    path: '**',
    redirectTo: '',
  },
];

/**
 * 路由模組
 *
 * RouterModule.forRoot() 在根模組初始化路由器，
 * 並傳入路由設定和全域選項。
 *
 * 【Vue 對比】
 * Vue Router 的初始化：
 *   const router = createRouter({
 *     history: createWebHistory(),
 *     routes,
 *     scrollBehavior: () => ({ top: 0 }),
 *   })
 *
 * 對應關係：
 * - scrollPositionRestoration: 'top' ↔ scrollBehavior: () => ({ top: 0 })
 * - forRoot() ↔ createRouter()（都只呼叫一次）
 * - forChild() ↔ 不需要（Vue 的子路由直接寫在 routes 裡）
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      /**
       * 捲軸位置還原
       *
       * 'top'：每次導航都捲到頂部
       * 'enabled'：瀏覽器前進/後退時還原捲軸位置
       *
       * 【Vue 對比】
       * Vue Router 用 scrollBehavior 函式，可以更靈活地控制：
       *   scrollBehavior(to, from, savedPosition) {
       *     return savedPosition || { top: 0 }
       *   }
       */
      scrollPositionRestoration: 'top',
    }),
  ],
  /**
   * exports: [RouterModule]
   *
   * 將 RouterModule 匯出，讓 AppModule 可以使用路由指令：
   * - <router-outlet>：路由掛載點
   * - routerLink：導航指令
   * - routerLinkActive：活躍連結樣式
   *
   * 【Vue 對比】
   * Vue 的 app.use(router) 會自動全域註冊 <router-view> 和 <router-link>。
   * Angular 需要透過 exports 明確匯出，其他模組才能使用。
   */
  exports: [RouterModule],
})
export class AppRoutingModule {}
