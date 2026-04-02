/**
 * GroupCardComponent — 團體卡片展示元件
 *
 * ============================================================
 * 【Vue 對比】Angular 模板語法 vs Vue 模板語法
 * ============================================================
 *
 * GroupCard 是一個典型的「展示元件」（Dumb/Presentational Component），
 * 它只負責：
 * 1. 接收資料（@Input）
 * 2. 渲染 UI
 * 3. 發射事件（@Output）
 *
 * 不包含任何業務邏輯、不直接存取 Store。
 *
 * 這和 Vue 的展示元件模式完全對應：
 *
 *   // Vue GroupCard.vue
 *   <script setup>
 *   const props = defineProps<{ group: Group }>()
 *   const emit = defineEmits<{ (e: 'click', id: string): void }>()
 *   </script>
 *
 *   // Angular GroupCardComponent
 *   @Input() group!: Group;
 *   @Output() cardClick = new EventEmitter<string>();
 *
 * Angular 的 @Output 事件名稱不能和原生 DOM 事件重名（如 click），
 * 所以用 cardClick 而不是 click。
 * Vue 的 emit 沒有這個限制，但也建議避免和原生事件重名。
 *
 * 驚嘆號（!）的意義：
 *   @Input() group!: Group;
 *   這個 ! 是 TypeScript 的「確定賦值斷言」（Definite Assignment Assertion），
 *   告訴編譯器：「這個屬性一定會在使用前被賦值」。
 *   因為 @Input 會由 Angular 框架在元件初始化時設定值。
 *
 * 【Vue 對比】
 * Vue 的 defineProps 不需要 !，因為 TypeScript 知道 props 一定有值。
 * Angular 需要 ! 是因為 TypeScript 看到 class 屬性沒有在 constructor 中初始化，
 * 就會認為它可能是 undefined。! 告訴它「別擔心，Angular 會處理」。
 * ============================================================
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Group } from '../../../../store/kpop/kpop.models';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
})
export class GroupCardComponent {
  /**
   * 團體資料
   *
   * 【Vue 對比】
   * Vue：defineProps<{ group: Group }>()
   * Angular：@Input() group!: Group
   */
  @Input() group!: Group;

  /**
   * 卡片點擊事件（發射 groupId）
   *
   * 【Vue 對比】
   * Vue：emit('click', group.id)
   * Angular：cardClick.emit(group.id)
   *
   * 為什麼不叫 click？
   * 因為 (click) 是 Angular 中原生 DOM click 事件的綁定語法。
   * 如果 @Output 也叫 click，會和原生事件衝突。
   */
  @Output() cardClick = new EventEmitter<string>();

  /**
   * 點擊卡片 — 發射團體 ID
   */
  onCardClick(): void {
    this.cardClick.emit(this.group.id);
  }

  /**
   * 取得封面圖片的背景樣式
   *
   * 如果有封面圖片就顯示圖片，否則用漸層色當備用背景。
   *
   * 【Vue 對比】
   * Vue 在模板中直接用 :style：
   *   :style="{ backgroundImage: group.cover ? `url(${group.cover})` : 'none' }"
   *
   * Angular 通常把複雜的樣式邏輯放在方法中，模板只呼叫方法。
   * 這讓模板保持簡潔，邏輯集中在 TypeScript 檔案中。
   */
  getCoverStyle(): Record<string, string> {
    if (this.group.cover) {
      return {
        'background-image': `url(${this.group.cover})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    }
    return {
      background: `linear-gradient(135deg, ${this.group.gradientFrom}, ${this.group.gradientTo})`,
    };
  }

  /**
   * 取得粉絲名稱標籤的顏色樣式
   */
  getFandomChipStyle(): Record<string, string> {
    return {
      'background-color': `${this.group.color}15`,
      color: this.group.color,
    };
  }
}
