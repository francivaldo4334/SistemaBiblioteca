import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', () => {
  const search = ref("")
  const period = ref<"W" | "D" | "Y" | "M">()
  return {
    search,
    "update:search"(v: string) {
      search.value = v
    },
    period,
    "update:period"(v: typeof period.value) {
      period.value = v
    }
  }
})
