/**
 * MemberRoutingModule — 成員功能路由模組
 *
 * ============================================================
 * 【Vue 對比】forChild() vs 集中式路由
 * ============================================================
 *
 * Vue Router 集中定義：
 *   { path: '/member/:id', name: 'Member', component: () => import('@/pages/MemberPage.vue') }
 *
 * Angular 分散定義：
 * - AppRoutingModule：path: 'member/:id' → loadChildren
 * - MemberRoutingModule：path: '' → MemberDetailComponent
 *
 * 路徑解析：
 * 父路由 'member/:id' + 子路由 '' = 完整路徑 '/member/:id'
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberDetailComponent } from './member-detail/member-detail.component';

const routes: Routes = [
  { path: '', component: MemberDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
