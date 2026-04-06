# Angular K-pop Hub 實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將 vue-app 完整改寫為 Angular 13+（NgModule 架構），Seoul Editorial 設計風格，含完整 NgRx 狀態管理，中文註解教學用途。

**Architecture:** Angular 13+ with NgModule pattern, lazy-loaded feature modules, NgRx (Store/Actions/Reducers/Effects/Selectors), Angular Material UI, HttpClient with interceptors. Seoul Editorial visual design (cream/ink/coral palette, Cormorant Garamond + DM Sans fonts).

**Tech Stack:** Angular 13+, NgRx, Angular Material, RxJS, TypeScript strict, SCSS, nginx (Dockerfile)

**Design Doc:** `docs/plans/2026-04-02-angular-app-design.md`

---

## Task 1: 初始化 Angular 專案

**Files:**
- Create: `apps/angular-app/package.json`
- Create: `apps/angular-app/angular.json`
- Create: `apps/angular-app/tsconfig.json`
- Create: `apps/angular-app/tsconfig.app.json`
- Create: `apps/angular-app/.eslintrc.json`
- Create: `apps/angular-app/src/main.ts`
- Create: `apps/angular-app/src/index.html`
- Create: `apps/angular-app/src/styles.scss`
- Create: `apps/angular-app/src/app/app.module.ts`
- Create: `apps/angular-app/src/app/app.component.ts`
- Create: `apps/angular-app/src/app/app.component.html`
- Create: `apps/angular-app/src/app/app.component.scss`
- Create: `apps/angular-app/src/app/app-routing.module.ts`
- Create: `apps/angular-app/src/environments/environment.ts`
- Create: `apps/angular-app/src/environments/environment.prod.ts`

**Step 1: 建立 package.json**

```json
{
  "name": "@interview/angular-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 4200",
    "build": "ng build --configuration production",
    "lint": "ng lint",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^13.3.0",
    "@angular/cdk": "^13.3.0",
    "@angular/common": "^13.3.0",
    "@angular/compiler": "^13.3.0",
    "@angular/core": "^13.3.0",
    "@angular/forms": "^13.3.0",
    "@angular/material": "^13.3.0",
    "@angular/platform-browser": "^13.3.0",
    "@angular/platform-browser-dynamic": "^13.3.0",
    "@angular/router": "^13.3.0",
    "@ngrx/effects": "^13.2.0",
    "@ngrx/store": "^13.2.0",
    "@ngrx/store-devtools": "^13.2.0",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^13.3.0",
    "@angular-eslint/builder": "^13.2.0",
    "@angular-eslint/eslint-plugin": "^13.2.0",
    "@angular-eslint/eslint-plugin-template": "^13.2.0",
    "@angular-eslint/schematics": "^13.2.0",
    "@angular-eslint/template-parser": "^13.2.0",
    "@angular/cli": "^13.3.0",
    "@angular/compiler-cli": "^13.3.0",
    "@types/node": "^16.0.0",
    "eslint": "^8.0.0",
    "typescript": "~4.5.5"
  }
}
```

**Step 2: 建立 angular.json**

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "angular-app": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/angular-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "zone.js",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/assets"],
            "styles": ["src/styles.scss",
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "1mb", "maximumError": "2mb" }
              ],
              "fileReplacements": [
                { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": { "browserTarget": "angular-app:build:production" },
            "development": { "browserTarget": "angular-app:build:development" }
          },
          "defaultConfiguration": "development"
        },
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
          }
        }
      }
    }
  }
}
```

**Step 3: 建立 tsconfig.json 和 tsconfig.app.json**

tsconfig.json:
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2017",
    "module": "es2020",
    "lib": ["es2020", "dom"],
    "paths": {
      "@app/*": ["src/app/*"],
      "@env/*": ["src/environments/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

tsconfig.app.json:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
```

**Step 4: 建立 .eslintrc.json**

```json
{
  "root": true,
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": ["error", { "type": "attribute", "prefix": "app", "style": "camelCase" }],
        "@angular-eslint/component-selector": ["error", { "type": "element", "prefix": "app", "style": "kebab-case" }]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"]
    }
  ]
}
```

**Step 5: 建立 environments**

environment.ts:
```typescript
// 開發環境設定
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3001'
};
```

environment.prod.ts:
```typescript
// 生產環境設定
export const environment = {
  production: true,
  apiBaseUrl: '/api'
};
```

**Step 6: 建立 src/index.html**

```html
<!doctype html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">
  <title>K-Pop Hub — Seoul Editorial</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Google Fonts: Cormorant Garamond (display) + DM Sans (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**Step 7: 建立 src/styles.scss**

```scss
/* ======================================================
 * 全域樣式 — Seoul Editorial Theme
 *
 * 設計理念：
 *   靈感來自 K-pop 實體專輯內頁與韓國時尚雜誌。
 *   大量留白、精緻字體配對、克制的色彩運用。
 *
 * 色彩系統：
 *   --cream:  頁面底色（溫暖的奶油白，避免純白的冷感）
 *   --ink:    主文字色（接近黑色但不純黑，更柔和）
 *   --coral:  品牌強調色（僅用於 active 狀態和重點標記）
 * ====================================================== */

:root {
  --cream: #FAF8F3;
  --ink: #1A1A1A;
  --ink-muted: #6B6760;
  --coral: #E8614A;
  --coral-light: #FFF0ED;
  --border: #E2DDD6;
  --card: #FFFFFF;

  /* 字體 */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;

  /* 間距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* 圓角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* 轉場 */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease-out;
}

/* 重設 & 基礎 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background-color: var(--cream);
  color: var(--ink);
  line-height: 1.5;
  min-height: 100vh;
}

/* 隱藏捲軸（保留滾動功能） */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

/* Display 字體（用於標題） */
.font-display {
  font-family: var(--font-display);
}

/* 連結重設 */
a {
  color: inherit;
  text-decoration: none;
}

/* 圖片 */
img {
  display: block;
  max-width: 100%;
}

/* Angular Material 主題覆蓋 */
.mat-toolbar {
  background: var(--card) !important;
  color: var(--ink) !important;
  border-bottom: 1px solid var(--border);
}
```

**Step 8: 建立 src/main.ts**

```typescript
/**
 * Angular 應用程式進入點
 *
 * 【Vue 對比】
 * Vue:     createApp(App).use(router).use(pinia).mount('#app')
 * Angular: platformBrowserDynamic().bootstrapModule(AppModule)
 *
 * Angular 使用「模組啟動」的方式，由 AppModule 負責組裝
 * 所有依賴（路由、Store、第三方 UI 套件等），
 * 再透過 platformBrowserDynamic() 編譯並掛載到 DOM。
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**Step 9: 建立 AppModule + AppComponent + Routing**

app.module.ts:
```typescript
/**
 * AppModule — 根模組
 *
 * 【Vue 對比】
 * Vue 的 main.js 用 app.use() 一一掛載 plugin；
 * Angular 則在 @NgModule 的 imports 陣列統一宣告。
 *
 * 這裡匯入：
 *   - BrowserModule：DOM 渲染（類似 Vue 的 createApp）
 *   - BrowserAnimationsModule：Angular Material 動畫基礎
 *   - AppRoutingModule：路由設定（類似 Vue Router）
 *   - StoreModule.forRoot()：NgRx 全域 Store（類似 Pinia）
 *   - EffectsModule.forRoot()：NgRx Effects（處理非同步副作用）
 *   - CoreModule：單例 Service 和 Interceptor
 *   - SharedModule：共用元件（Header、Footer）
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { reducers } from './store';
import { KpopEffects } from './store/kpop/kpop.effects';
import { ThemeEffects } from './store/theme/theme.effects';
import { environment } from '@env/environment';

@NgModule({
  declarations: [
    AppComponent  // 根元件在這裡「宣告」，才能在模板中使用
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,

    // NgRx Store — 全域狀態管理
    // 【Vue 對比】等同 createPinia() + 所有 defineStore() 的集合
    StoreModule.forRoot(reducers),

    // NgRx Effects — 處理非同步操作（API call、timer 等）
    // 【Vue 對比】等同 Pinia store 中的 async function
    EffectsModule.forRoot([KpopEffects, ThemeEffects]),

    // Redux DevTools（僅開發環境啟用）
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
  ],
  bootstrap: [AppComponent]  // 指定啟動元件（類似 Vue 的 app.mount('#app')）
})
export class AppModule {}
```

app-routing.module.ts:
```typescript
/**
 * AppRoutingModule — 根路由
 *
 * 【Vue 對比】
 * Vue:     createRouter({ history: createWebHistory(), routes })
 * Angular: RouterModule.forRoot(routes)
 *
 * 關鍵差異：
 *   1. Angular 用 loadChildren 做模組層級的 lazy loading
 *      Vue 用 () => import() 做元件層級的 lazy loading
 *   2. Angular 路由參數用 :id，跟 Vue 一樣
 *   3. Angular 的 ** wildcard 等同 Vue 的 /:pathMatch(.*)*
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // Lazy loading：只在使用者瀏覽到該路由時才載入模組
    // 【Vue 對比】component: () => import('./pages/HomePage.vue')
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'group/:id',
    loadChildren: () =>
      import('./features/group/group.module').then(m => m.GroupModule),
  },
  {
    path: 'member/:id',
    loadChildren: () =>
      import('./features/member/member.module').then(m => m.MemberModule),
  },
  {
    // 404 — 重導到首頁
    // 【Vue 對比】{ path: '/:pathMatch(.*)*', redirect: '/' }
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',  // 等同 Vue Router 的 scrollBehavior: () => ({ top: 0 })
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

app.component.ts:
```typescript
/**
 * AppComponent — 根元件（Application Shell）
 *
 * 【Vue 對比】
 * 等同 App.vue + DefaultLayout.vue 的組合。
 * Angular 沒有內建 layout 系統，通常直接在根元件處理。
 *
 * 結構：
 *   <app-header>      — 頂部導航列
 *   <app-loading-bar> — 全域 loading 指示器
 *   <router-outlet>   — 等同 Vue 的 <router-view>
 *   <app-footer>      — 底部版權資訊
 */
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeActions } from './store/theme/theme.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * 【Vue 對比】
   * Vue: onMounted(() => themeStore.initTheme())
   * Angular: ngOnInit() { this.store.dispatch(...) }
   *
   * Angular 的生命週期用 interface 實作（OnInit），
   * 而非 Vue 的 onMounted() composable。
   */
  constructor(private store: Store) {}

  ngOnInit(): void {
    // 初始化主題 — dispatch action 讓 ThemeEffects 執行 CSS 變數設定
    this.store.dispatch(ThemeActions.applyTheme());
  }
}
```

app.component.html:
```html
<!--
  Application Shell 模板

  【Vue 對比】
  Vue 的 <router-view> 放在 layout 裡；
  Angular 的 <router-outlet> 直接放在根元件。

  mat-toolbar 是 Angular Material 的工具列元件，
  等同 Vue Quasar 的 <q-header> + <q-toolbar>。
-->
<div class="app-shell">
  <!-- 全域 Loading Bar -->
  <app-loading-bar></app-loading-bar>

  <!-- Header -->
  <app-header></app-header>

  <!-- 主內容區：限制最大寬度，置中對齊 -->
  <main class="main-content">
    <div class="content-container">
      <router-outlet></router-outlet>
    </div>
  </main>

  <!-- Footer -->
  <app-footer></app-footer>
</div>
```

app.component.scss:
```scss
/* App Shell 佈局 */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
}

.content-container {
  width: 100%;
  max-width: 480px;
  padding: var(--space-md);
}
```

**Step 10: Commit**

```bash
git add apps/angular-app/
git commit -m "feat(angular-app): scaffold Angular 13 project with NgModule architecture"
```

---

## Task 2: NgRx Store（kpop + ui + theme）

**Files:**
- Create: `apps/angular-app/src/app/store/index.ts`
- Create: `apps/angular-app/src/app/store/kpop/kpop.actions.ts`
- Create: `apps/angular-app/src/app/store/kpop/kpop.reducer.ts`
- Create: `apps/angular-app/src/app/store/kpop/kpop.selectors.ts`
- Create: `apps/angular-app/src/app/store/kpop/kpop.effects.ts`
- Create: `apps/angular-app/src/app/store/ui/ui.actions.ts`
- Create: `apps/angular-app/src/app/store/ui/ui.reducer.ts`
- Create: `apps/angular-app/src/app/store/ui/ui.selectors.ts`
- Create: `apps/angular-app/src/app/store/theme/theme.actions.ts`
- Create: `apps/angular-app/src/app/store/theme/theme.reducer.ts`
- Create: `apps/angular-app/src/app/store/theme/theme.selectors.ts`
- Create: `apps/angular-app/src/app/store/theme/theme.effects.ts`

**Step 1: 建立 Kpop 型別定義**

建立 `apps/angular-app/src/app/store/kpop/kpop.models.ts`：

```typescript
/**
 * K-pop 資料模型
 *
 * 【Vue 對比】
 * Vue（JS）不需要型別定義，直接用 plain object。
 * Angular（TS strict）要求明確型別，
 * 這也是 TypeScript 的核心價值：在編譯時期就抓到錯誤。
 */

/** 娛樂公司 */
export interface Company {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

/** K-pop 團體 */
export interface Group {
  id: string;
  companyId: string;
  name: string;
  koreanName: string;
  debut: string;
  fandomName: string;
  cover: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

/** 團體成員 */
export interface Member {
  id: string;
  groupId: string;
  name: string;
  koreanName: string;
  englishName: string;
  birthday: string;
  nationality: string;
  position: string[];
  photo: string;
  color: string;
}

/** 輪播圖資料 */
export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  colorFrom: string;
  colorTo: string;
}
```

**Step 2: 建立 Kpop Actions**

```typescript
/**
 * Kpop Actions — 定義所有「事件」
 *
 * 【Vue 對比】
 * Vue Pinia：直接呼叫 store 方法 → store.selectCompany('jype')
 * NgRx：先定義 Action，再由元件 dispatch
 *       → store.dispatch(selectCompany({ companyId: 'jype' }))
 *
 * Action 的命名慣例：
 *   - [來源] 動作描述
 *   - 例如 [Home Page] Select Company
 *   - 這讓你在 DevTools 中追蹤「誰」觸發了「什麼」
 *
 * 非同步操作會有三個 Action：
 *   - loadXxx（觸發）→ loadXxxSuccess（成功）→ loadXxxFailure（失敗）
 *   這個模式叫做 Action Triplet，是 NgRx 的標準做法。
 */
import { createAction, props } from '@ngrx/store';
import { Company, Group, Member } from './kpop.models';

export const KpopActions = {
  // 初始化：載入所有靜態資料
  loadAllData: createAction('[App Init] Load All Kpop Data'),
  loadAllDataSuccess: createAction(
    '[Kpop API] Load All Data Success',
    props<{ companies: Company[]; groups: Group[]; members: Member[] }>()
  ),

  // 使用者選擇公司（首頁篩選器）
  selectCompany: createAction(
    '[Home Page] Select Company',
    props<{ companyId: string }>()
  ),

  // 載入團體詳情
  loadGroupDetail: createAction(
    '[Group Page] Load Group Detail',
    props<{ groupId: string }>()
  ),
  loadGroupDetailSuccess: createAction(
    '[Kpop API] Load Group Detail Success',
    props<{ group: Group; members: Member[] }>()
  ),

  // 載入成員詳情
  loadMemberDetail: createAction(
    '[Member Page] Load Member Detail',
    props<{ memberId: string }>()
  ),
  loadMemberDetailSuccess: createAction(
    '[Kpop API] Load Member Detail Success',
    props<{ member: Member; group: Group }>()
  ),
};
```

**Step 3: 建立 Kpop Reducer**

```typescript
/**
 * Kpop Reducer — 狀態如何回應 Action
 *
 * 【Vue 對比】
 * Vue Pinia：store.selectedCompanyId = 'jype'（直接修改）
 * NgRx Reducer：收到 Action 後回傳「全新的」state 物件
 *
 * 核心原則：Reducer 是「純函式」，不能有副作用
 *   - 不能呼叫 API
 *   - 不能修改傳入的 state（immutable）
 *   - 相同輸入永遠回傳相同輸出
 *
 * 為什麼這麼嚴格？因為 NgRx 要靠這個保證：
 *   1. 時間旅行 Debug（DevTools 可以回到任何過去的狀態）
 *   2. OnPush 變更偵測（Angular 只在 reference 改變時更新元件）
 */
import { createReducer, on } from '@ngrx/store';
import { KpopActions } from './kpop.actions';
import { Company, Group, Member } from './kpop.models';

export interface KpopState {
  companies: Company[];
  groups: Group[];
  members: Member[];
  selectedCompanyId: string;
  currentGroup: Group | null;
  currentGroupMembers: Member[];
  currentMember: Member | null;
  currentMemberGroup: Group | null;
}

export const initialKpopState: KpopState = {
  companies: [],
  groups: [],
  members: [],
  selectedCompanyId: 'jype',  // 預設選中 JYP
  currentGroup: null,
  currentGroupMembers: [],
  currentMember: null,
  currentMemberGroup: null,
};

export const kpopReducer = createReducer(
  initialKpopState,

  // 資料載入完成 — 填入所有靜態資料
  on(KpopActions.loadAllDataSuccess, (state, { companies, groups, members }) => ({
    ...state,        // 展開原有 state（immutable 更新）
    companies,
    groups,
    members,
  })),

  // 使用者選擇公司
  on(KpopActions.selectCompany, (state, { companyId }) => ({
    ...state,
    selectedCompanyId: companyId,
  })),

  // 團體詳情載入完成
  on(KpopActions.loadGroupDetailSuccess, (state, { group, members }) => ({
    ...state,
    currentGroup: group,
    currentGroupMembers: members,
  })),

  // 成員詳情載入完成
  on(KpopActions.loadMemberDetailSuccess, (state, { member, group }) => ({
    ...state,
    currentMember: member,
    currentMemberGroup: group,
  })),
);
```

**Step 4: 建立 Kpop Selectors**

```typescript
/**
 * Kpop Selectors — 從 Store 中「衍生」計算結果
 *
 * 【Vue 對比】
 * Vue:     const filteredGroups = computed(() => groups.filter(...))
 * NgRx:    export const selectFilteredGroups = createSelector(...)
 *
 * Selector 有「記憶化（memoization）」功能：
 *   只要輸入的 state 沒變，就不會重新計算。
 *   等同 Vue 的 computed 自動 cache。
 *
 * 使用方式：
 *   在元件中 → this.store.select(selectFilteredGroups)
 *   回傳 Observable<Group[]>，用 async pipe 在模板中訂閱。
 */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KpopState } from './kpop.reducer';

// 取得 kpop 整個 state 切片
const selectKpopState = createFeatureSelector<KpopState>('kpop');

// 基礎 Selectors
export const selectCompanies = createSelector(
  selectKpopState,
  (state) => state.companies
);

export const selectAllGroups = createSelector(
  selectKpopState,
  (state) => state.groups
);

export const selectSelectedCompanyId = createSelector(
  selectKpopState,
  (state) => state.selectedCompanyId
);

// 衍生 Selector：根據選中的公司篩選團體
// 【Vue 對比】computed(() => getGroupsByCompany(selectedCompanyId.value))
export const selectFilteredGroups = createSelector(
  selectAllGroups,
  selectSelectedCompanyId,
  (groups, companyId) => groups.filter(g => g.companyId === companyId)
);

// 團體詳情頁 Selectors
export const selectCurrentGroup = createSelector(
  selectKpopState,
  (state) => state.currentGroup
);

export const selectCurrentGroupMembers = createSelector(
  selectKpopState,
  (state) => state.currentGroupMembers
);

// 成員詳情頁 Selectors
export const selectCurrentMember = createSelector(
  selectKpopState,
  (state) => state.currentMember
);

export const selectCurrentMemberGroup = createSelector(
  selectKpopState,
  (state) => state.currentMemberGroup
);

// 取得特定公司（CompanyFilter 需要）
export const selectSelectedCompany = createSelector(
  selectCompanies,
  selectSelectedCompanyId,
  (companies, id) => companies.find(c => c.id === id) || null
);
```

**Step 5: 建立 Kpop Effects**

```typescript
/**
 * Kpop Effects — 處理非同步副作用
 *
 * 【Vue 對比】
 * Vue Pinia：async function loadData() { const res = await api.get(...) }
 * NgRx Effects：監聽特定 Action → 執行副作用 → dispatch 新 Action
 *
 * 為什麼要把副作用分離出來？
 *   1. Reducer 保持純函式（可測試、可預測）
 *   2. Effect 集中管理所有非同步邏輯
 *   3. 用 RxJS operator 輕鬆處理 debounce、cancel、retry
 *
 * Effect 的運作流程：
 *   元件 dispatch(loadGroupDetail)
 *     → Effect 監聽到 → 呼叫 Service 取資料
 *     → 成功 → dispatch(loadGroupDetailSuccess)
 *     → Reducer 更新 state → Selector 通知元件
 */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { KpopActions } from './kpop.actions';
import { KpopDataService } from '../../core/services/kpop-data.service';

@Injectable()
export class KpopEffects {
  constructor(
    private actions$: Actions,         // 所有 dispatch 的 Action 都會流過這裡
    private kpopData: KpopDataService  // 資料服務（目前是靜態資料，模擬 API）
  ) {}

  /**
   * 載入所有資料
   *
   * 監聽 loadAllData → 從 Service 取得資料 → dispatch loadAllDataSuccess
   *
   * 【RxJS 語法說明】
   *   pipe()：串接多個 operator（像水管一樣依序處理）
   *   ofType()：只處理指定 type 的 Action（過濾器）
   *   switchMap()：取消前一個未完成的請求，只保留最新的（防重複）
   *   map()：轉換資料格式
   */
  loadAllData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadAllData),
      switchMap(() =>
        this.kpopData.getAllData().pipe(
          map(({ companies, groups, members }) =>
            KpopActions.loadAllDataSuccess({ companies, groups, members })
          )
        )
      )
    )
  );

  /** 載入團體詳情 */
  loadGroupDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadGroupDetail),
      switchMap(({ groupId }) =>
        this.kpopData.getGroupWithMembers(groupId).pipe(
          map(({ group, members }) =>
            KpopActions.loadGroupDetailSuccess({ group, members })
          )
        )
      )
    )
  );

  /** 載入成員詳情 */
  loadMemberDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KpopActions.loadMemberDetail),
      switchMap(({ memberId }) =>
        this.kpopData.getMemberWithGroup(memberId).pipe(
          map(({ member, group }) =>
            KpopActions.loadMemberDetailSuccess({ member, group })
          )
        )
      )
    )
  );
}
```

**Step 6: 建立 UI Store**

ui.actions.ts:
```typescript
/**
 * UI Actions — 控制全域 UI 狀態
 *
 * 【Vue 對比】
 * Vue 用 loadingBus（事件匯流排）控制 loading 狀態。
 * NgRx 用 Action dispatch 方式，更容易追蹤和 debug。
 */
import { createAction, props } from '@ngrx/store';

export const UiActions = {
  setLoading: createAction(
    '[UI] Set Loading',
    props<{ isLoading: boolean }>()
  ),
  showError: createAction(
    '[UI] Show Error',
    props<{ message: string }>()
  ),
  clearError: createAction('[UI] Clear Error'),
};
```

ui.reducer.ts:
```typescript
import { createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';

export interface UiState {
  isLoading: boolean;
  errorMessage: string | null;
}

export const initialUiState: UiState = {
  isLoading: false,
  errorMessage: null,
};

export const uiReducer = createReducer(
  initialUiState,
  on(UiActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  })),
  on(UiActions.showError, (state, { message }) => ({
    ...state,
    errorMessage: message,
  })),
  on(UiActions.clearError, (state) => ({
    ...state,
    errorMessage: null,
  })),
);
```

ui.selectors.ts:
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.reducer';

const selectUiState = createFeatureSelector<UiState>('ui');

export const selectIsLoading = createSelector(
  selectUiState,
  (state) => state.isLoading
);

export const selectErrorMessage = createSelector(
  selectUiState,
  (state) => state.errorMessage
);
```

**Step 7: 建立 Theme Store**

theme.actions.ts:
```typescript
/**
 * Theme Actions
 *
 * 【Vue 對比】
 * Vue: themeStore.initTheme() → 直接呼叫 document.documentElement.style.setProperty(...)
 * NgRx: dispatch(applyTheme()) → ThemeEffects 監聽 → 操作 DOM
 *
 * 在 NgRx 的世界裡，操作 DOM 是「副作用」，必須放在 Effect 中處理。
 */
import { createAction } from '@ngrx/store';

export const ThemeActions = {
  applyTheme: createAction('[Theme] Apply Seoul Editorial Theme'),
  themeApplied: createAction('[Theme] Theme Applied Successfully'),
};
```

theme.reducer.ts:
```typescript
import { createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';

export interface ThemeState {
  name: string;
  applied: boolean;
}

export const initialThemeState: ThemeState = {
  name: 'seoul-editorial',
  applied: false,
};

export const themeReducer = createReducer(
  initialThemeState,
  on(ThemeActions.themeApplied, (state) => ({
    ...state,
    applied: true,
  })),
);
```

theme.selectors.ts:
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from './theme.reducer';

const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectThemeName = createSelector(
  selectThemeState,
  (state) => state.name
);

export const selectThemeApplied = createSelector(
  selectThemeState,
  (state) => state.applied
);
```

theme.effects.ts:
```typescript
/**
 * Theme Effects — 將 CSS 變數套用到 DOM
 *
 * 【Vue 對比】
 * Vue: themeStore 的 applyTheme() 直接操作 document.documentElement
 * Angular: ThemeEffects 監聽 applyTheme action → 操作 DOM → dispatch themeApplied
 *
 * 為什麼不在 Component 裡直接操作 DOM？
 *   1. NgRx 的設計哲學：DOM 操作是副作用，應由 Effect 處理
 *   2. 集中管理：所有主題邏輯在一個地方，不散落各處
 *   3. 可測試：可以 mock DOM 操作來測試 Effect
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { ThemeActions } from './theme.actions';

@Injectable()
export class ThemeEffects {
  constructor(
    private actions$: Actions,
    @Inject(DOCUMENT) private document: Document  // Angular 的 DOM 注入方式
  ) {}

  /**
   * 套用 Seoul Editorial 主題
   * 設定 CSS 變數到 <html> 元素，讓所有元件都能透過 var(--xxx) 讀取
   */
  applyTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.applyTheme),
      tap(() => {
        const root = this.document.documentElement;
        // Seoul Editorial 色彩（CSS 變數已在 styles.scss 定義，
        // 這裡額外設定讓 NgRx DevTools 可以追蹤主題套用時機）
        root.style.setProperty('--cream', '#FAF8F3');
        root.style.setProperty('--ink', '#1A1A1A');
        root.style.setProperty('--coral', '#E8614A');
      }),
      map(() => ThemeActions.themeApplied())
    )
  );
}
```

**Step 8: 建立 Store index（統一匯出 reducers）**

```typescript
/**
 * Store 統一匯出
 *
 * 【Vue 對比】
 * Vue Pinia 的每個 store 是獨立的，在元件中直接 import 使用。
 * NgRx 需要在 AppModule 中用 StoreModule.forRoot(reducers)
 * 一次性註冊所有 reducer，這個檔案就是把它們組合在一起。
 */
import { ActionReducerMap } from '@ngrx/store';
import { kpopReducer, KpopState } from './kpop/kpop.reducer';
import { uiReducer, UiState } from './ui/ui.reducer';
import { themeReducer, ThemeState } from './theme/theme.reducer';

/** 整個 App 的 State 型別 */
export interface AppState {
  kpop: KpopState;
  ui: UiState;
  theme: ThemeState;
}

/** 對應 StoreModule.forRoot() 使用 */
export const reducers: ActionReducerMap<AppState> = {
  kpop: kpopReducer,
  ui: uiReducer,
  theme: themeReducer,
};
```

**Step 9: Commit**

```bash
git add apps/angular-app/src/app/store/
git commit -m "feat(angular-app): add NgRx store (kpop, ui, theme) with full Chinese comments"
```

---

## Task 3: Core Module（Service + Interceptor）

**Files:**
- Create: `apps/angular-app/src/app/core/core.module.ts`
- Create: `apps/angular-app/src/app/core/services/kpop-data.service.ts`
- Create: `apps/angular-app/src/app/core/data/kpop.data.ts`
- Create: `apps/angular-app/src/app/core/interceptors/loading.interceptor.ts`

**Step 1: 將 kpop.js 轉為 TypeScript 靜態資料**

建立 `kpop.data.ts`，從 `apps/vue-app/src/data/kpop.js` 移植所有資料，加上型別。資料內容不變，只加上 TypeScript interface 型別。

```typescript
/**
 * K-pop 靜態資料（從 vue-app/src/data/kpop.js 移植）
 *
 * 【Vue 對比】
 * Vue 版直接 export const + 函式（getGroupById 等）。
 * Angular 版把資料存在這裡，查詢邏輯放在 KpopDataService 中，
 * 讓資料來源可被 DI 替換（例如日後改接 API）。
 */
import { Company, Group, Member } from '../../store/kpop/kpop.models';

export const COMPANIES: Company[] = [
  // ... 從 vue-app 完整複製 4 間公司
];

export const GROUPS: Group[] = [
  // ... 從 vue-app 完整複製所有團體（約 20 個）
];

export const MEMBERS: Member[] = [
  // ... 從 vue-app 完整複製所有成員（約 120 個）
];
```

> 實作時從 `apps/vue-app/src/data/kpop.js` 完整複製資料內容，加上 TypeScript 型別。

**Step 2: 建立 KpopDataService**

```typescript
/**
 * KpopDataService — K-pop 資料存取服務
 *
 * 【Vue 對比】
 * Vue 版直接在 kpop.js 匯出 helper 函式：getGroupById(), getMembersByGroup()
 * Angular 版把這些邏輯包在 @Injectable Service 中：
 *   1. 可被 Angular 的 DI 系統管理（單例、可替換、可 mock 測試）
 *   2. 回傳 Observable（即使現在是靜態資料，也模擬 API 的非同步行為）
 *   3. 未來改接真實 API 時，元件程式碼不需要動
 *
 * 這是 Angular 最重要的設計模式之一：Service + DI。
 * 把「資料怎麼來」和「畫面怎麼呈現」徹底分開。
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Company, Group, Member } from '../../store/kpop/kpop.models';
import { COMPANIES, GROUPS, MEMBERS } from '../data/kpop.data';

@Injectable({
  providedIn: 'root'  // 全域單例（不需要在 module 的 providers 中宣告）
})
export class KpopDataService {

  /**
   * 取得所有資料
   * delay(300) 模擬網路延遲，讓 loading 動畫有意義
   */
  getAllData(): Observable<{ companies: Company[]; groups: Group[]; members: Member[] }> {
    return of({
      companies: COMPANIES,
      groups: GROUPS,
      members: MEMBERS,
    }).pipe(delay(300));
  }

  /** 根據公司篩選團體 */
  getGroupsByCompany(companyId: string): Observable<Group[]> {
    return of(GROUPS.filter(g => g.companyId === companyId));
  }

  /** 取得單一團體 + 其成員 */
  getGroupWithMembers(groupId: string): Observable<{ group: Group; members: Member[] }> {
    const group = GROUPS.find(g => g.id === groupId)!;
    const members = MEMBERS.filter(m => m.groupId === groupId);
    return of({ group, members }).pipe(delay(200));
  }

  /** 取得單一成員 + 其所屬團體 */
  getMemberWithGroup(memberId: string): Observable<{ member: Member; group: Group }> {
    const member = MEMBERS.find(m => m.id === memberId)!;
    const group = GROUPS.find(g => g.id === member.groupId)!;
    return of({ member, group }).pipe(delay(200));
  }

  /** 根據公司 ID 取得公司 */
  getCompanyById(companyId: string): Company | undefined {
    return COMPANIES.find(c => c.id === companyId);
  }
}
```

**Step 3: 建立 LoadingInterceptor**

```typescript
/**
 * LoadingInterceptor — 自動追蹤 HTTP 請求的 loading 狀態
 *
 * 【Vue 對比】
 * Vue 版用 loadingBus（手動 push/pop 計數器）掛在 axios interceptor 上。
 * Angular 版用 HTTP_INTERCEPTORS 機制 + NgRx dispatch：
 *   request 發出 → dispatch setLoading(true)
 *   response 收到 → dispatch setLoading(false)
 *
 * Angular 的 HTTP_INTERCEPTORS 是 DI token，
 * 可以同時掛多個 interceptor（像洋蔥一層層包住 request）。
 */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UiActions } from '../../store/ui/ui.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 請求開始 — 計數 +1
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.store.dispatch(UiActions.setLoading({ isLoading: true }));
    }

    return next.handle(req).pipe(
      // finalize：無論成功或失敗都會執行（等同 try-finally）
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.store.dispatch(UiActions.setLoading({ isLoading: false }));
        }
      })
    );
  }
}
```

**Step 4: 建立 CoreModule**

```typescript
/**
 * CoreModule — 核心模組（只在 AppModule 匯入一次）
 *
 * 【Vue 對比】
 * Vue 沒有這個概念。在 Vue 中，全域 service 就是在 main.js 匯入。
 * Angular 用 CoreModule 來集中管理「全域單例」的東西：
 *   - HTTP Interceptors
 *   - 全域 Guards
 *   - 只需要一個實例的 Service
 *
 * 為什麼要分 CoreModule 和 SharedModule？
 *   CoreModule：只 import 一次（放在 AppModule）
 *   SharedModule：可以被多個 Feature Module import
 */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    // 註冊 HTTP Interceptor
    // multi: true 表示可以有多個 interceptor（陣列形式）
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  /**
   * 防止 CoreModule 被重複 import
   *
   * 如果有人不小心在 Feature Module 也 import CoreModule，
   * 這個 constructor 會直接丟出錯誤。
   *
   * @Optional() — 讓第一次 import 時不會報錯（因為 parentModule 是 null）
   * @SkipSelf() — 跳過自己，只找「上層」是否已經有這個 module
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 已經載入，只能在 AppModule 中匯入一次！');
    }
  }
}
```

**Step 5: Commit**

```bash
git add apps/angular-app/src/app/core/
git commit -m "feat(angular-app): add CoreModule with KpopDataService and LoadingInterceptor"
```

---

## Task 4: Shared Module（Header, Footer, LoadingBar, Pipe）

**Files:**
- Create: `apps/angular-app/src/app/shared/shared.module.ts`
- Create: `apps/angular-app/src/app/shared/components/header/header.component.ts`
- Create: `apps/angular-app/src/app/shared/components/header/header.component.html`
- Create: `apps/angular-app/src/app/shared/components/header/header.component.scss`
- Create: `apps/angular-app/src/app/shared/components/footer/footer.component.ts`
- Create: `apps/angular-app/src/app/shared/components/footer/footer.component.html`
- Create: `apps/angular-app/src/app/shared/components/footer/footer.component.scss`
- Create: `apps/angular-app/src/app/shared/components/loading-bar/loading-bar.component.ts`
- Create: `apps/angular-app/src/app/shared/components/loading-bar/loading-bar.component.html`
- Create: `apps/angular-app/src/app/shared/pipes/debut-year.pipe.ts`

**Step 1: 建立 SharedModule**

```typescript
/**
 * SharedModule — 共用元件模組
 *
 * 【Vue 對比】
 * Vue 的共用元件直接 import 就能用（SFC 自帶 template/script/style）。
 * Angular 需要先在 Module 中「宣告」(declarations) 元件，
 * 然後「匯出」(exports) 給其他 Module 使用。
 *
 * SharedModule 的角色：
 *   1. 統一匯出 CommonModule（*ngIf, *ngFor 等基礎指令）
 *   2. 統一匯出 Angular Material 元件（避免每個 Module 重複 import）
 *   3. 宣告 & 匯出共用元件（Header、Footer、LoadingBar）
 *   4. 宣告 & 匯出共用 Pipe
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material 匯入
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

// 共用元件
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';

// 共用 Pipe
import { DebutYearPipe } from './pipes/debut-year.pipe';

// 統一收集所有 Angular Material Module
const MATERIAL_MODULES = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatChipsModule,
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingBarComponent,
    DebutYearPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    // 匯出 Angular 基礎模組（讓 Feature Module 不用再 import）
    CommonModule,
    RouterModule,
    ...MATERIAL_MODULES,

    // 匯出共用元件
    HeaderComponent,
    FooterComponent,
    LoadingBarComponent,
    DebutYearPipe,
  ],
})
export class SharedModule {}
```

**Step 2: 建立 HeaderComponent**

header.component.ts:
```typescript
/**
 * HeaderComponent — 頂部導航列
 *
 * 【Vue 對比】
 * Vue:     <script setup> + useRouter() + useRoute()
 * Angular: @Component class + inject(Router) + inject(Location)
 *
 * Vue 用 computed(() => route.name === 'Home') 判斷是否首頁；
 * Angular 用 Router.events 訂閱路由變更事件。
 */
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * isHome$：Observable<boolean>，當前是否在首頁
   *
   * 【Vue 對比】
   * Vue:     const isHome = computed(() => route.name === 'Home')
   * Angular: 訂閱 Router.events，過濾出 NavigationEnd 事件，檢查 URL
   *
   * 為什麼用 Observable 而不是普通變數？
   *   Angular 的 Router 變化是非同步事件，
   *   用 Observable + async pipe 可以自動管理訂閱/退訂，
   *   避免記憶體洩漏（memory leak）。
   */
  isHome$: Observable<boolean>;

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.isHome$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects === '/'),
      startWith(this.router.url === '/')
    );
  }

  /** 返回上一頁（等同 Vue 的 router.back()） */
  goBack(): void {
    this.location.back();
  }

  /** 前往首頁 */
  goHome(): void {
    this.router.navigate(['/']);
  }
}
```

header.component.html:
```html
<!--
  Header 模板 — Seoul Editorial 風格

  【Vue 對比】
  Vue:     v-if="!isHome" → 條件渲染
  Angular: *ngIf="!(isHome$ | async)" → 需要 async pipe 解包 Observable

  async pipe 是 Angular 處理 Observable 的標準方式：
    1. 自動訂閱 Observable
    2. 取得最新值渲染到模板
    3. 元件銷毀時自動退訂（防止 memory leak）
-->
<header class="header">
  <div class="header-content">
    <!-- 返回按鈕（非首頁時顯示） -->
    <button
      *ngIf="!(isHome$ | async)"
      mat-icon-button
      class="back-button"
      (click)="goBack()">
      <mat-icon>arrow_back_ios</mat-icon>
    </button>

    <!-- Logo -->
    <a class="logo" (click)="goHome()">
      <span class="logo-text font-display">K</span>
      <span class="logo-divider">—</span>
      <span class="logo-text font-display">HUB</span>
    </a>

    <div class="spacer"></div>

    <!-- 裝飾性的小紅點（Seoul Editorial 風格點綴） -->
    <span class="coral-dot"></span>
  </div>
</header>
```

header.component.scss:
```scss
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--card);
  border-bottom: 1px solid var(--border);
}

.header-content {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 var(--space-md);
  max-width: 480px;
  margin: 0 auto;
}

.back-button {
  color: var(--ink-muted);
  margin-right: var(--space-xs);
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: 0.08em;
}

.logo-divider {
  color: var(--coral);
  font-weight: 300;
}

.spacer {
  flex: 1;
}

.coral-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--coral);
}
```

**Step 3: 建立 FooterComponent**

footer.component.ts:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
```

footer.component.html:
```html
<footer class="footer">
  <p class="footer-text">K — HUB · Seoul Editorial</p>
</footer>
```

footer.component.scss:
```scss
.footer {
  text-align: center;
  padding: var(--space-lg) var(--space-md);
  border-top: 1px solid var(--border);
}

.footer-text {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--ink-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

**Step 4: 建立 LoadingBarComponent**

loading-bar.component.ts:
```typescript
/**
 * LoadingBarComponent — 全域 Loading 指示器
 *
 * 【Vue 對比】
 * Vue: <q-linear-progress v-if="isLoading" /> + useApiLoading() composable
 * Angular: <mat-progress-bar *ngIf="isLoading$ | async"> + NgRx selector
 *
 * 差異：
 *   Vue 用 composable（useApiLoading）取得響應式狀態。
 *   Angular 用 store.select(selector) 取得 Observable，
 *   再用 async pipe 在模板中訂閱。
 */
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoading } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
})
export class LoadingBarComponent {
  /**
   * isLoading$：從 NgRx UI Store 取得 loading 狀態
   * 在模板中用 *ngIf="isLoading$ | async" 渲染
   */
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(selectIsLoading);
  }
}
```

loading-bar.component.html:
```html
<!--
  Angular Material Progress Bar
  mode="indeterminate"：不確定進度（持續動畫）
  等同 Vue Quasar 的 <q-linear-progress indeterminate>
-->
<mat-progress-bar
  *ngIf="isLoading$ | async"
  mode="indeterminate"
  class="loading-bar"
  color="warn">
</mat-progress-bar>
```

**Step 5: 建立 DebutYearPipe**

```typescript
/**
 * DebutYearPipe — 從出道日期提取年份
 *
 * 【Vue 對比】
 * Vue 沒有內建 Pipe 概念，通常用 computed 或 helper function。
 * Angular 的 Pipe 是專門用來在模板中「轉換顯示資料」的機制。
 *
 * 使用方式：
 *   {{ group.debut | debutYear }}
 *   '2015-10-20' → '2015'
 *
 * Pipe 的特點：
 *   1. 純函式（Pure Pipe）— 只在輸入改變時重新計算
 *   2. 可在模板中鏈式使用 {{ value | pipe1 | pipe2 }}
 *   3. Angular 內建常用 Pipe：date, currency, uppercase, async...
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'debutYear',
  pure: true  // 預設就是 pure，寫出來是為了教學說明
})
export class DebutYearPipe implements PipeTransform {
  transform(debutDate: string): string {
    if (!debutDate) return '';
    return debutDate.split('-')[0];
  }
}
```

**Step 6: Commit**

```bash
git add apps/angular-app/src/app/shared/
git commit -m "feat(angular-app): add SharedModule with Header, Footer, LoadingBar, DebutYearPipe"
```

---

## Task 5: Home Feature Module

**Files:**
- Create: `apps/angular-app/src/app/features/home/home.module.ts`
- Create: `apps/angular-app/src/app/features/home/home-routing.module.ts`
- Create: `apps/angular-app/src/app/features/home/home.component.ts`
- Create: `apps/angular-app/src/app/features/home/home.component.html`
- Create: `apps/angular-app/src/app/features/home/home.component.scss`
- Create: `apps/angular-app/src/app/features/home/components/carousel/carousel.component.ts`
- Create: `apps/angular-app/src/app/features/home/components/carousel/carousel.component.html`
- Create: `apps/angular-app/src/app/features/home/components/carousel/carousel.component.scss`
- Create: `apps/angular-app/src/app/features/home/components/marquee/marquee.component.ts`
- Create: `apps/angular-app/src/app/features/home/components/marquee/marquee.component.html`
- Create: `apps/angular-app/src/app/features/home/components/marquee/marquee.component.scss`
- Create: `apps/angular-app/src/app/features/home/components/company-filter/company-filter.component.ts`
- Create: `apps/angular-app/src/app/features/home/components/company-filter/company-filter.component.html`
- Create: `apps/angular-app/src/app/features/home/components/company-filter/company-filter.component.scss`
- Create: `apps/angular-app/src/app/features/home/components/group-card/group-card.component.ts`
- Create: `apps/angular-app/src/app/features/home/components/group-card/group-card.component.html`
- Create: `apps/angular-app/src/app/features/home/components/group-card/group-card.component.scss`

**Step 1: 建立 HomeModule + Routing**

home.module.ts — 宣告所有 Home 相關元件
home-routing.module.ts — 路由 `''` → HomeComponent

**Step 2: 建立 HomeComponent**

```typescript
/**
 * HomeComponent — 首頁
 *
 * 【Vue 對比】
 * Vue HomePage.vue 用 <script setup> + computed + ref。
 * Angular 用 class-based component + NgRx Store + Observable。
 *
 * 資料流：
 *   1. ngOnInit → dispatch loadAllData（初始化）
 *   2. store.select(selectCompanies) → 公司列表（Observable）
 *   3. store.select(selectFilteredGroups) → 篩選後的團體（Observable）
 *   4. 使用者點公司 → dispatch selectCompany → Reducer 更新 → Selector 重新計算
 *
 * 在模板中全部用 async pipe 訂閱，
 * 不需要手動 subscribe/unsubscribe。
 */
```

**Step 3: 建立 CarouselComponent**

純 CSS + TypeScript 實作的輪播元件（不依賴第三方套件）。
- `@Input() slides: CarouselSlide[]`
- `setInterval` 自動輪播 + `ngOnDestroy` 清除
- indicator dots + 點擊跳轉
- 圖片有漸層遮罩 + 文字覆蓋

**Step 4: 建立 MarqueeComponent**

純 CSS animation 跑馬燈。
- `@Input() messages: string[]`
- Coral 底色、白色文字
- CSS `@keyframes marquee` 無限循環

**Step 5: 建立 CompanyFilterComponent**

水平可滾動的公司選擇器 chips。
- `@Input() companies, @Input() activeId`
- `@Output() companySelected = new EventEmitter<string>()`
- 選中狀態用 `[ngClass]` 動態切換

**Step 6: 建立 GroupCardComponent**

團體卡片（Seoul Editorial 風格）。
- `@Input() group`
- `@Output() cardClick = new EventEmitter<string>()`
- `aspect-ratio: 3/4`，hover scale + coral 底線

**Step 7: Commit**

```bash
git add apps/angular-app/src/app/features/home/
git commit -m "feat(angular-app): add Home feature with Carousel, Marquee, CompanyFilter, GroupCard"
```

---

## Task 6: Group Feature Module

**Files:**
- Create: `apps/angular-app/src/app/features/group/group.module.ts`
- Create: `apps/angular-app/src/app/features/group/group-routing.module.ts`
- Create: `apps/angular-app/src/app/features/group/group-detail/group-detail.component.ts`
- Create: `apps/angular-app/src/app/features/group/group-detail/group-detail.component.html`
- Create: `apps/angular-app/src/app/features/group/group-detail/group-detail.component.scss`
- Create: `apps/angular-app/src/app/features/group/components/member-avatar/member-avatar.component.ts`
- Create: `apps/angular-app/src/app/features/group/components/member-avatar/member-avatar.component.html`
- Create: `apps/angular-app/src/app/features/group/components/member-avatar/member-avatar.component.scss`

**Step 1: GroupDetailComponent**

```typescript
/**
 * GroupDetailComponent — 團體詳情頁
 *
 * 【Vue 對比】
 * Vue:     const group = computed(() => getGroupById(route.params.id))
 *          watchEffect(() => { if (!group.value) router.replace('/') })
 * Angular: 從 ActivatedRoute 取得 :id → dispatch loadGroupDetail
 *          用 NgRx selector 取得資料，在模板中用 async pipe 渲染
 *
 * 生命週期：
 *   ngOnInit → 取得路由參數 → dispatch action → Effect 取資料
 *           → Reducer 更新 state → Selector 推送新值 → 模板更新
 */
```

包含：Hero 封面圖、Info Chips（fandom、debut、成員數）、簡介、成員 grid。

**Step 2: MemberAvatarComponent**

小型元件，顯示圓形頭像 + 姓名。
- `@Input() member`
- `@Output() avatarClick = new EventEmitter<string>()`

**Step 3: Commit**

```bash
git add apps/angular-app/src/app/features/group/
git commit -m "feat(angular-app): add Group feature with GroupDetail and MemberAvatar"
```

---

## Task 7: Member Feature Module

**Files:**
- Create: `apps/angular-app/src/app/features/member/member.module.ts`
- Create: `apps/angular-app/src/app/features/member/member-routing.module.ts`
- Create: `apps/angular-app/src/app/features/member/member-detail/member-detail.component.ts`
- Create: `apps/angular-app/src/app/features/member/member-detail/member-detail.component.html`
- Create: `apps/angular-app/src/app/features/member/member-detail/member-detail.component.scss`

**Step 1: MemberDetailComponent**

```typescript
/**
 * MemberDetailComponent — 成員詳情頁
 *
 * 【Vue 對比】
 * Vue MemberPage.vue 的 Angular 對應版本。
 * 結構：Hero 大圖 + 返回團體連結 + 基本資料卡片 + 擔當標籤
 */
```

**Step 2: Commit**

```bash
git add apps/angular-app/src/app/features/member/
git commit -m "feat(angular-app): add Member feature with MemberDetail"
```

---

## Task 8: 複製靜態資源

**Files:**
- Copy: `apps/vue-app/public/images/kpop/` → `apps/angular-app/src/assets/images/kpop/`
- Copy: `apps/vue-app/public/images/home/carousel/` → `apps/angular-app/src/assets/images/home/carousel/`

**Step 1: 複製圖片**

```bash
mkdir -p apps/angular-app/src/assets/images
cp -r apps/vue-app/public/images/kpop apps/angular-app/src/assets/images/
cp -r apps/vue-app/public/images/home apps/angular-app/src/assets/images/
```

**Step 2: 更新 kpop.data.ts 中的圖片路徑**

將所有 `/images/` 改為 `assets/images/`（Angular 的靜態資源路徑）。

**Step 3: Commit**

```bash
git add apps/angular-app/src/assets/
git commit -m "chore(angular-app): copy kpop images from vue-app"
```

---

## Task 9: Dockerfile + nginx + .dockerignore

**Files:**
- Create: `apps/angular-app/Dockerfile.angular-app`
- Create: `apps/angular-app/nginx.conf`
- Create: `apps/angular-app/.dockerignore`

**Step 1: 建立 Dockerfile.angular-app**

```dockerfile
# ============================================
# Angular K-pop Hub — Multi-stage Docker Build
# ============================================
# 設計理念：
#   Stage 1 (builder)：安裝依賴 + 編譯 TypeScript + Angular AOT 編譯
#   Stage 2 (serve)：只複製編譯好的靜態檔案，用 nginx 提供服務
#
# Build Context：monorepo 根目錄
# 使用方式：docker build -f apps/angular-app/Dockerfile.angular-app .
# ============================================

# ---- Stage 1: Builder ----
# 使用 Node 20（LTS）slim 版本，減少映像大小
FROM node:20-slim AS builder

WORKDIR /app

# 先複製 package 檔案（利用 Docker layer cache）
# 只要 package.json 沒變，npm ci 就不用重跑
COPY apps/angular-app/package.json apps/angular-app/package-lock.json* ./

# 安裝依賴（ci = clean install，確保與 lock 檔完全一致）
RUN npm ci

# 複製 Angular 原始碼
COPY apps/angular-app/ ./

# 執行 Angular AOT 編譯（production 模式）
# --configuration production 會啟用：
#   - Tree shaking（移除未使用的程式碼）
#   - AOT 編譯（Ahead-of-Time，預先編譯模板）
#   - Minification（壓縮 JS/CSS）
#   - Output hashing（檔名加 hash，利於快取）
RUN npx ng build --configuration production

# ---- Stage 2: Serve ----
# 使用 nginx alpine（僅 ~5MB），專門提供靜態檔案
FROM nginx:alpine AS serve

# 複製自訂 nginx 設定（含 SPA routing 的 try_files）
COPY apps/angular-app/nginx.conf /etc/nginx/conf.d/default.conf

# 從 builder stage 複製編譯好的靜態檔案
COPY --from=builder /app/dist/angular-app /usr/share/nginx/html

# nginx 預設監聽 80 port
EXPOSE 80

# 啟動 nginx（前景模式，讓 Docker 可以追蹤 process）
CMD ["nginx", "-g", "daemon off;"]
```

**Step 2: 建立 nginx.conf**

```nginx
# SPA Routing 設定
# Angular 使用 client-side routing，所有 /group/xxx、/member/xxx 等路徑
# 都需要由 index.html 處理，而非 nginx 去找對應的檔案。
# try_files 會：
#   1. 先找是否有對應的靜態檔（JS、CSS、圖片）
#   2. 找不到就 fallback 到 /index.html（讓 Angular Router 處理）

server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # 啟用 gzip 壓縮（加速傳輸）
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 靜態資源快取（Angular 的 output hashing 會處理 cache busting）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Step 3: 建立 .dockerignore**

```
node_modules
dist
.angular
*.md
.git
.vscode
.eslintrc.json
```

**Step 4: Commit**

```bash
git add apps/angular-app/Dockerfile.angular-app apps/angular-app/nginx.conf apps/angular-app/.dockerignore
git commit -m "feat(angular-app): add Dockerfile (multi-stage nginx) and nginx.conf for SPA routing"
```

---

## Task 10: 驗證 & 最終調整

**Step 1: 安裝依賴並啟動開發伺服器**

```bash
cd apps/angular-app
npm install
npx ng serve --port 4200
```

**Step 2: 瀏覽器驗證各頁面**

- `/` — 首頁：輪播、跑馬燈、公司篩選、團體 Grid
- `/group/twice` — 團體詳情：封面、Info chips、成員列表
- `/member/nayeon` — 成員詳情：大圖、基本資料、擔當標籤
- 不存在的路徑 → 重導到首頁

**Step 3: 執行 ESLint**

```bash
npx ng lint
```

修復所有 lint 問題。

**Step 4: 最終 Commit**

```bash
git add -A apps/angular-app/
git commit -m "feat(angular-app): complete Angular 13 K-pop Hub with Seoul Editorial design"
```

---

## 完成標準

- [ ] 所有 3 個頁面功能與 vue-app 一致
- [ ] NgRx Store 完整（kpop + ui + theme 三個 feature store）
- [ ] 所有元件、service、store 有詳細中文註解（含 Vue 對比說明）
- [ ] Angular Material 元件正確使用
- [ ] ESLint 通過（@angular-eslint）
- [ ] Dockerfile multi-stage build 可運作
- [ ] Seoul Editorial 視覺風格正確套用
