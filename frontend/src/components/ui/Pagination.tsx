import { ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-vue-next";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    page: Number,
    totalPages: { type: Number, required: true },
  },
  emits: ["update:page", "update:totalPages"],
  setup(props, { emit }) {
    const page = computed({
      get: () => props.page || 1,
      set: (v) => emit("update:page", v)
    })
    return { page }
  },
  computed: {
    disabledPrevious() {
      return this.page <= 1
    },
    disabledNext() {
      return this.page >= this.totalPages
    },
    showAllButtons() {
      return this.totalPages > 3 && this.page < this.totalPages - 1
    },
    jumpValue() {
      return Math.min(this.totalPages, this.page + 9)
    },
    startValueOfShowButtons() {
      if (this.page === this.totalPages) {
        return Math.max(this.page - 2, 1)
      }
      return Math.max(this.page - 1, 1)
    },
    endValueOfShowButtons() {
      return Math.min(this.totalPages, this.startValueOfShowButtons + 3)
    },
    lengthOfShowButtons() {
      return this.endValueOfShowButtons - this.startValueOfShowButtons + 1
    },
    valuesOfShowButtons() {
      return Array.from({ length: this.lengthOfShowButtons }).map((_, i) => i + this.startValueOfShowButtons)
    }
  },
  methods: {
    onNext() {
      if (!(this.page < this.totalPages))
        return
      this.page = this.page + 1
    },
    onPrevious() {
      if (!(this.page > 1))
        return
      this.page = this.page - 1
    },
    setPage(value: number) {
      this.page = value
    }
  },
  render() {
    return <div class="w-full flex items-center gap-2">
      <button class="btn btn-ghost" disabled={this.disabledPrevious} onClick={this.onPrevious}>
        <ChevronsLeft />
        Anterior
      </button>
      {this.valuesOfShowButtons.map(p => (
        <button
          class={{
            "btn btn-square": true,
            "btn-neutral": p === this.page
          }}
          onClick={() => this.setPage(p)}
        > {p} </button>
      ))}
      {this.showAllButtons && (<>
        <MoreHorizontal />
        <button class="btn btn-square"> {this.jumpValue} </button>
      </>)}
      <button class="btn btn-ghost" disabled={this.disabledNext} onClick={this.onNext}>
        Proximo
        <ChevronsRight />
      </button>
      <span class="text-base-content/70 text-sm">Page {this.page} of {this.totalPages}</span>
      <div class='flex-1' />
      <fieldset class='flex gap-2 items-center'>
        <span>Page</span>
        <input type="number" min={1} max={this.totalPages} class='input input-sm w-15 min-w-15' v-model={this.page}/>
        <span>of {this.totalPages}</span>
      </fieldset>
    </div>
  }
})
