import { createRouter, createWebHistory } from 'vue-router'
import { isTokenExpired } from '@/app/lib/token-guard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/catalog/CatalogPage.vue') },
    {
      path: '/books/new',
      component: () => import('@/pages/book-edit/BookEditPage.vue'),
      meta: { auth: true },
    },
    { path: '/books/:id', component: () => import('@/pages/book-details/BookDetailsPage.vue') },
    {
      path: '/books/:id/edit',
      component: () => import('@/pages/book-edit/BookEditPage.vue'),
      meta: { auth: true },
    },
    { path: '/authors', component: () => import('@/pages/authors/AuthorsPage.vue') },
    {
      path: '/authors/:id',
      component: () => import('@/pages/author-details/AuthorDetailsPage.vue'),
    },
    { path: '/reports/top-authors', component: () => import('@/pages/reports/ReportsPage.vue') },
    { path: '/login', component: () => import('@/pages/login/LoginPage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.auth && isTokenExpired())
    return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
