import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login')
  },
  {
    path: '/',
    component: () => import('../views/layout'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('../views/article/')
      },
      {
        path: '/publish/',
        name: 'publish',
        component: () => import('../views/publish/')
      },
      {
        path: '/images',
        name: 'images',
        component: () => import('../views/images/')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('../views/comment/')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/setting/')
      },
      {
        path: '/fans',
        name: 'fans',
        component: () => import('../views/fans/')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
