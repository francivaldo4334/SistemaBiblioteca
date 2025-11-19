import { Plus } from "lucide-vue-next";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    cleanForm: { type: Function, required: true },
    onExecAaction: { type: Function, required: true },
    openModal: { type: Function, required: true },
    disabledBtnGoAction: { type: Boolean, required: true },
    actions: { type: Object, required: true },
    action: { type: String },
    updateId: { type: Number },
  },
  emits: ["update:action", "update:updateId"],
  setup(props, { emit }) {
    const updateId = computed({
      get: () => props.updateId,
      set: v => emit("update:updateId", v)
    })
    const action = computed({
      get: () => props.action,
      set: v => emit("update:action", v)
    })
    return {
      updateId,
      action,
    }
  },
  render() {
    return (
      <div class='w-full grid grid-cols-[1fr_auto] p-4'>
        <div class="flex gap-3">
          {this.$slots.filters?.()}
          <select class="select" v-model={this.action}>
            <option selected disabled value="">Nenhuma ação selecionada</option>
            <option value="delete">Excluir items selecionados</option>
            {(Object.entries(this.actions)).map(([key, value]) => (
              <option value={key}>{value.label}</option>
            ))}
          </select>
          <button class='btn' disabled={this.disabledBtnGoAction} onClick={() => this.onExecAaction()}> Ir </button>
        </div>
        <button class="btn btn-square" onClick={() => {
          this.updateId = 0
          this.cleanForm()
          this.openModal()
        }}>
          <Plus />
        </button>
      </div>
    )
  }
})
