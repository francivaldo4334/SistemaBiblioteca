import { useQuery } from "@tanstack/vue-query";
import { Eraser } from "lucide-vue-next";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    baseQueryKey: { type: String, required: true },
    viewsetAPI: { type: Object, required: true },
    option: { type: Function, required: true },
    modelValue: Number,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const search = ref("")
    const query = useQuery({
      queryFn: () => props.viewsetAPI.list({ search: search.value, page: 1, page_size: 3 }),
      queryKey: [`${props.baseQueryKey}.list`, search]
    })
    const modelValue = computed({
      get: () => props.modelValue,
      set: v => emit("update:modelValue", v)
    })
    return {
      query,
      search,
      modelValue,
    }
  },
  computed: {
    items() {
      return (this.query.data.value?.results || []) as any[]
    }
  },
  methods: {
    onSelect(value: number, label: string) {
      this.modelValue = value
      this.search = label
    },
    onCleanSelection(){
      this.modelValue = 0 
      this.search = '' 
    }
  },
  render() {
    return (
      <div class="join">
        <div class="dropdown">
          <input
            class="input join-item"
            placeholder="Pesquisar..."
            autocomplete="off"
            type="search"
            disabled={Boolean(this.modelValue)}
            v-model={this.search}
          />
          <ul class="menu dropdown-content bg-base-100 rounded-field border border-base-content/30">
            {this.items.map(it => {
              const { value, label } = this.option(it)
              return (
                <li><button
                  onClick={() => {
                    this.onSelect(value, label)
                  }}
                  onKeypress={e => {
                    if (e.key === "Enter") {
                    this.onSelect(value, label)
                    }
                  }}
                >{label}</button></li>
              )
            })}
          </ul>
        </div>
        <button
          class='btn btn-soft btn-square join-item'
          disabled={!this.modelValue}
          onClick={() => {
            this.onCleanSelection()
          }}
        >
          <Eraser />
        </button>
      </div>
    )
  }
})
