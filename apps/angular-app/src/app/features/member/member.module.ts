/**
 * MemberModule — 成員詳情功能模組
 *
 * ============================================================
 * 【Vue 對比】NgModule vs 直接 import
 * ============================================================
 *
 * Vue 版本的成員頁面（MemberPage.vue）不需要模組：
 *   <script setup>
 *   import { getMemberById, getGroupById } from '@/data/kpop.js'
 *   // 直接 import helper function，不需要任何「註冊」步驟
 *   </script>
 *
 * Angular 需要 NgModule 來宣告元件、引入依賴。
 * 這個模組只包含一個元件（MemberDetailComponent），
 * 是最簡單的功能模組結構。
 *
 * 延遲載入：
 * AppRoutingModule 中 'member/:id' → loadChildren 指向此模組，
 * 使用者導航到成員頁面時才下載。
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';

import { MemberDetailComponent } from './member-detail/member-detail.component';

@NgModule({
  /**
   * declarations — 只有一個元件
   *
   * 【Vue 對比】
   * Vue：MemberPage.vue 就是一個檔案，不需要宣告
   * Angular：即使只有一個元件，也需要 NgModule 包裝
   */
  declarations: [
    MemberDetailComponent,
  ],

  imports: [
    SharedModule,
    MemberRoutingModule,
  ],
})
export class MemberModule {}
