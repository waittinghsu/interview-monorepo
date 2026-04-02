/**
 * MemberDetailComponent — 成員詳情頁（容器元件）
 *
 * ============================================================
 * 【Vue 對比】容器元件 + NgRx vs Composable + 直接存取
 * ============================================================
 *
 * Vue 版本（MemberPage.vue）的做法：
 *   <script setup>
 *   const route = useRoute()
 *   const member = computed(() => getMemberById(route.params.id))
 *   const group = computed(() => member.value ? getGroupById(member.value.groupId) : null)
 *   </script>
 *
 * Angular 版本的做法：
 * 1. 從 ActivatedRoute 取得 :id 參數
 * 2. dispatch KpopActions.loadMemberDetail({ memberId })
 * 3. 用 Selector 訂閱 currentMember 和 currentMemberGroup
 *
 * 差異：
 * - Vue 用 computed 同步衍生，資料變化自動更新
 * - Angular 用 dispatch → Effect → reducer → selector 完整流程
 * - Vue 的 watchEffect 偵測到 member 為 undefined 時自動導向首頁
 * - Angular 可以在 Effect 中處理找不到資料的情況
 *
 * 設計風格：Seoul Editorial（奶油色/墨色/珊瑚色）
 * ============================================================
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Group, Member } from '../../../store/kpop/kpop.models';
import { KpopActions } from '../../../store/kpop/kpop.actions';
import {
  selectCurrentMember,
  selectCurrentMemberGroup,
} from '../../../store/kpop/kpop.selectors';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  /**
   * 從 NgRx Store 選取的 Observable 資料流
   *
   * 【Vue 對比】
   * Vue：const member = computed(() => getMemberById(route.params.id))
   * Angular：member$ = this.store.select(selectCurrentMember)
   *
   * Vue：const group = computed(() => getGroupById(member.value.groupId))
   * Angular：group$ = this.store.select(selectCurrentMemberGroup)
   */
  member$: Observable<Member | null>;
  group$: Observable<Group | null>;

  /**
   * 建構子注入
   *
   * 【Vue 對比】
   * Vue：
   *   const route = useRoute()
   *   const router = useRouter()
   *
   * Angular 用 DI 注入 ActivatedRoute、Router、Store。
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    this.member$ = this.store.select(selectCurrentMember);
    this.group$ = this.store.select(selectCurrentMemberGroup);
  }

  /**
   * ngOnInit — 元件初始化時載入成員資料
   *
   * 【Vue 對比】
   * Vue 用 computed 自動響應 route.params.id：
   *   const member = computed(() => getMemberById(route.params.id))
   *
   * Angular 需要手動 dispatch action 觸發資料載入。
   * Effect 會呼叫 KpopDataService.getMemberWithGroup()，
   * 成功後 dispatch loadMemberDetailSuccess({ member, group })。
   */
  ngOnInit(): void {
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.store.dispatch(KpopActions.loadMemberDetail({ memberId }));
    }
  }

  /**
   * 返回團體頁面
   *
   * 【Vue 對比】
   * Vue：
   *   function goToGroup() {
   *     if (group.value) router.push({ name: 'Group', params: { id: group.value.id } })
   *   }
   *
   * Angular：this.router.navigate(['/group', groupId])
   */
  goToGroup(groupId: string): void {
    this.router.navigate(['/group', groupId]);
  }

  /**
   * 取得 Hero 備用背景樣式（無照片時）
   *
   * 【Vue 對比】
   * Vue 在模板中用 :style 直接綁定：
   *   :style="{ background: `radial-gradient(...)` }"
   *
   * Angular 把樣式邏輯放在方法中。
   */
  getHeroFallbackStyle(member: Member): Record<string, string> {
    const color = member.color || '#374151';
    return {
      background: `radial-gradient(circle at 50% 30%, ${color}66, ${color}22 70%), linear-gradient(180deg, transparent 40%, black)`,
    };
  }

  /**
   * 取得姓名首字（備用頭像）
   */
  getInitial(member: Member): string {
    return member.name.charAt(0);
  }

  /**
   * 取得職位標籤的顏色樣式
   *
   * 【Vue 對比】
   * Vue：:style="{ background: `${member.color}22`, color: member.color }"
   * Angular：[ngStyle]="getPositionChipStyle(member)"
   */
  getPositionChipStyle(member: Member): Record<string, string> {
    const color = member.color || '#94a3b8';
    return {
      background: `${color}22`,
      color,
    };
  }

  /**
   * 取得團體連結的顏色樣式
   */
  getGroupLinkStyle(group: Group): Record<string, string> {
    return {
      color: group.color,
    };
  }
}
