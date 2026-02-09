import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Quasar 樣式
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// UnoCSS
import 'virtual:uno.css'

// CSS 變數宣告（供 IDE 識別）
import './assets/css/variables.css'

async function bootstrap() {
  // 開發環境啟用 MSW
  if (import.meta.env.DEV) {
    const { worker } = await import('@interview/shared-mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(Quasar, {
    plugins: {},
  })

  app.mount('#app')
}

bootstrap()
