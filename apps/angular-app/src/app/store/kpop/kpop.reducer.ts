/**
 * K-pop Store — Reducer（狀態歸約器）
 *
 * ============================================================
 * 【Vue 對比】NgRx Reducer vs Pinia State Mutation
 * ============================================================
 *
 * Reducer 是 NgRx 的核心概念：一個「純函式」，
 * 接收「目前的 state」和「action」，回傳「新的 state」。
 *
 * 關鍵差異：
 *
 * 1. 不可變性（Immutability）
 *    Pinia 直接修改 state（Vue 的 Proxy 會追蹤變更）：
 *      this.companies = data.companies  // 直接賦值 ✓
 *
 *    NgRx Reducer 必須回傳全新的 state 物件（不能修改原始 state）：
 *      on(loadSuccess, (state, { companies }) => ({
 *        ...state,                   // 展開原本的 state
 *        companies,                  // 覆蓋 companies 欄位
 *      }))
 *
 * 2. 可預測性
 *    Pinia 的 state 可以在任何地方被修改（action、computed、甚至元件）。
 *    NgRx 的 state 只能透過 Reducer 修改，而且 Reducer 是純函式，
 *    相同的輸入一定產生相同的輸出，非常容易測試和除錯。
 *
 * 3. 時間旅行除錯
 *    因為每次 state 變更都產生全新物件，
 *    NgRx DevTools 可以「回到過去」任何一個 state 快照。
 *    Pinia 的 DevTools 也有類似功能，但因為是直接修改，精確度略低。
 *
 * createReducer + on：
 *   createReducer(initialState, on(action, reducerFn))
 *   - initialState：Store 的初始狀態
 *   - on()：監聽某個 action，當它被 dispatch 時執行 reducer 函式
 * ============================================================
 */

import { createReducer, on } from '@ngrx/store';
import { KpopActions } from './kpop.actions';
import { Company, Group, Member } from './kpop.models';

/**
 * Kpop State 介面 — 定義 K-pop store 的完整狀態結構
 *
 * 【Vue 對比】
 * 對應 Pinia store 的 state() 回傳值：
 *
 *   // Pinia
 *   const useKpopStore = defineStore('kpop', {
 *     state: () => ({
 *       companies: [],
 *       groups: [],
 *       members: [],
 *       selectedCompanyId: 'jype',
 *       ...
 *     })
 *   })
 *
 * NgRx 用 interface 明確定義型別，Pinia 通常靠推斷或 JSDoc。
 */
export interface KpopState {
  /** 所有公司列表 */
  companies: Company[];
  /** 所有團體列表 */
  groups: Group[];
  /** 所有成員列表 */
  members: Member[];
  /** 目前選中的公司 ID（用於篩選團體） */
  selectedCompanyId: string;
  /** 目前檢視的團體詳情 */
  currentGroup: Group | null;
  /** 目前檢視團體的成員列表 */
  currentGroupMembers: Member[];
  /** 目前檢視的成員詳情 */
  currentMember: Member | null;
  /** 目前檢視成員的所屬團體 */
  currentMemberGroup: Group | null;
}

/**
 * 初始狀態
 *
 * 【Vue 對比】
 * Pinia 的 state() 回傳值 === NgRx 的 initialState。
 * 預設選中 'jype'（JYP Entertainment），和 Vue 版本一致。
 */
export const initialKpopState: KpopState = {
  companies: [],
  groups: [],
  members: [],
  selectedCompanyId: 'jype',
  currentGroup: null,
  currentGroupMembers: [],
  currentMember: null,
  currentMemberGroup: null,
};

/**
 * Kpop Reducer — 處理所有 Kpop 相關 action 的狀態更新
 *
 * 【Vue 對比】
 * 每個 on() 對應 Pinia action 中的「state 修改部分」。
 *
 * Pinia：
 *   loadAllData() { this.companies = [...]; this.groups = [...]; }
 *
 * NgRx：
 *   on(loadAllDataSuccess, (state, { companies, groups, members }) => ({
 *     ...state, companies, groups, members
 *   }))
 *
 * 注意：NgRx 的 reducer 只處理「同步」的 state 更新。
 * 非同步操作（API 呼叫）由 Effect 處理。
 */
export const kpopReducer = createReducer(
  initialKpopState,

  /**
   * 載入所有資料成功 → 更新 companies、groups、members
   *
   * 【Vue 對比】
   * Pinia 在 async action 的 .then() 或 await 後直接修改：
   *   const data = await api.getAllData()
   *   this.companies = data.companies
   *   this.groups = data.groups
   *   this.members = data.members
   */
  on(KpopActions.loadAllDataSuccess, (state, { companies, groups, members }) => ({
    ...state,
    companies,
    groups,
    members,
  })),

  /**
   * 選擇公司 → 更新 selectedCompanyId
   *
   * 【Vue 對比】
   * Pinia：this.selectedCompanyId = companyId（直接修改）
   * NgRx：必須回傳全新 state 物件
   */
  on(KpopActions.selectCompany, (state, { companyId }) => ({
    ...state,
    selectedCompanyId: companyId,
  })),

  /**
   * 載入團體詳情成功 → 更新 currentGroup 和 currentGroupMembers
   */
  on(KpopActions.loadGroupDetailSuccess, (state, { group, members }) => ({
    ...state,
    currentGroup: group,
    currentGroupMembers: members,
  })),

  /**
   * 載入成員詳情成功 → 更新 currentMember 和 currentMemberGroup
   */
  on(KpopActions.loadMemberDetailSuccess, (state, { member, group }) => ({
    ...state,
    currentMember: member,
    currentMemberGroup: group,
  })),
);
