/**
 * Polyfills 檔案
 *
 * Angular 需要某些 polyfills 才能正常運作。
 * zone.js 是最重要的，它攔截所有非同步操作（setTimeout、Promise、事件監聽等），
 * 讓 Angular 知道何時需要執行變更偵測（Change Detection）。
 *
 * 【Vue 對比】
 * Vue 使用 Proxy-based 的響應式系統，不需要 zone.js。
 * Vue 直接追蹤資料的 getter/setter 來觸發更新。
 */

import 'zone.js';
