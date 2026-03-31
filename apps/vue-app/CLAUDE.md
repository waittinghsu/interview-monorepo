# vue-app 開發規範

Vue 3 + Vite SPA，語言為 **JavaScript**（非 TypeScript）。
Port：9527 | Zeabur 觸發分支：`main`

## 目錄結構

```
src/
├── pages/              # 頁面元件（對應 router）
├── components/common/  # 共用元件
├── stores/             # Pinia stores（.js）
├── composables/        # 可重用邏輯
├── api/
│   ├── index.js        # httpClient 實例、callbacks 配置
│   ├── loading.js      # loadingBus（純 JS）
│   └── services/       # API services（本地定義，不在 shared-api）
│       ├── user.js     # createUserService
│       └── stock.js    # createStockService
└── router/index.js     # 路由設定
```

## 新增頁面步驟

1. 建立 `src/pages/XxxPage.vue`
2. 在 `src/router/index.js` 加入路由（lazy import）
3. 在 `src/pages/HomePage.vue` 的 `actionButtons` 和 `gridItems` 加入入口

## 語言：JavaScript（非 TypeScript）

```vue
<script setup>
// 使用 auto-import：ref, computed, onMounted, useRouter, useRoute
// Pinia stores：useThemeStore, useUserStore
const router = useRouter()
</script>
```

## 樣式規則

- 使用 UnoCSS utility class，不要寫 scoped CSS（除非動畫）
- 顏色一律用設計 token class（見根目錄 CLAUDE.md）
- 捲軸隱藏：`scrollbar-hide`（presetUno 內建）
- Quasar 元件搭配設計 token：`q-menu` 加 `class="bg-sys-card"`

### 漸層按鈕 Shortcut

```html
<q-btn unelevated class="btn-gradient-primary" />   <!-- action → secondary，主色漸層 -->
<q-btn unelevated class="btn-gradient-success" />   <!-- successLight → successDark -->
<q-btn unelevated class="btn-gradient-warning" />   <!-- warningLight → warningDark -->
<q-btn unelevated class="btn-gradient-error" />     <!-- errorLight → errorDark -->
<q-btn unelevated class="btn-gradient-info" />      <!-- infoLight → infoDark -->
```

## API 調用規則

**攔截器會自動解包 `response.data`**，不要多加一層 `.data`：

```javascript
// ❌ 錯誤
const response = await userApi.login(credentials)
const token = response.data.token  // undefined！

// ✅ 正確
const response = await userApi.login(credentials)
const token = response.token  // ✓
```

**Business Response Format（httpClient）**：
```javascript
// 後端回傳：{ code: '200', msg: 'OK', data: { token, user } }
// 攔截器解包後直接得到 data 內容
const data = await userApi.login(credentials)
```

**外部 API（externalHttpClient）**：
```javascript
// 不解包，直接存取完整回應
const response = await stockApi.get0050(params)
const result = response.chart.result[0]
```

**Per-request 選項**：
```javascript
await userApi.login(credentials, {
  skipLoading: true,   // 不顯示 loading bar
  silentError: true,   // 錯誤不觸發 callback
  rawResponse: true,   // 回傳完整 { code, msg, data }
})
```

## ESLint

- `no-console`：**警告**（允許但會提示）
- 自動修復：`cd apps/vue-app && npx eslint --fix src/`

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| Service ID | `698d9d03eceac33904f65b78` |
| 觸發分支 | `main` |
| ZBPACK_ROOT_DIRECTORY | `apps/vue-app` |
| 類型 | 靜態網站（Caddy） |
| zbpack 設定 | `apps/vue-app/zbpack.json` |
