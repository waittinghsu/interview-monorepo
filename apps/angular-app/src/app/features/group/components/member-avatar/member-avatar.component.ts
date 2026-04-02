/**
 * MemberAvatarComponent — 成員頭像展示元件
 *
 * ============================================================
 * 【Vue 對比】展示元件（Dumb Component）模式
 * ============================================================
 *
 * 這是一個典型的展示元件，只負責：
 * 1. 接收資料（@Input）
 * 2. 渲染 UI（圓形頭像 + 姓名）
 * 3. 發射事件（@Output）
 *
 * Vue 版本對應元件：MemberCard.vue
 *
 *   // Vue MemberCard.vue
 *   <script setup>
 *   const props = defineProps({
 *     member: { type: Object, required: true },
 *     clickable: { type: Boolean, default: true }
 *   })
 *   const emit = defineEmits(['click'])
 *   </script>
 *
 *   // Angular MemberAvatarComponent
 *   @Input() member!: Member;
 *   @Input() clickable = true;
 *   @Output() avatarClick = new EventEmitter<string>();
 *
 * 差異：
 * - Vue 的 emit('click', memberId) 由父元件用 @click="handler" 接收
 * - Angular 的 avatarClick.emit(memberId) 由父元件用 (avatarClick)="handler($event)" 接收
 * - Angular 的 @Output 名稱不能叫 click（會和原生 DOM 事件衝突）
 *
 * 備用（Fallback）設計：
 * 當成員沒有照片時，顯示漸層色圓形 + 姓名首字。
 * 這在兩個框架中的邏輯相同，只是語法不同。
 * ============================================================
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Member } from '../../../../store/kpop/kpop.models';

@Component({
  selector: 'app-member-avatar',
  templateUrl: './member-avatar.component.html',
  styleUrls: ['./member-avatar.component.scss'],
})
export class MemberAvatarComponent {
  /**
   * 成員資料
   *
   * 【Vue 對比】
   * Vue：defineProps<{ member: Member }>()
   * Angular：@Input() member!: Member
   */
  @Input() member!: Member;

  /**
   * 是否可點擊
   *
   * 【Vue 對比】
   * Vue：defineProps({ clickable: { type: Boolean, default: true } })
   * Angular：@Input() clickable = true
   */
  @Input() clickable = true;

  /**
   * 頭像點擊事件（發射 memberId）
   *
   * 【Vue 對比】
   * Vue：emit('click', member.id)
   * Angular：avatarClick.emit(member.id)
   *
   * 命名為 avatarClick 而非 click，避免和原生 DOM click 衝突。
   */
  @Output() avatarClick = new EventEmitter<string>();

  /**
   * 點擊頭像 — 發射成員 ID
   */
  onAvatarClick(): void {
    if (this.clickable) {
      this.avatarClick.emit(this.member.id);
    }
  }

  /**
   * 取得頭像的邊框顏色樣式
   *
   * 【Vue 對比】
   * Vue 在模板中直接綁定：
   *   :style="{ borderColor: member.color }"
   *
   * Angular 把樣式邏輯放在方法中：
   */
  getAvatarBorderStyle(): Record<string, string> {
    return {
      'border-color': this.member.color || '#8b8680',
    };
  }

  /**
   * 取得備用漸層背景樣式（無照片時）
   */
  getFallbackStyle(): Record<string, string> {
    const color = this.member.color || '#374151';
    return {
      background: `linear-gradient(135deg, ${color}66, ${color}22)`,
    };
  }

  /**
   * 取得姓名首字（備用頭像顯示用）
   */
  getInitial(): string {
    return this.member.name.charAt(0);
  }
}
