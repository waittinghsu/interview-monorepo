/**
 * FooterComponent — 頁尾元件（Seoul Editorial 風格）
 *
 * ============================================================
 * 【Vue 對比】簡單元件的定義差異
 * ============================================================
 *
 * Footer 是一個「純展示元件」（Presentational Component），
 * 沒有任何邏輯或狀態，只負責渲染固定的 UI。
 *
 * Vue 的做法（vue-app/components/common/AppFooter.vue）：
 *   <script setup>
 *   // 空的 — 純展示元件不需要任何邏輯
 *   </script>
 *   <template>
 *     <footer class="text-center text-textMuted border-t py-4">
 *       K — HUB · Seoul Editorial
 *     </footer>
 *   </template>
 *
 * Angular 的做法：
 *   即使是最簡單的元件，也需要：
 *   1. 一個 TypeScript class（footer.component.ts）
 *   2. @Component 裝飾器指定 selector、template、styles
 *   3. 在 NgModule 的 declarations 中註冊
 *
 *   Vue 只需要一個 .vue 檔案，不需要註冊。
 *   這是 Angular 被認為「比較囉嗦」的原因之一。
 * ============================================================
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
