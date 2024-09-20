import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import Desc from '../views/desc.vue'
import Score from '../views/score.vue'
import Mall from '../views/mall.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/desc',
    name: 'desc',
    component: Desc
  },
  {
    path: '/score-history',
    name: 'Score',
    component: Score,
  },
  {
    path: '/mall',
    name: 'Mall',
    component: Mall
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
