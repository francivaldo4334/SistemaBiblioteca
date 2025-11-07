import { createRouter, createWebHistory } from 'vue-router'

import MenuLateral from "@/layouts/MenuLateral.vue"
import LivrosView from "@/views/LivrosView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MenuLateral,
      children: [
        { path: '', redirect: '/livros' },
        { path: '/livros', name: 'Livros', component: LivrosView },
        // { path: '/tipos', name: 'Tipos de Livros', component: BookTypesView },
        // { path: '/alunos', name: 'Alunos', component: StudentsView },
        // { path: '/emprestimos', name: 'Empréstimos', component: LoansView },
      ],
    },
  ],
})

export default router
