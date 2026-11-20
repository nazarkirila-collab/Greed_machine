import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupInterceptors } from './api/interceptors'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
setupInterceptors()
app.mount('#app')
