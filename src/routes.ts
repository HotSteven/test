import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Axios from '@/views/Axios.vue'
import Tools from '@/views/Tools.vue'
import WebRTC from '@/views/WebRTC.vue'
import NotFound from '@/views/404.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  // { // route level code-splitting: generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/axios',
    name: 'Axios',
    component: Axios
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools
  },
  {
    path: '/webrtc',
    name: 'WebRTC',
    component: WebRTC
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
