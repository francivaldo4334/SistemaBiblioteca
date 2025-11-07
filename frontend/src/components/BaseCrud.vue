<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props<T> {
  headers: string[]
  fetchItems: () => Promise<T[]>
  mapItemToRow: (item: T) => (string | number)[]
  permissions: ('create' | 'update' | 'delete')[]
}

const props = defineProps<Props<any>>()

const items = ref<any[]>([])
const loading = ref(false)
const selectedItem = ref<any | null>(null)
const createModal = ref(false)
const updateModal = ref(false)

const loadItems = async () => {
  loading.value = true
  try {
    items.value = await props.fetchItems()
  } finally {
    loading.value = false
  }
}

onMounted(loadItems)

const canCreate = computed(() => props.permissions.includes('create'))
const canUpdate = computed(() => props.permissions.includes('update'))
const canDelete = computed(() => props.permissions.includes('delete'))

const openCreate = () => (createModal.value = true)
const openUpdate = (item: any) => {
  selectedItem.value = item
  updateModal.value = true
}
const deleteItem = (item: any) => {
  if (confirm('Tem certeza que deseja deletar este item?')) {
    console.log('Excluir item', item)
  }
}
</script>

<template>
  <div class="p-4 bg-base-200 rounded-lg shadow-md">

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Listagem</h2>
      <button
        v-if="canCreate"
        class="btn btn-primary"
        @click="openCreate"
      >
        ➕ Criar novo
      </button>
    </div>

    <div class="overflow-x-auto bg-base-100 rounded-lg">
      <table class="table w-full">
        <thead>
          <tr>
            <th v-for="header in props.headers" :key="header">{{ header }}</th>
            <th v-if="canUpdate || canDelete" class="text-center">Ações</th>
          </tr>
        </thead>

        <tbody v-if="!loading && items.length">
          <tr v-for="item in items" :key="item.id">
            <td v-for="cell in props.mapItemToRow(item)" :key="cell">{{ cell }}</td>

            <td v-if="canUpdate || canDelete" class="flex gap-2 justify-center">
              <button
                v-if="canUpdate"
                class="btn btn-sm btn-warning"
                @click="openUpdate(item)"
              >
                ✏️
              </button>
              <button
                v-if="canDelete"
                class="btn btn-sm btn-error"
                @click="deleteItem(item)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="!loading && !items.length">
          <tr><td :colspan="headers.length + 1" class="text-center py-4">Nenhum registro encontrado</td></tr>
        </tbody>

        <tbody v-else>
          <tr><td :colspan="headers.length + 1" class="text-center py-4">Carregando...</td></tr>
        </tbody>
      </table>
    </div>

    <dialog v-if="createModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Criar item</h3>
        <slot name="create-form" />
        <div class="modal-action">
          <button class="btn" @click="createModal = false">Fechar</button>
        </div>
      </div>
    </dialog>

    <dialog v-if="updateModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Editar item</h3>
        <slot name="update-form" :item="selectedItem" />
        <div class="modal-action">
          <button class="btn" @click="updateModal = false">Fechar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
