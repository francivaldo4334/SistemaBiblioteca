import { Search } from "lucide-vue-next";
import { computed, defineComponent, ref } from "vue";
import LibraryMetricsView from "./LibraryMetricsView";
import LibraryBooksView from "./LibraryBooksView";
import { useLibraryStore } from "@/stores/useLibraryStore";

export default defineComponent({
  setup() {
    const store = useLibraryStore()
    const search = computed({
      get: () => store.search,
      set: (v) => store["update:search"](v)
    })
    const inputSearch = ref("")
    return { search, inputSearch }
  },
  methods: {
    onSearch() {
      this.search = this.inputSearch
    }
  },
  render() {
    return (
      <div class="h-screen w-full grid grid-rows-[auto_1fr] overflow-x-hidden">
        <div class="p-4 flex gap-3">
          <div>
            <h1 class="text-lg font-bold">Acervo de Livros</h1>
            <p class="text-sm text-base-content/70">
              Encontre rapidamente um livro ou explore informações sobre o acervo.
            </p>
          </div>
          <div class="flex-1" />
          <fieldset class="input flex items-center gap-2">
            <Search />
            <input
              type="search"
              placeholder="Buscar título, autor, isbn ou categoria..."
              class="w-full"
              v-model={this.inputSearch}
              onKeypress={e => {
                if (e.key === "Enter") {
                  this.onSearch()
                }
              }}
            />
            <kbd class="kbd kbd-xs px-3">
              Enter
            </kbd>
          </fieldset>
          <button class="btn rounded-field" onClick={this.onSearch}>
            Pesqusar
          </button>
        </div>
        <div class="w-full grid grid-rows-[auto_1fr]">
          <LibraryMetricsView />
          <LibraryBooksView />
        </div>
      </div>
    );
  },
});
