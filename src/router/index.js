import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Inicio from '../components/HelloWorld.vue'
import Ejemplo from '../components/Ejemplo.vue'
import Clientes from '../components/Clientes.vue'
import Producto from '../components/Producto.vue'
import Proveedores from '../components/Proveedores.vue'
import Ventas from '../components/Ventas.vue'

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
    path: '/clientes',
    name: 'clientes',
    component: Clientes
  },
  {
    path: '/producto',
    name: 'Producto',
    component: Producto
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: Proveedores
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: Ventas
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
