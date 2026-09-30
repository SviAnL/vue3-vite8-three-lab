import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomeIndex',
    component: () => import('@/pages/Home/HomeIndex.vue'),
    meta: { titleKey: 'home.title', transition: 'zoom' },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/pages/Error/500.vue'),
    meta: { titleKey: 'error.serverError', transition: 'zoom', noKeepAlive: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/Error/404.vue'),
    meta: { titleKey: 'error.notFound', transition: 'zoom', noKeepAlive: true },
  },
]
