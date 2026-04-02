/**
 * CarouselComponent — 自動輪播圖元件
 *
 * ============================================================
 * 【Vue 對比】Angular 生命週期 vs Vue 生命週期
 * ============================================================
 *
 * 這個元件展示了 Angular 的生命週期鉤子（Lifecycle Hooks）
 * 和 Vue 的 Composition API 生命週期函式的對比。
 *
 * 計時器管理是兩者最常見的對比場景：
 *
 *   // Vue — 用 onMounted / onUnmounted 管理計時器
 *   <script setup>
 *   let timer: ReturnType<typeof setInterval>
 *
 *   onMounted(() => {
 *     timer = setInterval(() => {
 *       currentSlide.value = (currentSlide.value + 1) % slides.length
 *     }, 4000)
 *   })
 *
 *   onUnmounted(() => {
 *     clearInterval(timer)
 *   })
 *   </script>
 *
 *   // Angular — 用 ngOnInit / ngOnDestroy 管理計時器
 *   export class CarouselComponent implements OnInit, OnDestroy {
 *     private timer?: ReturnType<typeof setInterval>;
 *
 *     ngOnInit() {
 *       this.timer = setInterval(() => { ... }, 4000);
 *     }
 *
 *     ngOnDestroy() {
 *       clearInterval(this.timer);
 *     }
 *   }
 *
 * 關鍵差異：
 * 1. Vue 的 onMounted 在 DOM 渲染「後」觸發
 *    Angular 的 ngOnInit 在 DOM 渲染「前」觸發
 *    （若需 DOM 存取，Angular 要用 ngAfterViewInit）
 *
 * 2. Vue 的 onUnmounted 和 Angular 的 ngOnDestroy 時機相同：
 *    元件被銷毀前清理資源（計時器、訂閱等）
 *
 * 3. Angular 用 implements OnInit, OnDestroy 明確標示介面，
 *    TypeScript 會檢查是否實作了 ngOnInit / ngOnDestroy。
 *    Vue 不需要介面宣告，直接呼叫 onMounted() 即可。
 * ============================================================
 */

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CarouselSlide } from '../../../../store/kpop/kpop.models';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  /**
   * 輪播圖資料
   *
   * 【Vue 對比】
   * Vue：const props = defineProps<{ slides: CarouselSlide[] }>()
   * Angular：@Input() slides: CarouselSlide[] = []
   *
   * @Input() 裝飾器標記這個屬性可以從父元件接收資料。
   * Vue 的 defineProps 和 Angular 的 @Input 功能完全相同，
   * 都是「父→子」的單向資料流。
   */
  @Input() slides: CarouselSlide[] = [];

  /** 當前顯示的幻燈片索引 */
  currentSlide = 0;

  /** 計時器參考（用於 ngOnDestroy 清理） */
  private autoPlayTimer?: ReturnType<typeof setInterval>;

  /**
   * ngOnInit — 啟動自動輪播
   *
   * 【Vue 對比】
   * Vue 用 onMounted 啟動計時器：
   *   onMounted(() => {
   *     timer = setInterval(nextSlide, 4000)
   *   })
   *
   * Angular 用 ngOnInit（在 @Input 綁定完成後觸發）。
   * 此時 this.slides 已經有值了。
   */
  ngOnInit(): void {
    this.startAutoPlay();
  }

  /**
   * ngOnDestroy — 清理計時器，防止記憶體洩漏
   *
   * 【Vue 對比】
   * Vue 用 onUnmounted 清理：
   *   onUnmounted(() => {
   *     clearInterval(timer)
   *   })
   *
   * 如果不清理，計時器會在元件銷毀後繼續執行，
   * 導致：
   * 1. 記憶體洩漏（元件無法被垃圾回收）
   * 2. 嘗試更新已銷毀元件的狀態（可能報錯）
   *
   * 這是 Angular 和 Vue 都必須注意的資源管理問題。
   */
  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  /**
   * 切換到指定幻燈片（點擊指示器圓點）
   */
  goToSlide(index: number): void {
    this.currentSlide = index;
    // 重置計時器，避免剛手動切換後又立刻自動切換
    this.restartAutoPlay();
  }

  /**
   * 取得幻燈片的背景樣式
   *
   * 【Vue 對比】
   * Vue 用 :style 綁定物件：
   *   :style="{ background: `linear-gradient(...)` }"
   *
   * Angular 用 [ngStyle] 或方法回傳樣式物件：
   *   [ngStyle]="getSlideBackground(slide)"
   *
   * 當幻燈片有圖片時顯示圖片，沒有時用漸層色當作備用背景。
   */
  getSlideBackground(slide: CarouselSlide): Record<string, string> {
    if (slide.image) {
      return {
        'background-image': `url(${slide.image})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    }
    return {
      background: `linear-gradient(135deg, ${slide.colorFrom}, ${slide.colorTo})`,
    };
  }

  /**
   * 取得漸層遮罩樣式（讓文字在圖片上可讀）
   */
  getOverlayGradient(slide: CarouselSlide): Record<string, string> {
    return {
      background: `linear-gradient(to top, ${slide.colorFrom}cc 0%, transparent 60%)`,
    };
  }

  /** 啟動自動輪播 */
  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  /** 停止自動輪播 */
  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = undefined;
    }
  }

  /** 重啟自動輪播（手動切換後使用） */
  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
