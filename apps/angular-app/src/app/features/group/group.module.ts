/**
 * GroupModule — 團體詳情功能模組
 *
 * ============================================================
 * 【Vue 對比】NgModule vs 直接 import
 * ============================================================
 *
 * Vue 版本的團體頁面（GroupPage.vue）不需要模組概念：
 *   <script setup>
 *   import MemberCard from '@/components/member/MemberCard.vue'
 *   // 直接 import 就能用，不需要「註冊」
 *   </script>
 *
 * Angular 需要透過 NgModule 來：
 * 1. 宣告此功能的所有元件（GroupDetailComponent、MemberAvatarComponent）
 * 2. 引入依賴模組（SharedModule 提供 CommonModule、Material 等）
 * 3. 引入路由模組（GroupRoutingModule）
 *
 * 延遲載入機制：
 * AppRoutingModule 中定義 loadChildren 指向此模組，
 * 使用者導航到 /group/:id 時才會下載這個 chunk。
 *
 * 【Vue 對比】
 * Vue Router 的延遲載入粒度是「元件」：
 *   component: () => import('@/pages/GroupPage.vue')
 *
 * Angular 的延遲載入粒度是「模組」：
 *   loadChildren: () => import('./features/group/group.module')
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GroupRoutingModule } from './group-routing.module';

import { GroupDetailComponent } from './group-detail/group-detail.component';
import { MemberAvatarComponent } from './components/member-avatar/member-avatar.component';

@NgModule({
  /**
   * declarations — 宣告歸屬於 GroupModule 的元件
   *
   * 【Vue 對比】
   * Vue：在 GroupPage.vue 中 import MemberCard 就能用
   * Angular：必須在此列出所有元件，框架才認得
   */
  declarations: [
    GroupDetailComponent,
    MemberAvatarComponent,
  ],

  /**
   * imports — 引入依賴模組
   *
   * SharedModule：提供 CommonModule、RouterModule、Material 模組
   * GroupRoutingModule：定義 '' → GroupDetailComponent 的路由
   */
  imports: [
    SharedModule,
    GroupRoutingModule,
  ],
})
export class GroupModule {}
