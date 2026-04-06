/**
 * MarqueeComponent — 跑馬燈公告元件
 *
 * ============================================================
 * 【Vue 對比】Angular 的 @Input 裝飾器 vs Vue 的 defineProps
 * ============================================================
 *
 * 跑馬燈元件接收一組訊息，每 10 秒切換一則，
 * 並用 CSS @keyframes 做橫向捲動動畫。
 *
 * 這個元件也展示了計時器管理的模式（和 CarouselComponent 類似）。
 *
 * @Input vs defineProps 的對比：
 *
 *   // Vue — defineProps 宣告接收的 props
 *   const props = defineProps<{
 *     messages: string[]
 *   }>()
 *   // 使用：props.messages
 *
 *   // Angular — @Input() 裝飾器
 *   @Input() messages: string[] = []
 *   // 使用：this.messages
 *
 * 差異：
 * 1. Vue 的 props 是「唯讀」的（修改會報警告）
 *    Angular 的 @Input 技術上可以修改，但不建議（違反單向資料流）
 *
 * 2. Vue 可以設定預設值：
 *    defineProps({ messages: { type: Array, default: () => [] } })
 *    Angular 直接在宣告時賦初始值：@Input() messages: string[] = []
 *
 * 3. Vue 的 props 命名自動轉換 camelCase ↔ kebab-case：
 *    props: ['marqueeMessages'] → <Marquee :marquee-messages="..." />
 *    Angular 需要完全匹配：@Input() messages → [messages]="..."
 * ============================================================
 */

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss'],
})
export class MarqueeComponent implements OnInit, OnDestroy {
  /**
   * 跑馬燈訊息陣列
   *
   * 【Vue 對比】
   * Vue：defineProps<{ messages: string[] }>()
   * Angular：@Input() messages: string[] = []
   */
  @Input() messages: string[] = [];

  /** 當前顯示的訊息索引 */
  currentIndex = 0;

  /** 動畫重置控制旗標（用於觸發 CSS 動畫重新開始） */
  animationKey = 0;

  /** 切換訊息的計時器 */
  private rotateTimer?: ReturnType<typeof setInterval>;

  /**
   * ngOnInit — 啟動訊息輪轉
   *
   * 【Vue 對比】
   * Vue：
   *   onMounted(() => {
   *     timer = setInterval(() => {
   *       currentIndex.value = (currentIndex.value + 1) % props.messages.length
   *     }, 10000)
   *   })
   */
  ngOnInit(): void {
    if (this.messages.length > 1) {
      this.rotateTimer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
        // 更新動畫 key，強制 CSS 動畫重新開始
        this.animationKey++;
      }, 10000);
    }
  }

  /**
   * ngOnDestroy — 清理計時器
   *
   * 【Vue 對比】
   * Vue：onUnmounted(() => clearInterval(timer))
   */
  ngOnDestroy(): void {
    if (this.rotateTimer) {
      clearInterval(this.rotateTimer);
    }
  }

  /** 取得當前顯示的訊息 */
  get currentMessage(): string {
    return this.messages[this.currentIndex] ?? '';
  }
}
