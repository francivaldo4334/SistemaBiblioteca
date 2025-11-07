<script setup lang="ts">
import BaseCrud from '@/components/BaseCrud.vue'
import {getLivrosRegistrados} from "@/api/acervo_de_livros"

interface Livro {
  id: number
  titulo: string
  autor: string
  ano: number
}

const livros: Livro[] = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 },
  { id: 2, titulo: 'O Alienista', autor: 'Machado de Assis', ano: 1882 },
]

const fetchLivros = async () => {
  // await new Promise(r => setTimeout(r, 400))
  return await getLivrosRegistrados()
}

const mapLivroToRow = (livro: Livro) => [livro.titulo, livro.autor, livro.ano]

const headers = ['Título', 'Autor', 'Ano']
const permissions = ['create', 'update', 'delete'] as const
</script>
<template>
<BaseCrud
    :headers="headers"
    :fetch-items="fetchLivros"
    :map-item-to-row="mapLivroToRow"
    :permissions="permissions"
  >
    <!-- Formulário de criação -->
    <template #create-form>
      <form class="form-control gap-2">
        <input type="text" placeholder="Título" class="input input-bordered" />
        <input type="text" placeholder="Autor" class="input input-bordered" />
        <input type="number" placeholder="Ano" class="input input-bordered" />
        <button class="btn btn-primary mt-2">Salvar</button>
      </form>
    </template>

    <!-- Formulário de atualização -->
    <template #update-form="{ item }">
      <form class="form-control gap-2">
        <input type="text" :value="item?.titulo" class="input input-bordered" />
        <input type="text" :value="item?.autor" class="input input-bordered" />
        <input type="number" :value="item?.ano" class="input input-bordered" />
        <button class="btn btn-primary mt-2">Atualizar</button>
      </form>
    </template>
  </BaseCrud>
</template>
