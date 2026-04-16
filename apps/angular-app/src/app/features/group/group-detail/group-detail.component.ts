/**
 * GroupDetailComponent — 團體詳情頁（容器元件）
 *
 * ============================================================
 * 【Vue 對比】容器元件 + NgRx vs Composable + 直接存取
 * ============================================================
 *
 * Vue 版本（GroupPage.vue）的做法：
 *   <script setup>
 *   const route = useRoute()
 *   const group = computed(() => getGroupById(route.params.id))
 *   const company = computed(() => group.value ? getCompanyById(group.value.companyId) : null)
 *   const members = computed(() => getMembersByGroup(group.value.id))
 *   </script>
 *
 * Angular 版本的做法：
 * 1. 從 ActivatedRoute 取得路由參數 :id
 * 2. dispatch KpopActions.loadGroupDetail({ groupId })
 * 3. 用 Selector 訂閱 Store 中的資料
 * 4. 用 KpopDataService 同步取得公司資訊
 *
 * 差異：
 * - Vue 直接 import helper function，同步取得資料
 * - Angular 透過 dispatch → Effect → reducer → selector 的完整流程
 * - Vue 的 computed 自動追蹤依賴；Angular 用 Observable + async pipe
 *
 * 設計風格：Seoul Editorial（奶油色/墨色/珊瑚色，
 * Cormorant Garamond 襯線 + DM Sans 無襯線）
 * ============================================================
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Group, Member, Company } from '../../../store/kpop/kpop.models';
import { KpopActions } from '../../../store/kpop/kpop.actions';
import {
  selectCurrentGroup,
  selectCurrentGroupMembers,
} from '../../../store/kpop/kpop.selectors';
import { KpopDataService } from '../../../core/services/kpop-data.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  /**
   * 從 NgRx Store 選取的 Observable 資料流
   *
   * 【Vue 對比】
   * Vue：const group = computed(() => getGroupById(route.params.id))
   * Angular：group$ = this.store.select(selectCurrentGroup)
   *
   * $ 結尾命名慣例代表這是 Observable（非同步串流）。
   * 在模板中用 | async 自動訂閱和退訂。
   */
  group$: Observable<Group | null>;
  members$: Observable<Member[]>;

  /**
   * 從團體資料衍生的公司資訊
   *
   * 【Vue 對比】
   * Vue：const company = computed(() => group.value ? getCompanyById(group.value.companyId) : null)
   * Angular：用 map operator 將 group$ 轉換為 company$
   */
  company$: Observable<Company | null>;

  /**
   * 成員列表的 grid 欄數
   *
   * 【Vue 對比】
   * Vue 在模板中用動態 class 切換：
   *   :class="members.length <= 4 ? 'grid-cols-4' : 'grid-cols-3'"
   *
   * Angular 把邏輯放在 Observable 中衍生：
   */
  gridCols$: Observable<number>;

  /**
   * 建構子注入
   *
   * 【Vue 對比】
   * Vue：
   *   const route = useRoute()
   *   const router = useRouter()
   *
   * Angular 使用建構子注入（DI）取得服務實例。
   * ActivatedRoute 提供目前路由的參數資訊。
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly kpopDataService: KpopDataService,
  ) {
    // 初始化 Observable 資料流
    this.group$ = this.store.select(selectCurrentGroup);
    this.members$ = this.store.select(selectCurrentGroupMembers);

    // 從 group$ 衍生公司資訊
    this.company$ = this.group$.pipe(
      map(group => group ? this.kpopDataService.getCompanyById(group.companyId) ?? null : null),
    );

    // 從 members$ 衍生 grid 欄數
    this.gridCols$ = this.members$.pipe(
      map(members => members.length <= 4 ? 4 : members.length <= 6 ? 3 : 4),
    );
  }

  /**
   * ngOnInit — 元件初始化時載入團體資料
   *
   * 【Vue 對比】
   * Vue 用 computed 自動響應 route.params.id 變化：
   *   const group = computed(() => getGroupById(route.params.id))
   *
   * Angular 需要主動 dispatch action 來觸發資料載入。
   * 從 ActivatedRoute 的 snapshot 取得 :id 參數，
   * 然後 dispatch loadGroupDetail，
   * Effect 會呼叫 KpopDataService.getGroupWithMembers()，
   * 成功後 dispatch loadGroupDetailSuccess 更新 Store。
   */
  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.store.dispatch(KpopActions.loadGroupDetail({ groupId }));
    }
  }

  /**
   * 點擊成員 avatar → 導航到成員詳情頁
   *
   * 【Vue 對比】
   * Vue：router.push({ name: 'Member', params: { id: memberId } })
   * Angular：this.router.navigate(['/member', memberId])
   */
  onMemberClick(memberId: string): void {
    this.router.navigate(['/member', memberId]);
  }

  /**
   * trackBy 函式 — 優化 *ngFor 渲染
   *
   * 【Vue 對比】
   * Vue 用 :key="member.id" 達到同樣效果。
   * Angular 需要顯式提供 trackBy 函式。
   */
  trackByMemberId(index: number, member: Member): string {
    return member.id;
  }

  /**
   * 取得 Hero 區域的背景樣式
   *
   * 【Vue 對比】
   * Vue 在模板中直接用 :style 綁定：
   *   :style="{ background: `linear-gradient(135deg, ${group.gradientFrom}, ${group.gradientTo})` }"
   *
   * Angular 把複雜邏輯放在方法中，模板只呼叫方法。
   */
  getHeroFallbackStyle(group: Group): Record<string, string> {
    return {
      background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})`,
    };
  }

  /**
   * 取得 fandom chip 的顏色樣式
   */
  getFandomChipStyle(group: Group): Record<string, string> {
    return {
      background: `${group.color}22`,
      color: group.color,
    };
  }
}
