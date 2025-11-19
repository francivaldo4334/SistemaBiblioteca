import AppView from '@/views/AppView'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "app" }
    },
    {
      path: "/login",
      component: () => import("@/views/LoginView"),
      name: "login",
    },
    {
      path: "/app/",
      component: AppView,
      name: "app",
      redirect: { name: "home" },
      children: [
        {
          path: "/home",
          component: import("@/views/LibraryView"),
          name: "home",
        },
        {
          path: "/library",
          component: import('@/views/BooksView'),
          name: "library",
        },
        {
          path: "/students",
          component: import('@/views/StudentsView'),
          name: "students",
        },
        {
          path: "/loans",
          component: import('@/views/LoansView'),
          name: "loans",
        },
      ]
    },
  ],
})

export default router
