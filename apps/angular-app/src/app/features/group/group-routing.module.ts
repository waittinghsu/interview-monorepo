/**
 * GroupRoutingModule — 團體功能路由模組
 *
 * ============================================================
 * 【Vue 對比】forChild() vs 直接定義在 routes 陣列
 * ============================================================
 *
 * Vue Router 的路由全部集中在 router/index.js：
 *   { path: '/group/:id', component: () => import('@/pages/GroupPage.vue') }
 *
 * Angular 將路由分散到各功能模組中：
 * - AppRoutingModule（forRoot）：path: 'group/:id' → loadChildren
 * - GroupRoutingModule（forChild）：path: '' → GroupDetailComponent
 *
 * 這裡 path: '' 是因為父路由已經定義了 'group/:id'，
 * 所以子路由的 '' 對應完整路徑 '/group/:id'。
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupDetailComponent } from './group-detail/group-detail.component';

/**
 * 團體路由定義
 *
 * 【Vue 對比】
 * Vue：{ path: '/group/:id', name: 'Group', component: GroupPage }
 * Angular：{ path: '', component: GroupDetailComponent }
 *
 * path: '' 因為父路由 'group/:id' 已處理路徑匹配
 */
const routes: Routes = [
  { path: '', component: GroupDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
