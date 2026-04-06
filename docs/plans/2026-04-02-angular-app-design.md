# Angular K-pop Hub — 設計文件

**日期**：2026-04-02
**目標**：將 `apps/vue-app`（Vue 3 + Pinia + Quasar）完整改寫為 Angular 13+（NgModule 架構），作為學習用途專案，讓熟悉 Vue 的開發者理解 Angular 慣例寫法。

---

## 1. 視覺規格 — Seoul Editorial

靈感來自 K-pop 實體專輯內頁與韓國時尚雜誌，精緻、藝術感、像拿到一本實體專輯。

### 色彩系統

```scss
--cream:       #FAF8F3;  // 頁面底色
--ink:         #1A1A1A;  // 主文字
--ink-muted:   #6B6760;  // 次要文字
--coral:       #E8614A;  // 品牌強調色
--border:      #E2DDD6;  // 邊框
--card:        #FFFFFF;  // 卡片背景
```

### 字體

- **Display（大標、團體名稱）**：`Cormorant Garamond 700`（Google Fonts，高對比 serif）
- **UI（內文、按鈕、標籤）**：`DM Sans 400/500`（清晰易讀的 geometric sans）

### 視覺語言

- 圖片固定 `aspect-ratio` 裁切，hover 時 `scale(1.05)` 微縮放（200ms ease）
- 卡片無 shadow，以 `1px solid var(--border)` 區隔
- 大量留白，文字與圖片局部交疊（Editorial 感）
- 輪播用 indicator dots + 底部漸層 overlay
- 強調色（coral）只用在 active 狀態、底線、chip 選中

---

## 2. 專案位置與結構

**monorepo 路徑**：`apps/angular-app/`
**package name**：`@interview/angular-app`

```
apps/angular-app/
├── src/
│   ├── app/
│   │   ├── app.module.ts            # 根模組，import 所有 Feature Modules
│   │   ├── app.component.ts/html    # Shell：header + router-outlet + footer
│   │   ├── app-routing.module.ts    # 根路由（lazy load feature modules）
│   │   │
│   │   ├── core/                    # CoreModule（只在 AppModule import 一次）
│   │   │   ├── core.module.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts      # 自動附加 Authorization header
│   │   │   │   └── loading.interceptor.ts  # 攔截 request 控制 loading state
│   │   │   └── services/
│   │   │       └── kpop-data.service.ts    # 靜態 kpop 資料存取（注入 Store）
│   │   │
│   │   ├── shared/                  # SharedModule（可被多個 Feature Module import）
│   │   │   ├── shared.module.ts     # 統一 export Angular Material + CommonModule
│   │   │   ├── components/
│   │   │   │   ├── header/          # AppHeaderComponent
│   │   │   │   ├── footer/          # AppFooterComponent
│   │   │   │   └── loading-bar/     # LoadingBarComponent（連接 ui store）
│   │   │   └── pipes/
│   │   │       └── debut-year.pipe.ts  # 從 debut 日期取出年份（純 Pipe 示範）
│   │   │
│   │   ├── features/
│   │   │   ├── home/                # HomeModule（lazy loaded）
│   │   │   │   ├── home.module.ts
│   │   │   │   ├── home-routing.module.ts
│   │   │   │   ├── home.component.ts/html
│   │   │   │   └── components/
│   │   │   │       ├── carousel/    # CarouselComponent
│   │   │   │       ├── marquee/     # MarqueeComponent
│   │   │   │       ├── company-filter/  # CompanyFilterComponent
│   │   │   │       └── group-card/  # GroupCardComponent
│   │   │   │
│   │   │   ├── group/               # GroupModule（lazy loaded）
│   │   │   │   ├── group.module.ts
│   │   │   │   ├── group-routing.module.ts
│   │   │   │   └── group-detail/    # GroupDetailComponent
│   │   │   │
│   │   │   └── member/              # MemberModule（lazy loaded）
│   │   │       ├── member.module.ts
│   │   │       ├── member-routing.module.ts
│   │   │       └── member-detail/   # MemberDetailComponent
│   │   │
│   │   └── store/                   # NgRx Store
│   │       ├── index.ts             # 統一 export reducers map
│   │       ├── kpop/
│   │       │   ├── kpop.actions.ts
│   │       │   ├── kpop.reducer.ts
│   │       │   ├── kpop.effects.ts
│   │       │   └── kpop.selectors.ts
│   │       ├── ui/
│   │       │   ├── ui.actions.ts
│   │       │   ├── ui.reducer.ts
│   │       │   └── ui.selectors.ts
│   │       └── theme/
│   │           ├── theme.actions.ts
│   │           ├── theme.reducer.ts
│   │           └── theme.selectors.ts
│   │
│   ├── assets/
│   │   └── images/                  # 複製自 vue-app/public/images
│   ├── environments/
│   │   ├── environment.ts           # 開發環境設定
│   │   └── environment.prod.ts      # 生產環境設定
│   └── styles.scss                  # 全域樣式 + CSS 變數 + Google Fonts import
│
├── Dockerfile.angular-app           # Multi-stage build（builder + nginx）
├── .dockerignore
├── nginx.conf                       # SPA routing（try_files）
├── angular.json
├── package.json
├── tsconfig.json
└── .eslintrc.json                   # @angular-eslint 設定
```

---

## 3. 路由設計

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: AppComponent,   // Shell（含 header/footer）
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'group/:id',
        loadChildren: () => import('./features/group/group.module').then(m => m.GroupModule)
      },
      {
        path: 'member/:id',
        loadChildren: () => import('./features/member/member.module').then(m => m.MemberModule)
      },
    ]
  },
  { path: '**', redirectTo: '' }
]
```

**Vue Router vs Angular Router 對比（學習重點）**：
- Vue：`createRouter({ routes })` → Angular：`RouterModule.forRoot(routes)`
- Vue：`<router-view>` → Angular：`<router-outlet>`
- Vue：`useRouter().push(...)` → Angular：`inject(Router).navigate([...])`
- Vue：`useRoute().params.id` → Angular：`inject(ActivatedRoute).snapshot.paramMap.get('id')`

---

## 4. NgRx 狀態架構

### Kpop Store

```typescript
// kpop.actions.ts
export const KpopActions = {
  selectCompany: createAction('[Kpop] Select Company', props<{ companyId: string }>()),
  loadGroupDetail: createAction('[Kpop] Load Group Detail', props<{ groupId: string }>()),
  loadGroupDetailSuccess: createAction('[Kpop] Load Group Detail Success', props<{ group: Group }>()),
  loadMemberDetail: createAction('[Kpop] Load Member Detail', props<{ memberId: string }>()),
  loadMemberDetailSuccess: createAction('[Kpop] Load Member Detail Success', props<{ member: Member }>()),
}

// kpop.reducer.ts（State 結構）
interface KpopState {
  companies: Company[]
  groups: Group[]
  members: Member[]
  selectedCompanyId: string
  currentGroup: Group | null
  currentMember: Member | null
}

// kpop.effects.ts（模擬非同步，方便替換真實 API）
loadGroupDetail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(KpopActions.loadGroupDetail),
    switchMap(({ groupId }) =>
      this.kpopDataService.getGroupById(groupId).pipe(
        map(group => KpopActions.loadGroupDetailSuccess({ group })),
      )
    )
  )
)
```

### UI Store

```typescript
interface UiState {
  isLoading: boolean   // 連接 LoadingInterceptor
  errorMessage: string | null
}
```

### Theme Store

```typescript
interface ThemeState {
  name: 'seoul-editorial'   // 目前只有一個主題，預留擴充空間
  colors: Record<string, string>
}
// ThemeEffects 負責在 applyTheme action 後呼叫 document.documentElement.style.setProperty
```

### Vue Pinia vs NgRx 完整對比（教學用）

| 概念 | Vue（Pinia） | Angular（NgRx） |
|------|------------|----------------|
| 定義 Store | `defineStore('id', () => {...})` | `createReducer(initialState, on(...))` |
| 讀取狀態 | `store.xxx` / `storeToRefs(store)` | `store.select(selectXxx)` → Observable |
| 修改狀態 | `store.xxx = value`（直接） | `store.dispatch(action({payload}))` |
| 衍生狀態 | `computed(() => ...)` | `createSelector(selectA, (a) => ...)` |
| 非同步邏輯 | `async function` in store | `createEffect()` + RxJS operators |
| 組件訂閱 | `const { x } = storeToRefs(store)` | `x$ = store.select(selectX)` → `async pipe` |

---

## 5. HTTP Client 架構

### Vue（Axios）→ Angular（HttpClient）對比

| 概念 | Vue | Angular |
|------|-----|---------|
| 建立 client | `createHttpClient({...})` | `inject(HttpClient)` |
| 攔截器 | `axios.interceptors` | `HTTP_INTERCEPTORS` token（`@Injectable`） |
| Loading 控制 | `loadingBus.push/pop` | `LoadingInterceptor` dispatch NgRx action |
| Token 附加 | interceptor 讀 localStorage | `AuthInterceptor` 讀 store 或 localStorage |
| Response 解包 | 自定義 responseFormat | `map(res => res.data)` 在 Service 層 |

### Services 結構

```typescript
// core/services/kpop-data.service.ts
// 包裝靜態資料，回傳 Observable（模擬真實 API 的 async 行為）
getGroupById(id: string): Observable<Group> {
  return of(groups.find(g => g.id === id)).pipe(
    delay(200),  // 模擬網路延遲，讓 loading state 有意義
    filter(Boolean),
  )
}
```

---

## 6. 元件設計規格

### CarouselComponent（自製，不依賴 Material）
- 純 CSS + Angular `@HostListener` 處理 swipe
- `@Input() slides: Slide[]`
- 內建 auto-advance（`setInterval`，`OnDestroy` 清除）
- indicator dots 點擊跳轉

### MarqueeComponent
- 純 CSS `animation: marquee linear infinite`
- `@Input() messages: string[]`
- Coral 底色 `#E8614A`，白色文字

### CompanyFilterComponent
- `@Input() companies: Company[]`
- `@Output() companySelected = new EventEmitter<string>()`
- 水平 scrollable chips（`overflow-x: auto; scrollbar-width: none`）
- 選中：coral 底色 + 白字；未選：border + ink-muted 文字

### GroupCardComponent
- `@Input() group: Group`
- `@Output() cardClick = new EventEmitter<string>()`
- `aspect-ratio: 3/4`，hover scale(1.05) + coral 底線滑入
- 圖片下方白底：Cormorant 大標（group.name）+ DM Sans 小字（debut 年份）

---

## 7. ESLint 設定

使用 `@angular-eslint` 官方規則集：

```json
// .eslintrc.json
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

---

## 8. Dockerfile 設計

**Multi-stage build，monorepo 根目錄為 build context**

```
Stage 1 (builder): node:20-slim
  - COPY 整個 monorepo root
  - npm ci（只安裝 angular-app 依賴）
  - ng build --configuration production → dist/

Stage 2 (serve): nginx:alpine
  - COPY --from=builder dist/angular-app/browser /usr/share/nginx/html
  - COPY nginx.conf（含 SPA try_files）
  - EXPOSE 80
```

**nginx.conf 關鍵設定（SPA routing）**：
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 9. 學習重點摘要（Vue → Angular 差異）

| 面向 | Vue 3 | Angular 13+ |
|------|-------|------------|
| 組件寫法 | `<script setup>` SFC | `@Component` decorator + class |
| 模板語法 | `v-if / v-for / v-model` | `*ngIf / *ngFor / [(ngModel)]` |
| Props | `defineProps({...})` | `@Input() propName: Type` |
| Events | `defineEmits([...])` + `emit(...)` | `@Output() name = new EventEmitter()` |
| 生命週期 | `onMounted / onUnmounted` | `ngOnInit / ngOnDestroy`（interface） |
| 狀態管理 | Pinia（直接修改） | NgRx（immutable，Action → Reducer） |
| 依賴注入 | `inject(...)` composable | `@Injectable` + `inject()` / constructor |
| 路由 | `useRouter / useRoute` | `Router / ActivatedRoute` service |
| HTTP | Axios instance | `HttpClient`（回傳 Observable） |
| 模板中 async | `computed` 自動同步 | `async pipe`（`observable$ \| async`） |
