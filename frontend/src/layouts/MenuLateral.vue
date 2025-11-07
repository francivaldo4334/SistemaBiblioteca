<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { name: 'Livros registrados', path: '/livros', icon: '' },
  { name: 'Tipos de livros', path: '/tipos', icon: '' },
  { name: 'Alunos registrados', path: '/alunos', icon: '' },
  { name: 'Empréstimos de livros', path: '/emprestimos', icon: '' },
]

const isActive = (path: string) => route.path === path

const navigate = (path: string) => {
  if (!isActive(path)) router.push(path)
}
</script>

<template>
  <div class="drawer lg:drawer-open h-screen">
    <input id="sidebar" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <label for="sidebar" class="btn btn-primary drawer-button btn-square lg:hidden m-4">☰</label>
      <main class="flex-1 bg-base-200 overflow-auto">
        <router-view />
      </main>
    </div>

    <div class="drawer-side">
      <label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
      <aside class="menu w-full w-72 min-h-full bg-base-100 text-base-content">
        <h2 class="text-xl font-bold text-center"> Biblioteca</h2>
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.path" class="mb-1">
            <button
              class="menu-item text-lg"
              :class="isActive(item.path) ? 'menu-active' : ''"
              :disabled="isActive(item.path)"
              @click="navigate(item.path)"
            >
              <span class="mr-2">{{ item.icon }}</span>
              {{ item.name }}
            </button>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
