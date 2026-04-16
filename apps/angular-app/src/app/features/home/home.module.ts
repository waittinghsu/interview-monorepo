/**
 * HomeModule — 首頁功能模組
 *
 * ============================================================
 * 【Vue 對比】NgModule vs 直接 import
 * ============================================================
 *
 * Angular 的每個功能區塊都需要一個 NgModule 來：
 * 1. 宣告這個功能包含哪些元件（declarations）
 * 2. 引入需要的依賴模組（imports）
 *
 * Vue 完全不需要這個概念：
 *   // Vue 中使用元件只需要 import
 *   <script setup>
 *   import CarouselBanner from '@/components/home/CarouselBanner.vue'
 *   import MarqueeBanner from '@/components/home/MarqueeBanner.vue'
 *   </script>
 *   <template>
 *     <CarouselBanner />  <!-- 直接用 -->
 *     <MarqueeBanner />
 *   </template>
 *
 * Angular 需要先在 NgModule 中「註冊」元件，才能在模板中使用。
 * 這是 Angular 模組系統的基本要求，也是 Angular 和 Vue 之間
 * 最明顯的架構差異之一。
 *
 * SharedModule 提供了所有共用資源（CommonModule、Material 模組、
 * Header、Footer、DebutYearPipe 等），功能模組只需要 import 它。
 * ============================================================
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { CompanyFilterComponent } from './components/company-filter/company-filter.component';
import { GroupCardComponent } from './components/group-card/group-card.component';

@NgModule({
  /**
   * declarations — 宣告歸屬於 HomeModule 的所有元件
   *
   * 【Vue 對比】
   * Vue：在 HomePage.vue 的 <script setup> 中 import 子元件即可
   * Angular：必須在 declarations 中列出所有元件，框架才知道它們的存在
   *
   * 這些元件只能在 HomeModule 的範圍內使用。
   * 如果其他模組也需要某個元件，應該移到 SharedModule。
   */
  declarations: [
    HomeComponent,
    CarouselComponent,
    MarqueeComponent,
    CompanyFilterComponent,
    GroupCardComponent,
  ],

  /**
   * imports — 引入依賴模組
   *
   * SharedModule：提供 CommonModule（*ngIf、*ngFor）、Material 模組、共用元件
   * HomeRoutingModule：定義首頁的路由（'' → HomeComponent）
   */
  imports: [
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
