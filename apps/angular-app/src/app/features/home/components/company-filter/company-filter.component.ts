/**
 * CompanyFilterComponent — 水平捲動公司篩選器
 *
 * ============================================================
 * 【Vue 對比】@Input/@Output vs defineProps/defineEmits
 * ============================================================
 *
 * 這是 Angular 和 Vue 元件溝通的核心差異之一。
 * 兩者都遵循「Props Down, Events Up」的單向資料流原則，
 * 但語法差異很大：
 *
 * ── 接收資料（父→子） ──
 *
 *   // Vue — defineProps
 *   const props = defineProps<{
 *     companies: Company[]
 *     activeId: string
 *   }>()
 *   // 使用：props.companies、props.activeId
 *
 *   // Angular — @Input()
 *   @Input() companies: Company[] = [];
 *   @Input() activeId = '';
 *   // 使用：this.companies、this.activeId
 *
 * ── 發送事件（子→父） ──
 *
 *   // Vue — defineEmits
 *   const emit = defineEmits<{
 *     (e: 'companySelected', id: string): void
 *   }>()
 *   // 觸發：emit('companySelected', company.id)
 *
 *   // Angular — @Output() + EventEmitter
 *   @Output() companySelected = new EventEmitter<string>();
 *   // 觸發：this.companySelected.emit(company.id)
 *
 * 父元件監聽：
 *   // Vue：<CompanyFilter @company-selected="handler" />
 *   // Angular：<app-company-filter (companySelected)="handler($event)" />
 *
 * 注意事項：
 * - Vue 的 emit 名稱會自動轉換 camelCase ↔ kebab-case
 *   （companySelected → @company-selected）
 * - Angular 不做轉換，名稱必須完全匹配
 * - Angular 的 EventEmitter 是 RxJS Subject 的子類別，
 *   技術上可以用 Observable 的操作子，但不建議（官方已棄用這種用法）
 * ============================================================
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Company } from '../../../../store/kpop/kpop.models';

@Component({
  selector: 'app-company-filter',
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss'],
})
export class CompanyFilterComponent {
  /**
   * 公司列表
   *
   * 【Vue 對比】
   * Vue：defineProps<{ companies: Company[] }>()
   * Angular：@Input() companies: Company[] = []
   */
  @Input() companies: Company[] = [];

  /**
   * 目前選中的公司 ID
   *
   * 【Vue 對比】
   * Vue：defineProps<{ activeId: string }>()
   * Angular：@Input() activeId = ''
   */
  @Input() activeId = '';

  /**
   * 公司選擇事件
   *
   * 【Vue 對比】
   * Vue：const emit = defineEmits<{ (e: 'companySelected', id: string): void }>()
   * Angular：@Output() companySelected = new EventEmitter<string>()
   *
   * EventEmitter<string> 中的泛型 string 表示事件攜帶的資料型別。
   * Vue 的 defineEmits 也用泛型定義事件簽名，概念相同。
   */
  @Output() companySelected = new EventEmitter<string>();

  /**
   * 點擊公司 — 發射選擇事件
   *
   * 【Vue 對比】
   * Vue：emit('companySelected', company.id)
   * Angular：this.companySelected.emit(company.id)
   *
   * 功能完全相同，都是「子元件通知父元件」。
   */
  onCompanyClick(companyId: string): void {
    this.companySelected.emit(companyId);
  }

  /**
   * 取得公司的漸層背景樣式
   */
  getGradientStyle(company: Company): Record<string, string> {
    return {
      background: `linear-gradient(135deg, ${company.gradientFrom}, ${company.gradientTo})`,
    };
  }
}
