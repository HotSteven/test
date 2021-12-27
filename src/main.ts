import { createApp } from 'vue'
import { Vue } from 'vue-class-component'
import VueRouter from 'vue-router'
import App from './App.vue'
import './assets/tailwind.css'
import router from './routes'

createApp(App).use(router).mount('#app')
