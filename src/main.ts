import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './routes'
import axios, {AxiosStatic} from 'axios'

//create app
const app = createApp(App);
// add routes
app.use(router);
// add $axios command globally
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosStatic
    }
}
app.config.globalProperties.$axios = axios;
// mount app to index.html
app.mount('#app');
