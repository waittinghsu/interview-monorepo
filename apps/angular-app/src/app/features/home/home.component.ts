/**
 * HomeComponent — 首頁容器元件
 *
 * ============================================================
 * 【Vue 對比】容器元件（Container Component）模式
 * ============================================================
 *
 * HomeComponent 是一個「容器元件」（Smart Component），
 * 負責從 NgRx Store 取得資料，然後透過 @Input 傳給子元件。
 *
 * Vue 版本（HomePage.vue）的做法非常不同：
 *
 *   // Vue — 每個元件自己 import 需要的 store
 *   <script setup>
 *   const kpopStore = useKpopStore()
 *   const { companies, filteredGroups } = storeToRefs(kpopStore)
 *   </script>
 *
 *   // Angular — 容器元件集中管理，子元件只接收 @Input
 *   export class HomeComponent {
 *     companies$ = this.store.select(selectCompanies);
 *     filteredGroups$ = this.store.select(selectFilteredGroups);
 *   }
 *
 * Angular 社群推崇「Smart/Dumb 元件模式」：
 * - Smart（容器）元件：連接 Store，處理業務邏輯
 * - Dumb（展示）元件：只接收 @Input，只發射 @Output
 *
 * Vue 社群則更彈性，元件可以直接存取 Pinia store，
 * 不強制容器/展示分離。兩種方式各有優缺點。
 *
 * Observable 與 async pipe：
 * 注意這裡的屬性都是 Observable（以 $ 結尾的命名慣例）。
 * 在模板中用 | async 自動訂閱/退訂，不需要手動管理。
 *
 * 【Vue 對比】
 * Vue 的 computed/ref 是「同步」的響應式值，模板直接用。
 * Angular 的 Observable 是「非同步串流」，需要 | async 轉換。
 * ============================================================
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Company, Group, CarouselSlide } from '../../store/kpop/kpop.models';
import { KpopActions } from '../../store/kpop/kpop.actions';
import {
  selectCompanies,
  selectFilteredGroups,
  selectSelectedCompanyId,
} from '../../store/kpop/kpop.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**
   * 從 NgRx Store 選取的 Observable 資料流
   *
   * 【Vue 對比】
   * Vue：const { companies } = storeToRefs(useKpopStore())
   * Angular：companies$ = this.store.select(selectCompanies)
   *
   * 命名慣例：Observable 變數以 $ 結尾，方便辨識。
   * 在模板中用 async pipe 自動處理訂閱生命週期：
   *   *ngFor="let company of companies$ | async"
   *
   * 【Vue 對比】
   * Vue 的 storeToRefs() 回傳的是 Ref，模板直接用 .value 自動解包：
   *   <div v-for="company in companies" />
   */
  companies$: Observable<Company[]>;
  filteredGroups$: Observable<Group[]>;
  selectedCompanyId$: Observable<string>;

  /**
   * 輪播圖靜態資料
   *
   * 【Vue 對比】
   * Vue 版本定義在 HomePage.vue 的 <script setup> 中：
   *   const carouselSlides = [
   *     { id: 1, image: '/carousel/26_twice.jpg', ... },
   *   ]
   *
   * Angular 定義在 class 屬性中，效果相同。
   * 這些資料是靜態的（不需要從 API 取得），所以不放在 Store 中。
   */
  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      image: 'assets/images/home/carousel/26_twice.jpg',
      title: 'TWICE',
      subtitle: 'JYP Entertainment',
      colorFrom: '#ff6b9d',
      colorTo: '#ff8e53',
    },
    {
      id: 2,
      image: 'assets/images/home/carousel/26_day6.jpg',
      title: 'Day6',
      subtitle: 'JYP Entertainment',
      colorFrom: '#f59e0b',
      colorTo: '#10b981',
    },
    {
      id: 3,
      image: 'assets/images/home/carousel/26_jm2026.jpg',
      title: 'K-Pop Hub',
      subtitle: '探索你喜愛的 K-pop 團體',
      colorFrom: '#7c3aed',
      colorTo: '#2563eb',
    },
    {
      id: 4,
      image: '',
      title: 'BTS',
      subtitle: 'HYBE Labels',
      colorFrom: '#4f46e5',
      colorTo: '#7c3aed',
    },
    {
      id: 5,
      image: '',
      title: 'BLACKPINK',
      subtitle: 'YG Entertainment',
      colorFrom: '#ec4899',
      colorTo: '#374151',
    },
  ];

  /**
   * 跑馬燈訊息
   *
   * 【Vue 對比】
   * Vue 版本也定義在 HomePage.vue 的 data 中，結構完全相同。
   */
  marqueeMessages: string[] = [
    '歡迎來到 K-Pop Hub！探索你最愛的韓流偶像',
    'TWICE 出道 10 週年，粉絲見面會全球巡迴中',
    'NewJeans 新單曲登上 Billboard Global 排行榜',
    'aespa 世界巡迴演唱會亞洲場開票中',
    'Stray Kids 連續登頂 Billboard 200 冠軍',
    'BTS 全員退伍！2025 完整體回歸！ARMY 期待已久',
  ];

  /**
   * 建構子注入
   *
   * 【Vue 對比】
   * Vue：
   *   const store = useKpopStore()
   *   const router = useRouter()
   *
   * Angular 使用建構子注入，將 Store 和 Router 注入到元件中。
   * 這是 Angular DI（依賴注入）系統的標準做法。
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    // 在建構子中初始化 Observable（不會立即執行，等模板訂閱時才觸發）
    this.companies$ = this.store.select(selectCompanies);
    this.filteredGroups$ = this.store.select(selectFilteredGroups);
    this.selectedCompanyId$ = this.store.select(selectSelectedCompanyId);
  }

  /**
   * ngOnInit — 元件初始化
   *
   * 【Vue 對比】
   * Vue：onMounted(() => { ... })
   *
   * 在 AppComponent 中已經 dispatch 了 loadAllData，
   * 所以這裡不需要再次載入資料。
   * HomeComponent 只負責「訂閱」Store 中的資料。
   */
  ngOnInit(): void {
    // 資料已由 AppComponent 的 ngOnInit 載入
    // HomeComponent 透過 selector 訂閱資料流即可
  }

  /**
   * 選擇公司（觸發篩選）
   *
   * 【Vue 對比】
   * Vue：
   *   function handleCompanySelect(companyId) {
   *     kpopStore.selectedCompanyId = companyId
   *   }
   *
   * Angular 透過 dispatch action 通知 Store 更新。
   * 這是 NgRx 的標準流程：元件 → dispatch → reducer → state 更新 → selector 通知。
   */
  onCompanySelect(companyId: string): void {
    this.store.dispatch(KpopActions.selectCompany({ companyId }));
  }

  /**
   * 點擊團體卡片 → 導航到團體詳情頁
   *
   * 【Vue 對比】
   * Vue：router.push(`/group/${groupId}`)
   * Angular：this.router.navigate(['/group', groupId])
   *
   * 注意語法差異：
   * - Vue Router 用字串路徑
   * - Angular Router 用陣列（每個路徑段是一個元素）
   */
  onGroupClick(groupId: string): void {
    this.router.navigate(['/group', groupId]);
  }

  /**
   * trackBy 函式 — 幫助 Angular 追蹤列表中的項目
   *
   * 【Vue 對比】
   * Vue 用 :key="group.id" 達到同樣效果：
   *   <div v-for="group in groups" :key="group.id" />
   *
   * Angular 的 *ngFor 預設用「物件參考」來追蹤項目，
   * 如果每次都產生新的物件陣列（像從 Store selector 回傳的），
   * Angular 會認為「所有項目都改變了」，導致整個列表重新渲染。
   *
   * trackBy 告訴 Angular：用 group.id 來識別項目，
   * 只有 id 不同的項目才需要重新渲染。
   *
   * @param index — 項目在陣列中的索引
   * @param group — 團體物件
   * @returns 唯一識別值（這裡用 group.id）
   */
  trackByGroupId(index: number, group: Group): string {
    return group.id;
  }
}
