/**
 * LoadingInterceptor — HTTP 請求 Loading 攔截器
 *
 * ============================================================
 * 【Vue 對比】Angular HttpInterceptor vs Axios Interceptor
 * ============================================================
 *
 * Angular 和 Vue 都使用「攔截器」模式來統一處理 HTTP 請求。
 * 概念完全一致，但實作方式不同。
 *
 * Vue（Axios Interceptor）：
 *   // api/loading.js
 *   export const loadingBus = reactive({ active: 0 })
 *
 *   // api/index.js
 *   httpClient.interceptors.request.use((config) => {
 *     loadingBus.active++      // 請求開始 → 計數器 +1
 *     return config
 *   })
 *   httpClient.interceptors.response.use(
 *     (response) => {
 *       loadingBus.active--    // 請求完成 → 計數器 -1
 *       return response
 *     },
 *     (error) => {
 *       loadingBus.active--    // 請求失敗 → 也要 -1
 *       return Promise.reject(error)
 *     }
 *   )
 *
 * Angular（HttpInterceptor）：
 *   intercept(req, next) {
 *     this.activeRequests++
 *     if (this.activeRequests === 1) dispatch(setLoading(true))
 *     return next.handle(req).pipe(
 *       finalize(() => {
 *         this.activeRequests--
 *         if (this.activeRequests === 0) dispatch(setLoading(false))
 *       })
 *     )
 *   }
 *
 * 主要差異：
 * 1. 註冊方式：
 *    - Axios：httpClient.interceptors.request.use(fn)（直接呼叫）
 *    - Angular：在 NgModule 的 providers 中用 HTTP_INTERCEPTORS token
 *
 * 2. Loading 狀態管理：
 *    - Vue：loadingBus.active（reactive 計數器）
 *    - Angular：dispatch(UiActions.setLoading())（透過 NgRx store）
 *
 * 3. 完成時機：
 *    - Axios：分別處理 response 和 error
 *    - Angular：用 finalize()，不管成功或失敗都會執行（更簡潔）
 *
 * finalize 操作符 — Observable 版的 try-finally：
 *   不管 Observable 是完成、出錯還是被取消，都會執行 finalize 中的函式。
 *   等同 Axios 的 response + error interceptor 合併。
 * ============================================================
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UiActions } from '../../store/ui/ui.actions';

/**
 * LoadingInterceptor — 追蹤活躍的 HTTP 請求數量
 *
 * 【Vue 對比】
 * Vue 的 loadingBus.active 是一個 reactive 計數器。
 * Angular 的 activeRequests 是一個普通的 class 屬性，
 * 透過 dispatch NgRx action 來更新全域 state。
 *
 * 為什麼要用計數器？
 * 因為可能同時有多個 HTTP 請求在進行。
 * 只有當所有請求都完成時（計數器歸零），才隱藏 loading。
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  /** 活躍的 HTTP 請求計數器（等同 Vue 的 loadingBus.active） */
  private activeRequests = 0;

  constructor(private readonly store: Store) {}

  /**
   * intercept — 攔截每個 HTTP 請求
   *
   * 【Vue 對比】
   * 這個方法等同 Axios 的 request interceptor + response interceptor 合併：
   *
   * Axios：
   *   request.use(() => { loadingBus.active++ })
   *   response.use(
   *     (res) => { loadingBus.active--; return res },
   *     (err) => { loadingBus.active--; throw err }
   *   )
   *
   * Angular：
   *   intercept() {
   *     activeRequests++           // 請求開始
   *     return next.handle(req)    // 放行請求
   *       .pipe(finalize(() => {   // 請求結束（不管成功或失敗）
   *         activeRequests--
   *       }))
   *   }
   *
   * @param req — 原始的 HTTP 請求
   * @param next — 下一個攔截器（鏈式呼叫）
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;

    // 第一個請求開始時，顯示 loading
    if (this.activeRequests === 1) {
      this.store.dispatch(UiActions.setLoading({ isLoading: true }));
    }

    return next.handle(req).pipe(
      /**
       * finalize — Observable 版的 finally
       *
       * 不管請求成功、失敗或被取消，都會執行。
       * 比 Axios 的 response + error 分開處理更簡潔。
       */
      finalize(() => {
        this.activeRequests--;

        // 所有請求都完成時，隱藏 loading
        if (this.activeRequests === 0) {
          this.store.dispatch(UiActions.setLoading({ isLoading: false }));
        }
      }),
    );
  }
}
