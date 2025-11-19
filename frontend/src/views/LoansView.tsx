import CrudTable from "@/components/Crud/CrudContainer";
import type { Actions, Schema } from "@/components/Crud/types";
import { LoansAPI, BooksAPI, StudentsAPI } from "@/services/api/endpoints";
import type { BookResponse, StudentResponse } from "@/services/api/response_types";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { Save, X } from "lucide-vue-next";
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const postponedDate = ref("")
    const isOpenModalPostponed = ref(false)
    const idsToPostponed = reactive<number[]>([])
    const queryClient = useQueryClient()
    const retrunBookMutation = useMutation({
      mutationFn: (id: number) => LoansAPI.return_book(id),
      mutationKey: ["LoansAPI.return_book"]
    })
    const postponedMutation = useMutation({
      mutationFn: (id: number) => LoansAPI.postponed(id, postponedDate.value),
      mutationKey: ["LoansAPI.postponed"]
    })
    return {
      retrunBookMutation,
      postponedMutation,
      isOpenModalPostponed,
      idsToPostponed,
      postponedDate,
      queryClient,
    }
  },
  computed: {
    loanSchema(): Schema {
      return {
        "return_date": {
          type: "date",
          required: true,
          label: "Data/Devolução",
        },
        "book": {
          type: "select",
          required: true,
          label: "Livro",
          viewsetAPI: BooksAPI,
          baseQueryKey: "BooksAPI",
          option: (it: BookResponse) => {
            return {
              label: it.title,
              value: it.id,
            }
          },
        },
        "student": {
          type: "select",
          required: true,
          label: "Estudante",
          viewsetAPI: StudentsAPI,
          baseQueryKey: "StudentsAPI",
          option: (it: StudentResponse) => {
            return {
              label: `${it.name}/${it.registration}`,
              value: it.id,
            }
          },
        },
        "book_display": {
          type: "readonly",
          label: "Título do Livro",
        },
        "student_display": {
          type: "readonly",
          label: "Nome do Estudante",
        },
        "postponed_date": {
          type: "readonly",
          label: "Data/Remarcação",
        },
        "status_display": {
          type: "readonly",
          label: "Status",
        },
      }
    }
  },
  methods: {
    openModalPostponed(ids: number[]) {
      this.idsToPostponed.splice(0, this.idsToPostponed.length, ...ids)
      this.isOpenModalPostponed = true
    },
    closeModalPostponed() {
      this.idsToPostponed.splice(0)
      this.isOpenModalPostponed = false
    },
    submitPostponed() {
      Promise.all(this.idsToPostponed.map(id => this.postponedMutation.mutate(id)))
        .then(() => {
          this.queryClient.invalidateQueries({ queryKey: ["LoansAPI.list"] })
          this.queryClient.invalidateQueries({ queryKey: ["BooksAPI.metrics"] })
          alert("Data(s) remarcada(s) com sucesso")
          this.closeModalPostponed()
        })
        .catch(() => {
          alert("Ocorreu um erro ao remarcar")
        })
    },
    onReturnBooks(ids: number[]) {
      Promise
        .all(ids.map(id => this.retrunBookMutation.mutate(id)))
        .then(() => {
          alert("Livro(s) marcados como entregue")
          this.queryClient.invalidateQueries({ queryKey: ["LoansAPI.list"] })
          this.queryClient.invalidateQueries({ queryKey: ["BooksAPI.metrics"] })
        }).catch(() => {
          alert("Ocorreu um erro")
        })
    }
  },
  render() {
    return (<>
      <CrudTable
        verboseName="Emprestimo"
        baseQueryKey="LoansAPI"
        viewsetAPI={LoansAPI}
        display={["return_date", "postponed_date", "book_display", "student_display", "status_display"]}
        schema={this.loanSchema}
        actions={{
          "return_book": {
            label: "Registrar devolução de livro(s)",
            onAction: (ids) => {
              const confirmed = confirm("Deseja registrar o(s) livro(s) como devolvidos?")
              if (!confirmed) return
              this.onReturnBooks(ids)
            }
          },

          "postponed": {
            label: "Remarcar data para devolução do(s) livro(s)",
            onAction: (ids) => {
              this.openModalPostponed(ids)
            }
          }
        } as Actions}
      />
      <dialog class={{
        "modal": true,
        "modal-open": this.isOpenModalPostponed,
      }}>
        <div class="modal-box">
          <form onSubmit={e => {
            e.preventDefault()
            this.submitPostponed()
          }}>
            <fieldset class="fieldset grid grid-cols-2 gap-3">
              <legend class="fieldset-legend">Remarcar data do(s) livro(s)</legend>
              <label for="postponed_date" class="label">Data/Remarcação</label>
              <input
                id="postponed_date"
                type="date"
                class="input input-bordered"
                v-model={this.postponedDate}
              />
              <div class="flex justify-end col-span-2 gap-3">
                <button type="button" class="btn btn-error btn-soft btn-sm gap-3" onClick={() => this.closeModalPostponed()}>
                  Cancelar <X />
                </button>
                <button type="submit" class="btn btn-success btn-sm">
                  Confirmar <Save />
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </>)
  }
})
