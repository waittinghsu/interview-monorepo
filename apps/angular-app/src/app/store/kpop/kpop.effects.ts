/**
 * K-pop Store — Effects（副作用處理）
 *
 * ============================================================
 * 【Vue 對比】NgRx Effects vs Pinia async actions
 * ============================================================
 *
 * NgRx Effect 專門處理「副作用」（Side Effects），
 * 也就是那些不是純粹 state 更新的操作：
 * - API 呼叫
 * - 路由導航
 * - localStorage 讀寫
 * - 計時器
 *
 * 在 Pinia 中，這些邏輯直接寫在 action 裡：
 *
 *   // Pinia — async action（副作用和 state 更新混在一起）
 *   actions: {
 *     async loadAllData() {
 *       const data = await api.getAllData()   // 副作用：API 呼叫
 *       this.companies = data.companies       // state 更新
 *       this.groups = data.groups             // state 更新
 *     }
 *   }
 *
 *   // NgRx — Effect 只處理副作用，然後 dispatch 新的 action
 *   loadAllData$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType(KpopActions.loadAllData),             // 監聽 action
 *       switchMap(() => this.kpopService.getAllData()), // 副作用
 *       map(data => KpopActions.loadAllDataSuccess(data)) // dispatch 結果
 *     )
 *   )
 *
 * 為什麼要分這麼細？
 * 1. 關注點分離：Reducer 只管 state、Effect 只管副作用
 * 2. 可測試性：可以獨立測試 Effect 的邏輯（不需要真正呼叫 API）
 * 3. 可取消性：switchMap 自動取消前一次未完成的請求
 * 4. 錯誤處理：集中處理 API 錯誤
 *
 * RxJS 管道操作符：
 * - ofType()：只監聽特定的 action
 * - switchMap()：切換到新的 Observable，自動取消前一次的
 * - map()：轉換資料
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { KpopActions } from './kpop.actions';
import { KpopDataService } from '../../core/services/kpop-data.service';

/**
 * KpopEffects — K-pop 資料的副作用處理器
 *
 * 【Vue 對比】Angular DI 注入 vs Vue composable
 *
 * Angular：
 *   @Injectable() — 告訴 DI 系統這個 class 可以被注入
 *   constructor 中宣告依賴 → DI 自動提供實例
 *
 * Vue：
 *   const kpopStore = useKpopStore()       // 在 setup 中呼叫 composable
 *   const { data } = useFetch('/api/...')  // 直接使用
 */
@Injectable()
export class KpopEffects {
  /**
   * 建構子注入
   *
   * - actions$：NgRx 的 action 串流（所有被 dispatch 的 action 都會流過這裡）
   * - kpopDataService：K-pop 資料服務（提供 API 方法）
   *
   * 【Vue 對比】
   * Vue 沒有建構子注入，而是在 setup() 中直接 import 使用：
   *   import { useKpopApi } from '@/composables/useKpopApi'
   *   const { getAllData } = useKpopApi()
   */
  constructor(
    private readonly actions$: Actions,
    private readonly kpopDataService: KpopDataService,
  ) {}

  /**
   * Effect：載入所有資料
   *
   * 監聽 loadAllData action → 呼叫 KpopDataService → dispatch loadAllDataSuccess
   *
   * 【Vue 對比】
   * Pinia 版本：
   *   async loadAllData() {
   *     const { companies, groups, members } = await fetchAllData()
   *     this.companies = companies
   *     this.groups = groups
   *     this.members = members
   *   }
   *
   * NgRx 拆成：
   *   dispatch(loadAllData) → Effect(呼叫 API) → dispatch(loadAllDataSuccess) → Reducer(更新 state)
   */
  loadAllData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadAllData),
      switchMap(() => this.kpopDataService.getAllData()),
      map(({ companies, groups, members }) =>
        KpopActions.loadAllDataSuccess({ companies, groups, members }),
      ),
    ),
  );

  /**
   * Effect：載入團體詳情
   *
   * 監聽 loadGroupDetail action → 呼叫 service → dispatch loadGroupDetailSuccess
   */
  loadGroupDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadGroupDetail),
      switchMap(({ groupId }) => this.kpopDataService.getGroupWithMembers(groupId)),
      map(({ group, members }) =>
        KpopActions.loadGroupDetailSuccess({ group, members }),
      ),
    ),
  );

  /**
   * Effect：載入成員詳情
   *
   * 監聽 loadMemberDetail action → 呼叫 service → dispatch loadMemberDetailSuccess
   */
  loadMemberDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadMemberDetail),
      switchMap(({ memberId }) => this.kpopDataService.getMemberWithGroup(memberId)),
      map(({ member, group }) =>
        KpopActions.loadMemberDetailSuccess({ member, group }),
      ),
    ),
  );
}
