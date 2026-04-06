/**
 * K-pop 資料模型定義
 *
 * ============================================================
 * 【Vue 對比】TypeScript Interface vs JavaScript Plain Object
 * ============================================================
 *
 * Angular 專案幾乎都使用 TypeScript，所以資料結構用 interface 定義。
 * Vue 的 kpop.js 用純 JavaScript 物件，沒有型別約束：
 *
 *   // Vue（kpop.js）— 沒有型別定義，靠 JSDoc 或開發者自律
 *   export const companies = [
 *     { id: 'jype', name: 'JYP Entertainment', ... }
 *   ]
 *
 *   // Angular — 用 interface 嚴格定義每個欄位的型別
 *   export interface Company {
 *     id: string;
 *     name: string;
 *     ...
 *   }
 *
 * 好處：
 * - 編譯期就能抓到拼字錯誤（如 comapnyId → companyId）
 * - IDE 自動補全所有欄位
 * - 重構時能自動追蹤所有使用處
 * ============================================================
 */

/**
 * 娛樂公司（對應 vue-app 的 companies 陣列結構）
 *
 * 包含公司的基本資訊和用於 UI 渲染的漸層色設定。
 * gradientFrom / gradientTo 用於 CSS 漸層背景。
 */
export interface Company {
  /** 唯一識別碼（如 'jype', 'hybe', 'sm', 'yg'） */
  id: string;
  /** 公司全名 */
  name: string;
  /** 簡稱 */
  shortName: string;
  /** 圖示（目前為空字串，預留擴充） */
  icon: string;
  /** 代表色（十六進位色碼） */
  color: string;
  /** 漸層起始色 */
  gradientFrom: string;
  /** 漸層結束色 */
  gradientTo: string;
  /** 公司描述 */
  description: string;
}

/**
 * 團體（對應 vue-app 的 groups 陣列結構）
 *
 * 每個團體隸屬於一間公司（透過 companyId 關聯）。
 * cover 欄位存放團體封面照片路徑。
 */
export interface Group {
  /** 唯一識別碼（如 'twice', 'bts'） */
  id: string;
  /** 所屬公司的 id（外鍵） */
  companyId: string;
  /** 團體名稱（英文/常用名） */
  name: string;
  /** 韓文名稱 */
  koreanName: string;
  /** 出道日期（YYYY-MM-DD 格式） */
  debut: string;
  /** 粉絲團名稱 */
  fandomName: string;
  /** 團體封面照片路徑 */
  cover: string;
  /** 團體介紹 */
  description: string;
  /** 代表色 */
  color: string;
  /** 漸層起始色 */
  gradientFrom: string;
  /** 漸層結束色 */
  gradientTo: string;
}

/**
 * 成員（對應 vue-app 的 members 陣列結構）
 *
 * 每個成員隸屬於一個團體（透過 groupId 關聯）。
 * position 是陣列，因為一個成員可能有多個職位。
 */
export interface Member {
  /** 唯一識別碼（如 'nayeon', 'rm'） */
  id: string;
  /** 所屬團體的 id（外鍵） */
  groupId: string;
  /** 中文名稱 */
  name: string;
  /** 韓文名稱 */
  koreanName: string;
  /** 英文名稱 */
  englishName: string;
  /** 生日（YYYY-MM-DD 格式） */
  birthday: string;
  /** 國籍 */
  nationality: string;
  /** 團內職位（可多個，如 ['隊長', '主唱']） */
  position: string[];
  /** 成員照片路徑 */
  photo: string;
  /** 代表色 */
  color: string;
}

/**
 * 輪播圖資料（首頁 Banner 用）
 *
 * 【Vue 對比】
 * Vue 版本的輪播圖定義在 HomePage.vue 的 data/ref 中，
 * Angular 版本抽到獨立 interface，方便 Store 管理。
 */
export interface CarouselSlide {
  /** 幻燈片編號 */
  id: number;
  /** 圖片路徑 */
  image: string;
  /** 主標題 */
  title: string;
  /** 副標題 */
  subtitle: string;
  /** 漸層起始色 */
  colorFrom: string;
  /** 漸層結束色 */
  colorTo: string;
}
