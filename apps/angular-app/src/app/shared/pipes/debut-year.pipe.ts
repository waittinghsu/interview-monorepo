/**
 * DebutYearPipe — 從日期字串中提取出道年份
 *
 * ============================================================
 * 【Vue 對比】Angular Pipe vs Vue 的 computed / helper function
 * ============================================================
 *
 * Angular 的 Pipe 是一種「模板內的資料轉換工具」，
 * 語法用 | 符號（管道運算子）：
 *   {{ '2015-10-20' | debutYear }}  → 顯示 "2015"
 *
 * Vue 沒有 Pipe 的概念。相同功能有幾種做法：
 *
 * 方式 1 — computed（最常用）：
 *   const debutYear = computed(() => group.debutDate?.split('-')[0] ?? '')
 *   // template: {{ debutYear }}
 *
 * 方式 2 — 工具函式：
 *   // utils/format.js
 *   export function getDebutYear(dateStr) { return dateStr?.split('-')[0] ?? '' }
 *   // template: {{ getDebutYear(group.debutDate) }}
 *
 * 方式 3 — Vue 2 的 filter（已在 Vue 3 移除）：
 *   // Vue 2 曾有類似 Angular Pipe 的語法：{{ date | debutYear }}
 *   // Vue 3 移除了 filter，因為團隊認為 computed 和函式呼叫已經夠用
 *
 * Angular Pipe 的特點：
 * 1. 必須用 @Pipe 裝飾器標記
 * 2. 必須實作 PipeTransform 介面的 transform() 方法
 * 3. 必須在 NgModule 的 declarations 中註冊
 * 4. pure: true（預設）表示只有輸入值變化時才重新計算（類似 Vue 的 computed 快取）
 * 5. pure: false 表示每次變更偵測都重新計算（效能較差，少用）
 *
 * Angular 內建了很多 Pipe：
 * - DatePipe：{{ date | date:'yyyy-MM-dd' }}
 * - CurrencyPipe：{{ price | currency:'TWD' }}
 * - DecimalPipe：{{ num | number:'1.2-2' }}
 * - AsyncPipe：{{ observable$ | async }}（前面用過！）
 *
 * 【Vue 對比】
 * Vue 沒有內建的格式化工具，通常用：
 * - dayjs / date-fns 處理日期
 * - Intl.NumberFormat 處理數字和貨幣
 * - 自己寫 computed 或工具函式
 * ============================================================
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  /**
   * name — Pipe 在模板中的名稱
   *
   * 使用方式：{{ '2015-10-20' | debutYear }}
   *
   * 【Vue 對比】
   * Vue 的 computed 不需要命名（變數名就是名稱），
   * 工具函式也是直接用函式名呼叫。
   * Angular Pipe 的 name 決定了它在模板中的「調用名稱」。
   */
  name: 'debutYear',

  /**
   * pure: true（預設值，可以省略）
   *
   * 【Vue 對比】
   * pure Pipe 類似 Vue 的 computed：
   * - 輸入沒變 → 回傳快取值，不重新計算
   * - 輸入改變 → 重新執行 transform()
   *
   * impure Pipe（pure: false）類似在 template 中直接呼叫函式：
   * - 每次變更偵測都會重新計算
   * - 效能差，應盡量避免
   */
  pure: true,
})
export class DebutYearPipe implements PipeTransform {
  /**
   * transform — Pipe 的核心轉換邏輯
   *
   * 從日期字串（如 '2015-10-20'）中提取年份部分。
   *
   * @param value - 日期字串，格式為 'YYYY-MM-DD' 或任何以 '-' 分隔的字串
   * @returns 年份字串（如 '2015'），如果輸入無效則回傳空字串
   *
   * 【Vue 對比】
   * 相同邏輯在 Vue 中的寫法：
   *   const debutYear = computed(() => props.debutDate?.split('-')[0] ?? '')
   *
   * 或作為工具函式（vue-app/utils/format.js）：
   *   export const getDebutYear = (dateStr) => dateStr?.split('-')[0] ?? ''
   */
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value.split('-')[0] ?? '';
  }
}
