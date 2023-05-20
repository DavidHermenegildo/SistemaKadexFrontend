import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Inicio from '../components/HelloWorld.vue'
import Ejemplo from '../components/Ejemplo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio
  },
  {
    path: '/ejemplo',
    name: 'ejemplo',
    component: Ejemplo
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
