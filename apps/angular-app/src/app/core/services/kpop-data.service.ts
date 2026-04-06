/**
 * KpopDataService — K-pop 資料服務
 *
 * ============================================================
 * 【Vue 對比】Angular Service vs Vue Composable
 * ============================================================
 *
 * Angular 的 Service 是一個用 @Injectable 標記的 class，
 * 透過依賴注入（DI）系統提供給需要的元件。
 *
 * Vue 的 Composable 是一個普通函式，用 import 引入：
 *
 *   // Vue Composable（composables/useKpopData.ts）
 *   export function useKpopData() {
 *     const getAllData = () => { ... }
 *     const getGroupsByCompany = (companyId) => { ... }
 *     return { getAllData, getGroupsByCompany }
 *   }
 *
 *   // 在元件中使用
 *   const { getAllData } = useKpopData()
 *
 *   // Angular Service
 *   @Injectable({ providedIn: 'root' })
 *   export class KpopDataService {
 *     getAllData(): Observable<...> { ... }
 *   }
 *
 *   // 在元件中使用（建構子注入）
 *   constructor(private kpopService: KpopDataService) {}
 *
 * 主要差異：
 * 1. 生命週期：Service 是 singleton（整個 App 只有一個實例），
 *    Composable 每次呼叫都可能建立新實例（除非內部用 global state）
 * 2. 測試：Service 容易 mock（注入假的實例），
 *    Composable 需要 mock 整個模組
 * 3. 響應式：Service 回傳 Observable（串流），
 *    Composable 回傳 ref / reactive（響應式物件）
 *
 * providedIn: 'root' — 告訴 Angular 在根注入器中提供這個 service，
 * 整個 App 共用同一個實例（singleton）。
 * 如果不寫 providedIn，就需要在 NgModule 的 providers 中手動註冊。
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Company, Group, Member } from '../../store/kpop/kpop.models';
import { COMPANIES, GROUPS, MEMBERS } from '../data/kpop.data';

/**
 * KpopDataService — 提供 K-pop 資料的核心服務
 *
 * 目前使用靜態資料（模擬 API 回傳），
 * 未來可以替換為真正的 HTTP 呼叫。
 *
 * 使用 delay() 模擬網路延遲，讓 loading 效果可見。
 *
 * 【Vue 對比】
 * Vue 版本直接 import 靜態資料，不需要 service 層：
 *   import { companies, groups, members } from '@/data/kpop'
 *
 * Angular 把資料存取抽象成 Service，好處：
 * - 未來替換成 HTTP API 時，只需修改 Service，元件不用改
 * - 可以注入 mock Service 做測試
 * - 集中管理資料轉換邏輯
 */
@Injectable({ providedIn: 'root' })
export class KpopDataService {

  /**
   * 取得所有資料（公司、團體、成員）
   *
   * 【Vue 對比】
   * Vue：直接 import，同步取得
   *   import { companies, groups, members } from '@/data/kpop'
   *
   * Angular：回傳 Observable，模擬非同步 API（delay 300ms）
   *   this.kpopService.getAllData().subscribe(data => ...)
   *
   * of() — 建立一個立即發出值的 Observable
   * delay(300) — 延遲 300ms 後發出，模擬網路延遲
   */
  getAllData(): Observable<{ companies: Company[]; groups: Group[]; members: Member[] }> {
    return of({
      companies: COMPANIES,
      groups: GROUPS,
      members: MEMBERS,
    }).pipe(delay(300));
  }

  /**
   * 依公司 ID 取得團體列表
   *
   * 【Vue 對比】
   * Vue：getGroupsByCompany(companyId)（kpop.js 中的 helper function）
   * Angular：回傳 Observable
   */
  getGroupsByCompany(companyId: string): Observable<Group[]> {
    const filtered = GROUPS.filter(g => g.companyId === companyId);
    return of(filtered);
  }

  /**
   * 取得團體詳情與其所有成員
   *
   * 【Vue 對比】
   * Vue：
   *   const group = getGroupById(groupId)
   *   const members = getMembersByGroup(groupId)
   *
   * Angular：合併成一個 Observable，一次回傳
   */
  getGroupWithMembers(groupId: string): Observable<{ group: Group; members: Member[] }> {
    const group = GROUPS.find(g => g.id === groupId);
    const members = MEMBERS.filter(m => m.groupId === groupId);
    return of({
      group: group as Group,
      members,
    }).pipe(delay(200));
  }

  /**
   * 取得成員詳情與其所屬團體
   *
   * 【Vue 對比】
   * Vue：
   *   const member = getMemberById(memberId)
   *   const group = getGroupById(member.groupId)
   *
   * Angular：合併成一個 Observable，一次回傳
   */
  getMemberWithGroup(memberId: string): Observable<{ member: Member; group: Group }> {
    const member = MEMBERS.find(m => m.id === memberId);
    const group = member ? GROUPS.find(g => g.id === member.groupId) : undefined;
    return of({
      member: member as Member,
      group: group as Group,
    }).pipe(delay(200));
  }

  // ─────────────────────────────────────────────
  // 同步 Helper 方法（對應 vue-app 的 helper functions）
  // ─────────────────────────────────────────────

  /**
   * 依 ID 取得公司
   *
   * 【Vue 對比】
   * Vue：export function getCompanyById(id) { return companies.find(c => c.id === id) }
   * Angular：this.kpopService.getCompanyById('jype')
   */
  getCompanyById(companyId: string): Company | undefined {
    return COMPANIES.find(c => c.id === companyId);
  }

  /**
   * 依 ID 取得團體（同步版本）
   */
  getGroupById(groupId: string): Group | undefined {
    return GROUPS.find(g => g.id === groupId);
  }

  /**
   * 依團體 ID 取得成員列表（同步版本）
   */
  getMembersByGroup(groupId: string): Member[] {
    return MEMBERS.filter(m => m.groupId === groupId);
  }

  /**
   * 依 ID 取得成員（同步版本）
   */
  getMemberById(memberId: string): Member | undefined {
    return MEMBERS.find(m => m.id === memberId);
  }
}
