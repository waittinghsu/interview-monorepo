/**
 * SharedModule — 共用模組（元件、指令、管道）
 *
 * ============================================================
 * 【Vue 對比】SharedModule vs components/common/
 * ============================================================
 *
 * Angular 的模組系統要求每個元件必須「歸屬」於一個 NgModule，
 * 並且必須在該模組的 declarations 中宣告，才能在模板中使用。
 *
 * SharedModule 是 Angular 的慣例模式，專門用來：
 * 1. 宣告可重用的元件（Header、Footer 等）
 * 2. 匯入並重新匯出常用模組（CommonModule、RouterModule、Material 模組）
 * 3. 讓其他功能模組只需 import SharedModule 就能用所有共用資源
 *
 * Vue 完全不需要這個概念，原因是：
 * - Vue 的元件不需要「宣告」歸屬，直接 import 就能用
 * - 全域元件用 app.component() 註冊一次即可
 * - <script setup> 中 import 的元件自動可用於 <template>
 * - 不存在「元件只能屬於一個模組」的限制
 *
 * 例如在 Vue 中使用 Header：
 *   // 任何 .vue 檔案
 *   <script setup>
 *   import AppHeader from '@/components/common/AppHeader.vue'
 *   </script>
 *   <template>
 *     <AppHeader />   <!-- 直接用，不需要任何「模組」設定 -->
 *   </template>
 *
 * SharedModule vs CoreModule 的差別：
 * ┌─────────────┬─────────────────────────────┬──────────────────────────────┐
 * │             │ SharedModule                │ CoreModule                   │
 * ├─────────────┼─────────────────────────────┼──────────────────────────────┤
 * │ 目的        │ 共用元件/指令/管道           │ 全域 singleton 服務          │
 * │ 可引入次數  │ 多次（每個功能模組都可引入） │ 只能一次（AppModule 引入）   │
 * │ 主要內容    │ declarations + exports      │ providers（服務、攔截器）    │
 * │ Vue 對應    │ components/common/          │ plugins/ + main.js 設定      │
 * └─────────────┴─────────────────────────────┴──────────────────────────────┘
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Angular Material 模組引入
 *
 * 【Vue 對比】
 * Vue 專案（vue-app）使用 Quasar 元件庫，全域註冊後直接用 <q-btn> 等標籤。
 * Angular 使用 Angular Material，需要逐一引入需要的模組。
 *
 * Quasar 的全域註冊方式（vue-app）：
 *   // quasar.config.ts 中設定一次，所有元件自動可用
 *   components: ['QBtn', 'QToolbar', ...]
 *
 * Angular Material 需要逐模組引入：
 *   imports: [MatToolbarModule, MatIconModule, ...]
 *
 * 這也是為什麼 SharedModule 很重要 —
 * 把常用的 Material 模組集中在這裡重新匯出，
 * 功能模組只要引入 SharedModule 就好。
 */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { DebutYearPipe } from './pipes/debut-year.pipe';

@NgModule({
  /**
   * declarations — 宣告歸屬於此模組的元件和管道
   *
   * 【Vue 對比】
   * Angular 要求每個元件只能屬於一個模組，在這裡宣告後，
   * 其他模組必須透過 imports: [SharedModule] 來取得這些元件。
   *
   * Vue 沒有這個限制：
   *   - 全域元件：app.component('AppHeader', AppHeader) → 到處可用
   *   - 區域元件：在 <script setup> 中 import → 該檔案自動可用
   *   不存在「宣告歸屬」的概念。
   */
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingBarComponent,
    DebutYearPipe,
  ],

  /**
   * imports — 這些模組提供的功能「只在 SharedModule 內部」可用
   *
   * CommonModule 提供 *ngIf、*ngFor 等基本指令。
   * 注意：BrowserModule 只能在 AppModule 引入一次，
   * 其他模組都要用 CommonModule。
   */
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
  ],

  /**
   * exports — 讓引入 SharedModule 的模組可以使用這些東西
   *
   * 【Vue 對比】
   * Vue 不需要 exports 的概念。import 了就能用，沒有存取限制。
   *
   * Angular 的模組系統是「封閉」的：
   * 如果不 export，即使別的模組 import 了 SharedModule，
   * 也無法使用 SharedModule 內部的元件。
   *
   * 我們把所有 declarations 和常用的 Angular 模組都 export 出去，
   * 這樣功能模組只需要 imports: [SharedModule] 就能用：
   * - 所有共用元件（Header、Footer 等）
   * - CommonModule（*ngIf、*ngFor）
   * - RouterModule（routerLink）
   * - Material 元件模組
   */
  exports: [
    // 共用元件和管道
    HeaderComponent,
    FooterComponent,
    LoadingBarComponent,
    DebutYearPipe,

    // Angular 基礎模組（讓功能模組不用重複引入）
    CommonModule,
    RouterModule,

    // Angular Material 模組
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
})
export class SharedModule {}
