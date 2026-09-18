import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './app/styles/index.css'
import { createBootstrap } from 'bootstrap-vue-next'

createApp(App).use(createPinia()).use(router).use(createBootstrap()).mount('#app')
