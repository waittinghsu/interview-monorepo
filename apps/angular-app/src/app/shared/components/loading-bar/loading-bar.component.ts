/**
 * LoadingBarComponent — 頂部載入進度條
 *
 * ============================================================
 * 【Vue 對比】store.select + async pipe vs useApiLoading() composable
 * ============================================================
 *
 * 這個元件在有 HTTP 請求進行中時，在頁面最頂部顯示一個不確定進度條。
 *
 * Vue 的做法（vue-app 的 loading 機制）：
 *   <script setup>
 *   import { useApiLoading } from '@/composables/useApiLoading'
 *   const { isLoading } = useApiLoading()
 *   </script>
 *   <template>
 *     <q-linear-progress v-if="isLoading" indeterminate color="warning" />
 *   </template>
 *
 * Angular 的做法：
 *   1. 從 NgRx Store 中 select isLoading 狀態（回傳 Observable）
 *   2. 在 template 中用 async pipe 消費 Observable
 *   3. *ngIf 根據值決定是否顯示進度條
 *
 * 資料流比較：
 *
 * Vue：
 *   Axios 攔截器 → loadingBus（事件匯流排）→ useApiLoading() composable
 *   → ref<boolean> → v-if 直接綁定
 *
 * Angular：
 *   HttpClient 攔截器 → dispatch(setLoading(true))
 *   → NgRx Reducer 更新 state → store.select(selectIsLoading)
 *   → Observable<boolean> → async pipe → *ngIf
 *
 * Angular 的路徑更長，但每一步都是可追蹤、可測試的。
 * NgRx DevTools 可以看到每次 loading 狀態的變化。
 * ============================================================
 */

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectIsLoading } from '../../../store/ui/ui.selectors';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  /**
   * 內聯樣式 — 進度條只需要極少量的 CSS
   *
   * 【Vue 對比】
   * Vue 可以在 <style scoped> 中寫，也可以用 inline style。
   * Angular 可以用 styleUrls 引入外部檔案，或用 styles 寫內聯。
   * 這裡用內聯是因為只有兩行 CSS。
   */
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  `],
})
export class LoadingBarComponent {
  /**
   * isLoading$ — 是否正在載入的 Observable
   *
   * 【Vue 對比】
   * Vue：const { isLoading } = useApiLoading()
   *   - isLoading 是 Ref<boolean>，在 template 中直接用
   *
   * Angular：this.store.select(selectIsLoading)
   *   - 回傳 Observable<boolean>，在 template 中用 async pipe 消費
   *   - select 是純函式，只在相關的 state 變化時才會發出新值（類似 computed 的快取）
   *
   * store.select() 的運作方式：
   * 1. selectIsLoading 是一個 NgRx Selector（純函式）
   * 2. store.select() 回傳一個 Observable，只在 isLoading 值真正改變時發出
   * 3. async pipe 在 template 中自動訂閱/取消訂閱
   * 4. 配合 *ngIf 控制 DOM 的顯示/隱藏
   */
  isLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {
    this.isLoading$ = this.store.select(selectIsLoading);
  }
}
