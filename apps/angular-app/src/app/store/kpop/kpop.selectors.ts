/**
 * K-pop Store — Selectors（選取器）
 *
 * ============================================================
 * 【Vue 對比】NgRx Selectors vs Vue computed / Pinia getters
 * ============================================================
 *
 * Selector 是從 Store 中「選取」並「衍生」資料的純函式。
 * 它的角色完全對應 Vue 的 computed() 或 Pinia 的 getters。
 *
 *   // Vue computed（在元件中）
 *   const filteredGroups = computed(() =>
 *     groups.value.filter(g => g.companyId === selectedCompanyId.value)
 *   )
 *
 *   // Pinia getters（在 store 中）
 *   getters: {
 *     filteredGroups: (state) =>
 *       state.groups.filter(g => g.companyId === state.selectedCompanyId)
 *   }
 *
 *   // NgRx Selector
 *   export const selectFilteredGroups = createSelector(
 *     selectAllGroups,
 *     selectSelectedCompanyId,
 *     (groups, companyId) => groups.filter(g => g.companyId === companyId)
 *   )
 *
 * createSelector 的優勢：
 * - 自動 memoization（記憶化）：輸入沒變就不重新計算
 * - 可組合：Selector 可以組合其他 Selector
 * - 可測試：純函式，不依賴外部狀態
 *
 * Vue 的 computed 也有快取機制，但 NgRx Selector 的組合性更強。
 *
 * createFeatureSelector — 從根 state 中選取某個 feature slice：
 *   createFeatureSelector<KpopState>('kpop')
 *   等於：(state: AppState) => state.kpop
 * ============================================================
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KpopState } from './kpop.reducer';

/**
 * Feature Selector — 選取 Kpop 這個 slice 的完整 state
 *
 * 【Vue 對比】
 * 就像在 Vue 元件中呼叫 const kpopStore = useKpopStore()，
 * 拿到整個 store 的參考。
 */
const selectKpopState = createFeatureSelector<KpopState>('kpop');

/**
 * 選取所有公司
 *
 * 【Vue 對比】
 * Pinia：storeToRefs(kpopStore).companies
 * Vue：kpopStore.companies（直接存取 state）
 */
export const selectCompanies = createSelector(
  selectKpopState,
  (state) => state.companies,
);

/**
 * 選取所有團體（未篩選）
 */
export const selectAllGroups = createSelector(
  selectKpopState,
  (state) => state.groups,
);

/**
 * 選取目前選中的公司 ID
 */
export const selectSelectedCompanyId = createSelector(
  selectKpopState,
  (state) => state.selectedCompanyId,
);

/**
 * 選取目前選中的公司物件
 *
 * 【Vue 對比】
 * Pinia getter：
 *   selectedCompany: (state) =>
 *     state.companies.find(c => c.id === state.selectedCompanyId)
 *
 * NgRx Selector 可以「組合」其他 Selector，達到同樣效果：
 */
export const selectSelectedCompany = createSelector(
  selectCompanies,
  selectSelectedCompanyId,
  (companies, selectedId) => companies.find(c => c.id === selectedId) ?? null,
);

/**
 * 選取篩選後的團體列表（根據選中的公司）
 *
 * 【Vue 對比】
 * 這是最典型的「衍生資料」場景：
 *
 *   // Vue computed
 *   const filteredGroups = computed(() =>
 *     groups.value.filter(g => g.companyId === selectedCompanyId.value)
 *   )
 *
 * NgRx 的 createSelector 會自動做 memoization：
 * 只有 groups 或 selectedCompanyId 改變時才重新計算。
 * Vue 的 computed 也有類似的快取機制（dependency tracking）。
 */
export const selectFilteredGroups = createSelector(
  selectAllGroups,
  selectSelectedCompanyId,
  (groups, companyId) => groups.filter(g => g.companyId === companyId),
);

/**
 * 選取目前檢視的團體
 */
export const selectCurrentGroup = createSelector(
  selectKpopState,
  (state) => state.currentGroup,
);

/**
 * 選取目前團體的成員列表
 */
export const selectCurrentGroupMembers = createSelector(
  selectKpopState,
  (state) => state.currentGroupMembers,
);

/**
 * 選取目前檢視的成員
 */
export const selectCurrentMember = createSelector(
  selectKpopState,
  (state) => state.currentMember,
);

/**
 * 選取目前成員的所屬團體
 */
export const selectCurrentMemberGroup = createSelector(
  selectKpopState,
  (state) => state.currentMemberGroup,
);
