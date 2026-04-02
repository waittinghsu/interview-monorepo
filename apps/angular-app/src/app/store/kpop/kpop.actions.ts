/**
 * K-pop Store — Actions（動作定義）
 *
 * ============================================================
 * 【Vue 對比】NgRx Actions vs Pinia Actions
 * ============================================================
 *
 * NgRx 的 Action 是「描述發生了什麼事」的純物件。
 * 它本身不做任何事，只是一個訊號。
 *
 * Pinia 的 action 則是「直接執行邏輯」的函式：
 *
 *   // Pinia（Vue）— action 是函式，直接修改 state
 *   const useKpopStore = defineStore('kpop', {
 *     actions: {
 *       async loadAllData() {
 *         this.companies = await fetchCompanies()  // 直接改 state
 *       },
 *       selectCompany(id) {
 *         this.selectedCompanyId = id              // 直接改 state
 *       }
 *     }
 *   })
 *
 *   // NgRx（Angular）— action 只是訊號，不含邏輯
 *   export const loadAllData = createAction('[Kpop] Load All Data')
 *   export const selectCompany = createAction(
 *     '[Kpop] Select Company',
 *     props<{ companyId: string }>()
 *   )
 *
 * NgRx 的流程：
 *   dispatch(Action) → Reducer 更新 state → Effect 處理副作用
 *
 * Pinia 的流程：
 *   store.action() → 直接修改 state + 處理副作用（全在同一個函式）
 *
 * createAction — NgRx 用來建立 action creator 的函式：
 *   - 第一個參數是 action type 字串（慣例用 [Source] Description）
 *   - props<T>() 定義 payload 型別
 * ============================================================
 */

import { createAction, props } from '@ngrx/store';
import { Company, Group, Member } from './kpop.models';

/**
 * 載入所有資料（公司、團體、成員）
 *
 * 觸發時機：App 初始化時
 * 處理者：KpopEffects.loadAllData$
 *
 * 【Vue 對比】
 * Pinia：onMounted(() => kpopStore.loadAllData())
 * NgRx：this.store.dispatch(KpopActions.loadAllData())
 */
export const loadAllData = createAction('[Kpop] Load All Data');

/**
 * 載入所有資料成功
 *
 * 攜帶完整的 companies、groups、members 資料。
 * 由 Effect 在 API 回傳成功後 dispatch。
 *
 * 【Vue 對比】
 * Pinia 不需要這個 action，因為 loadAllData() 直接寫入 state。
 * NgRx 需要分開「請求」和「成功」兩個 action，讓資料流更明確。
 */
export const loadAllDataSuccess = createAction(
  '[Kpop] Load All Data Success',
  props<{ companies: Company[]; groups: Group[]; members: Member[] }>(),
);

/**
 * 選擇公司（篩選團體列表）
 *
 * 【Vue 對比】
 * Pinia：kpopStore.selectedCompanyId = 'hybe'（直接賦值）
 * NgRx：this.store.dispatch(KpopActions.selectCompany({ companyId: 'hybe' }))
 */
export const selectCompany = createAction(
  '[Kpop] Select Company',
  props<{ companyId: string }>(),
);

/**
 * 載入團體詳情（含成員列表）
 *
 * 進入團體頁面時觸發。
 * 處理者：KpopEffects.loadGroupDetail$
 */
export const loadGroupDetail = createAction(
  '[Kpop] Load Group Detail',
  props<{ groupId: string }>(),
);

/**
 * 載入團體詳情成功
 */
export const loadGroupDetailSuccess = createAction(
  '[Kpop] Load Group Detail Success',
  props<{ group: Group; members: Member[] }>(),
);

/**
 * 載入成員詳情（含所屬團體）
 *
 * 進入成員頁面時觸發。
 * 處理者：KpopEffects.loadMemberDetail$
 */
export const loadMemberDetail = createAction(
  '[Kpop] Load Member Detail',
  props<{ memberId: string }>(),
);

/**
 * 載入成員詳情成功
 */
export const loadMemberDetailSuccess = createAction(
  '[Kpop] Load Member Detail Success',
  props<{ member: Member; group: Group }>(),
);

/**
 * 統一匯出命名空間 — 方便使用
 *
 * 【Vue 對比】
 * 在 Vue 中不需要這個包裝，因為 Pinia store 本身就是一個命名空間：
 *   kpopStore.loadAllData()
 *   kpopStore.selectCompany('hybe')
 *
 * NgRx 需要手動組織：
 *   KpopActions.loadAllData()
 *   KpopActions.selectCompany({ companyId: 'hybe' })
 */
export const KpopActions = {
  loadAllData,
  loadAllDataSuccess,
  selectCompany,
  loadGroupDetail,
  loadGroupDetailSuccess,
  loadMemberDetail,
  loadMemberDetailSuccess,
};
