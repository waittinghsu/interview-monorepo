import { createPinia } from 'pinia'
import { Dark, Quasar } from 'quasar'
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

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Dark,
  },
})

Dark.set(true)

app.mount('#app')
