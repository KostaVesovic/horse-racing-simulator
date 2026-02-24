import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import GamePage from '../pages/GamePage.vue'
import ResultsPage from '../pages/ResultsPage.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage
  },
  {
    path: '/results',
    name: 'results',
    component: ResultsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
