import { useFileToBase64 } from "@/utils/useFileToBase64";
import { Save, X } from "lucide-vue-next";
import { computed, defineComponent } from "vue";
import Combobox from "../ui/Combobox";

export default defineComponent({
  props: {
    verboseName: { type: String, required: true },
    updateId: { type: Number, required: true },
    schema: { type: Object, required: true },
    setField: { type: Function, required: true },
    getField: { type: Function, required: true },
    onSubmit: { type: Function, required: true },
    formValue: Object,
    isOpen: Boolean,
  },
  emits: ["update:formValue", "update:isOpen"],
  setup(props, { emit }) {
    const formValue = computed({
      get: () => props.formValue!,
      set: v => emit("update:formValue", v)
    })
    const isOpen = computed({
      get: () => props.isOpen!,
      set: v => emit("update:isOpen", v)
    })
    const { fileToBase64 } = useFileToBase64()
    return {
      formValue,
      fileToBase64,
      isOpen,
    }
  },
  render() {
    return (
      <dialog class={{
        "modal": true,
        "modal-open": this.isOpen,
      }}>
        <div class="modal-box">
          <button class="absolute right-4 top-4 btn btn-ghost btn-circle btn-sm" onClick={() => (this.isOpen = false)}> <X /> </button>
          <form id={this.verboseName.toLowerCase()} onSubmit={e => e.preventDefault()}>
            <fieldset class="fieldset grid grid-cols-6">
              <legend class='fieldset-legend cols-span-6 text-xl'>
                {this.updateId ? "Editar" : "Criar"} {this.verboseName}</legend>
              {Object.entries(this.schema).map(([key, value]) => (
                <>
                  <label class="label col-span-2">{value.label}</label>
                  <div class="col-span-4 join">
                    {value.type === "file" ? (
                      <input
                        class="input join-item"
                        type="file"
                        accept="image/png, image/jpeg"
                        name={key}
                        required={value.required}
                        onChange={(e) => {
                          const input = e.target as HTMLInputElement
                          const file = input.files?.[0] || null
                          if (file) {
                            this.formValue[key] = this.fileToBase64(file)
                          }
                        }}
                      />
                    ) : value.type === "string" ? (
                      <input
                        class="input join-item"
                        name={key}
                        v-model={this.formValue[key]}
                        required={value.required}
                      />
                    ) : value.type === "number" ? (
                      <input
                        class="input join-item"
                        type="number"
                        name={key}
                        v-model={this.formValue[key]}
                        required={value.required}
                      />
                    ) : value.type === "date" ? (
                      <input
                        class="input join-item"
                        type="date"
                        name={key}
                        v-model={this.formValue[key]}
                        required={value.required}
                      />
                    ) : value.type === "select" ? (
                      <Combobox
                        baseQueryKey={value.baseQueryKey}
                        viewsetAPI={value.viewsetAPI}
                        option={value.option}
                        v-model={this.formValue[key]}
                      />
                    ) : value.type === "readonly" ? (
                      <span class="p-1 uppercase text-base-content/80">{this.formValue[key] || "-"}</span>
                    ) : <div class='bg-error text-error-content'>Tipo não encontrado</div>
                    }
                    {value.actions && value.actions.map((it: any) => (
                      <button class='btn btn-square' type="button" onClick={() => it.onAction({
                        setFieldValue: this.setField,
                        getFieldValue: this.getField,
                      })}><it.Icon /></button>
                    ))}
                  </div>
                </>
              ))}
            </fieldset>
            <div class="flex justify-end mt-4">
              <button
                onClick={() => this.onSubmit()}
                class="btn btn-success"
              >
                <Save /> Salvar
              </button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }
})
