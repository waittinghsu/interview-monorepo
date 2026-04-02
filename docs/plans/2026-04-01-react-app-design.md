# react-app 設計文件

**日期**：2026-04-01
**任務**：將 vue-app 改寫為 React 最新版本，作為學習用途專案
**目標讀者**：熟悉 Vue 3 的開發者，透過本專案學習 React 慣例

---

## 1. 專案定位

- **用途**：學習型專案，重點在「Vue → React 概念對比」
- **功能**：K-Pop Hub — 展示四大娛樂公司旗下的 K-pop 團體與成員
- **資料**：靜態資料（kpop.js 直接沿用），無後端 API 依賴
- **部署**：Zeabur，monorepo 架構，multi-stage Dockerfile

---

## 2. 技術棧

| 項目 | 選擇 | Vue 對應 | 說明 |
|------|------|---------|------|
| 框架 | React 19 | Vue 3 | Concurrent Features、Server Components（未啟用） |
| 建置 | Vite 6 | Vite | 幾乎相同配置 |
| 路由 | React Router v7 | Vue Router v4 | `<Outlet>` = `<RouterView>` |
| 狀態管理 | Redux Toolkit (RTK) | Pinia | Slice = Store；dispatch = 直接賦值 |
| 樣式 | Tailwind CSS v4 | UnoCSS | class 寫法極為相似 |
| 動畫 | Framer Motion | CSS transition | 頁面切換 + hover 效果 |
| HTTP | Axios | Axios | 相同，沿用攔截器模式 |
| 語言 | JavaScript (ESM) | JavaScript | 不用 TypeScript，降低學習門檻 |

---

## 3. 美學方向：Midnight Seoul

### 設計靈感
Apple Music × Melon（韓國串流）× 韓流時尚雜誌

### 色彩系統

```css
/* CSS Variables — 在 index.css 定義 */
--bg-base: #0d0d12;          /* 主背景，深邃暖黑 */
--bg-card: #16161f;          /* 卡片背景 */
--bg-raised: #1e1e2e;        /* 浮起元素 */
--color-primary: #FF6B8A;    /* 玫瑰珊瑚（主色） */
--color-secondary: #A78BFA;  /* 柔紫（輔色） */
--text-base: #F0EEF8;        /* 主要文字，暖白 */
--text-muted: #8B8AA8;       /* 次要文字 */
--border: rgba(255,255,255,0.06); /* 極細玻璃感邊框 */
```

### 字型
- **大標題**：`Bebas Neue`（Google Fonts，韓流海報感）
- **內文**：`Plus Jakarta Sans`（Google Fonts，現代乾淨）

### 視覺特效
- 卡片：glassmorphism（`backdrop-filter: blur`）+ 微光邊框
- 底圖：1% 透明度 noise texture 增加質感
- 動畫：Framer Motion — 頁面切換 fade+slide，卡片 hover scale
- 成員頭像：彩色光暈 border（group color glow）

---

## 4. 目錄結構

```
apps/react-app/
├── src/
│   ├── main.jsx                   # 入口：掛載 React、Redux Provider、Router
│   ├── App.jsx                    # 根元件：RouterProvider
│   ├── router/
│   │   └── index.jsx              # createBrowserRouter（對應 createRouter）
│   ├── store/
│   │   ├── index.js               # configureStore（對應 createPinia）
│   │   └── themeSlice.js          # theme slice（對應 stores/theme.js）
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── GroupPage.jsx
│   │   ├── MemberPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DefaultLayout.jsx  # <Outlet> = <RouterView>
│   │   │   ├── AppHeader.jsx
│   │   │   └── AppFooter.jsx
│   │   ├── home/
│   │   │   ├── CarouselBanner.jsx
│   │   │   ├── CompanySlider.jsx
│   │   │   └── MarqueeBanner.jsx
│   │   ├── group/
│   │   │   └── GroupCard.jsx
│   │   └── member/
│   │       └── MemberCard.jsx
│   ├── hooks/
│   │   └── useApiLoading.js       # 對應 composables/useApiLoading.js
│   ├── api/
│   │   ├── index.js               # httpClient 配置
│   │   ├── loading.js             # loadingBus（純 JS，直接沿用）
│   │   └── services/
│   │       └── stock.js
│   ├── data/
│   │   └── kpop.js                # 靜態資料，直接沿用
│   └── styles/
│       └── index.css              # Tailwind + CSS 變數 + 字型 import
├── Dockerfile                     # multi-stage build
├── nginx.conf                     # SPA routing 設定
├── .dockerignore
├── index.html
├── vite.config.js
├── package.json
└── eslint.config.js
```

---

## 5. 核心概念對比（Vue → React）

### 5.1 狀態管理：Pinia → RTK

```javascript
// Vue：Pinia（直接 mutation）
export const useThemeStore = defineStore('theme', () => {
  const initialized = ref(false)
  function initTheme() { initialized.value = true }
  return { initialized, initTheme }
})

// React：RTK（透過 reducer 描述狀態變化）
// 重點：RTK 的 createSlice 自動產生 action creators
const themeSlice = createSlice({
  name: 'theme',
  initialState: { initialized: false },
  reducers: {
    initTheme: (state) => { state.initialized = true }
    // Immer 讓你可以「直接 mutate」，底層自動產生 immutable 更新
  }
})
// 使用：dispatch(themeSlice.actions.initTheme())
// 讀取：useSelector((state) => state.theme.initialized)
```

### 5.2 響應式：ref/computed → useState/useMemo

```javascript
// Vue
const selectedCompanyId = ref(companies[0].id)
const displayedGroups = computed(() => getGroupsByCompany(selectedCompanyId.value))

// React：state 改變 → 元件 re-render → useMemo 緩存計算結果
const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id)
const displayedGroups = useMemo(
  () => getGroupsByCompany(selectedCompanyId),
  [selectedCompanyId]  // dependencies：這些值變化才重算
)
```

### 5.3 Lifecycle：onMounted/onUnmounted → useEffect

```javascript
// Vue：獨立 hooks
onMounted(() => { startTimer() })
onUnmounted(() => { clearTimer() })

// React：useEffect 合併副作用與清理
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // return 的函數 = onUnmounted
}, [])  // [] = 只在 mount 執行一次（= onMounted）
```

### 5.4 模板語法：Vue template → JSX

```jsx
// Vue template
<div v-for="item in list" :key="item.id" @click="handleClick">
  {{ item.name }}
</div>

// React JSX（JavaScript 本身，沒有特殊指令）
{list.map((item) => (
  <div key={item.id} onClick={handleClick}>
    {item.name}
  </div>
))}
```

### 5.5 Props：defineProps → 函數參數解構

```javascript
// Vue
const props = defineProps({ group: Object, clickable: Boolean })

// React：props 就是函數的第一個參數，通常直接解構
function GroupCard({ group, clickable = false }) { ... }
```

### 5.6 Emit：defineEmits → callback props

```javascript
// Vue
const emit = defineEmits(['click'])
emit('click', group.id)

// React：沒有 emit 系統，直接傳函數作為 prop（更直接）
function GroupCard({ group, onClick }) {
  return <div onClick={() => onClick(group.id)}>...</div>
}
// 父層：<GroupCard onClick={(id) => navigate(`/group/${id}`)} />
```

---

## 6. Dockerfile 設計

### 策略
- **build context**：monorepo 根目錄（Zeabur 預設）
- **依賴安裝**：`pnpm --filter` 只裝 react-app 及 workspace 依賴
- **Serve**：nginx:alpine，靜態檔案服務

```dockerfile
# Stage 1: Builder
FROM node:22-slim AS builder
# ... pnpm install --filter=@interview/react-app...
# ... pnpm --filter=@interview/react-app build

# Stage 2: nginx serve
FROM nginx:alpine
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html
COPY apps/react-app/nginx.conf /etc/nginx/conf.d/default.conf
# nginx.conf 重點：try_files $uri /index.html（SPA routing）
```

---

## 7. ESLint 配置

使用 `eslint-plugin-react` + `eslint-plugin-react-hooks`：
- `react-hooks/rules-of-hooks`：強制 hooks 規則（只能在頂層呼叫）
- `react-hooks/exhaustive-deps`：警告 useEffect dependencies 遺漏
- `no-console`：警告（和 vue-app 一致）

---

## 8. monorepo 整合

- `package.json` name：`@interview/react-app`
- `pnpm-workspace.yaml` 已包含 `apps/*`，無需修改
- `turbo.json` 如有 pipeline 定義需新增 react-app 的 build/dev 腳本
- Port：`5173`（Vite 預設，避免和 vue-app 9527 衝突）
