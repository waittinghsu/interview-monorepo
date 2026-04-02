/**
 * HomeRoutingModule — 首頁路由模組
 *
 * ============================================================
 * 【Vue 對比】forChild() vs 直接定義在 routes 陣列
 * ============================================================
 *
 * Angular 的「功能模組」路由用 RouterModule.forChild() 註冊，
 * 它只會加入子路由，不會重新初始化路由器。
 *
 * Vue Router 的路由全部定義在一個地方（router/index.js）：
 *   const routes = [
 *     { path: '/', component: () => import('@/pages/HomePage.vue') },
 *     { path: '/group/:id', component: () => import('@/pages/GroupPage.vue') },
 *   ]
 *
 * Angular 則是分散在各個功能模組中：
 * - AppRoutingModule（forRoot）：定義頂層路由 + loadChildren
 * - HomeRoutingModule（forChild）：定義 '' → HomeComponent
 * - GroupRoutingModule（forChild）：定義 '' → GroupComponent
 *
 * 好處是路由和功能模組綁定，刪除模組時路由也一起移除。
 * 缺點是路由分散在多個檔案，不容易一眼看到完整路由表。
 *
 * 這裡 path: '' 是因為父路由已經定義了 path: ''（在 app-routing 中），
 * 所以子路由的 '' 對應的完整路徑就是 '/'（首頁）。
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

/**
 * 首頁路由定義
 *
 * path: '' 表示這是功能模組的預設（根）路由。
 * 因為 AppRoutingModule 中 loadChildren 對應的 path 也是 ''，
 * 所以最終完整路徑 = '' + '' = '/'（首頁）。
 *
 * 【Vue 對比】
 * Vue：{ path: '/', name: 'Home', component: HomePage }
 * Angular：{ path: '', component: HomeComponent }
 */
const routes: Routes = [
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
