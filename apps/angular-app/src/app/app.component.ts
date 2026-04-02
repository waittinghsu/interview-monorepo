/**
 * 根元件 — AppComponent
 *
 * ============================================================
 * 【Vue 對比】Class-based Component vs Vue SFC
 * ============================================================
 *
 * Angular 元件是一個「TypeScript class」加上「@Component 裝飾器」。
 * Vue 元件是一個「.vue 單檔案元件（SFC）」，用 <script setup> 語法。
 *
 * ┌─────────────────┬──────────────────────┬──────────────────────┐
 * │ 概念            │ Vue 3 (Composition)  │ Angular              │
 * ├─────────────────┼──────────────────────┼──────────────────────┤
 * │ 元件定義        │ <script setup>       │ @Component class     │
 * │ 模板            │ <template>           │ templateUrl / 內聯   │
 * │ 樣式            │ <style scoped>       │ styleUrls + ViewEnc. │
 * │ 狀態            │ ref() / reactive()   │ class 屬性           │
 * │ 計算屬性        │ computed()           │ getter               │
 * │ 生命週期        │ onMounted() 等       │ ngOnInit() 等        │
 * │ 輸入            │ defineProps()        │ @Input()             │
 * │ 輸出            │ defineEmits()        │ @Output()            │
 * │ 依賴注入        │ inject()             │ constructor 注入     │
 * └─────────────────┴──────────────────────┴──────────────────────┘
 *
 * Angular 元件的生命週期鉤子：
 * - ngOnInit()：元件初始化後（類似 Vue 的 onMounted，但在 DOM 渲染前）
 * - ngOnDestroy()：元件銷毀前（類似 Vue 的 onUnmounted）
 * - ngOnChanges()：@Input 屬性變化時（類似 Vue 的 watch props）
 * - ngAfterViewInit()：視圖（DOM）渲染完成後（最接近 Vue 的 onMounted）
 *
 * Angular 使用介面（interface）來標記生命週期：
 *   export class MyComponent implements OnInit { ... }
 * 這讓 TypeScript 可以檢查你是否正確實作了生命週期方法。
 * ============================================================
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

// TODO: Task 2 完成後引入 ThemeActions
// import { ThemeActions } from './store/theme/theme.actions';

/**
 * @Component 裝飾器
 *
 * 告訴 Angular 這個 class 是一個「元件」，並提供元資料：
 *
 * - selector：這個元件在 HTML 中的標籤名稱
 *   【Vue 對比】Vue 不需要明確定義 selector，檔名就是元件名
 *   （例如 MyButton.vue 在模板中用 <MyButton>）
 *
 * - templateUrl：外部模板檔案路徑
 *   【Vue 對比】Vue 的 <template> 區塊，寫在同一個 .vue 檔案中
 *
 * - styleUrls：外部樣式檔案路徑（陣列，可以多個）
 *   【Vue 對比】Vue 的 <style scoped> 區塊
 *   Angular 預設啟用 ViewEncapsulation（類似 Vue 的 scoped）
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * 元件標題（class 屬性 = Vue 的 ref）
   *
   * 【Vue 對比】
   * Vue：const title = ref('Angular K-Pop App')
   * Angular：直接宣告 class 屬性，Angular 的變更偵測會自動追蹤
   *
   * 注意：Angular 的變更偵測機制和 Vue 的響應式系統完全不同。
   * Vue 用 Proxy 追蹤每個屬性的讀取/寫入。
   * Angular 用 Zone.js 攔截所有非同步事件，然後整棵樹做 dirty check。
   */
  title = 'Angular K-Pop App';

  /**
   * 建構子注入（Constructor Injection）
   *
   * 【Vue 對比】
   * Vue：const store = useStore()  // 在 setup 中呼叫 composable
   * Angular：在建構子參數中宣告，框架自動注入
   *
   * Angular 的依賴注入（DI）是框架的核心設計：
   * - 在建構子中宣告需要什麼服務
   * - Angular 的注入器（Injector）自動建立並提供實例
   * - 支援階層式注入（元件層級可覆蓋上層的服務）
   *
   * private readonly store：
   * - private：只有這個 class 內部可以存取
   * - readonly：初始化後不能重新賦值
   * - Store：NgRx Store 的型別
   */
  constructor(private readonly store: Store) {}

  /**
   * ngOnInit — 元件初始化生命週期
   *
   * 【Vue 對比】
   * Vue：onMounted(() => { ... })
   *
   * 差異：
   * - ngOnInit：在 @Input 綁定完成後、DOM 渲染前觸發
   * - onMounted：在 DOM 渲染完成後觸發
   * - 如果需要操作 DOM，Angular 要用 ngAfterViewInit
   *
   * 這裡會在應用啟動時套用主題。
   * 使用 store.dispatch() 發送 Action，
   * 對應 Vue 中 Pinia store 的 action 呼叫。
   */
  ngOnInit(): void {
    // TODO: Task 2 完成後加入 ThemeActions.applyTheme()
    // this.store.dispatch(ThemeActions.applyTheme());
  }
}
