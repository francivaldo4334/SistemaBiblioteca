import BookCard from "@/components/BookCard";
import BookDetails from "@/components/BookDetails";
import Combobox from "@/components/ui/Combobox";
import Pagination from "@/components/ui/Pagination";
import { BooksAPI, LoansAPI, StudentsAPI } from "@/services/api/endpoints";
import type { LoanRequest } from "@/services/api/request_types";
import type { BookResponse, StudentResponse } from "@/services/api/response_types";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ArrowLeftRight, Save, X } from "lucide-vue-next";
import { computed, defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const page = ref(1)
    const formModalLoan = reactive<{
      book: number;
      student: number;
      return_date: string;
    }>({
      book: 0,
      student: 0,
      return_date: "",
    })
    const store = useLibraryStore()
    const isOpenModalLoan = ref(false)
    const search = computed(() => store.search)
    const bookDetails = ref<Partial<BookResponse>>({})
    const modalBookDetails = ref<HTMLDialogElement>()
    const queryBooks = useQuery({
      queryFn: () => BooksAPI.list({page: page.value, page_size: 10, search:search.value}),
      queryKey: ["BooksAPI.list", page, search]
    })
    const loanMutation = useMutation({
      mutationFn: (data: Partial<LoanRequest>)=> LoansAPI.create(data as any),
      mutationKey: ["LoansAPI.create"]
    })
    const queryClient = useQueryClient()
    return { 
      page,
      modalBookDetails,
      queryBooks,
      bookDetails,
      loanMutation,
      isOpenModalLoan,
      formModalLoan,
      queryClient,
    }
  },
  computed: {
    books() {
      console.log(this.queryBooks.data.value?.results)
      return this.queryBooks.data.value?.results || []
    },
    totalPages(){
      return this.queryBooks.data.value?.total_pages || 1
    }
  },
  methods: {
    openDetails(it: BookResponse){
      this.bookDetails = it
      this.modalBookDetails?.show()
    },
    openModalLoan(it:number){
      this.formModalLoan.book=it
      this.isOpenModalLoan = true
    },
    closeModalLoan(){
      this.formModalLoan.student = 0
      this.formModalLoan.book = 0
      this.formModalLoan.return_date = ""
      this.isOpenModalLoan = false
    },
    onCreateLoan(){
      this.loanMutation.mutate({
        student: this.formModalLoan.student,
        book: this.formModalLoan.book,
        return_date: this.formModalLoan.return_date,
      }, {
          onSuccess:() => {
            alert("Emprestimo realizado como sucesso!")
            this.queryClient.invalidateQueries({
              queryKey: ["BooksAPI.list"]
            })
            this.queryClient.invalidateQueries({
              queryKey: ["BooksAPI.metrics"]
            })
            this.closeModalLoan()
          },
          onError: () => {
            alert("Ocorreu um erro ao ralizar o emprestimo")
          }
        }) 
    }
  },
  render() {
    return (<div class="overflow-y-auto">
      <legend class="text-2xl font-bold text-base-content/70 p-4">Livros</legend>
      <div class="grid grid-cols-4 p-4 gap-4">
        {this.books.map(it => (
          <BookCard
            onDetails={() => this.openDetails(it)}
            onLoan={()=>this.openModalLoan(it.id)}
            image={it.image}
            title={it.title}
            authors={it.authors}
            publisher={it.publisher}
            category={it.book_type}
            available={it.available_count > 0}
            isbn={it.isbn}
          />
        ))}
        <div class='col-span-4'>
          <Pagination
            v-model:page={this.page}
            totalPages={this.totalPages}
          />
        </div>
      </div>
      <dialog class="modal" ref="modalBookDetails">
        <div class="modal-box max-w-3xl">
          <form method="dialog" class="absolute top-4 right-4">
            <button class="btn btn-circle btn-ghost btn-sm" aria-label="Fechar">
              <X class="w-4 h-4" />
            </button>
          </form>
          <BookDetails
            image={this.bookDetails.image}
            title={this.bookDetails.title}
            author={this.bookDetails.authors}
            published={this.bookDetails.publisher}
            year={this.bookDetails.publish_date}
            category={this.bookDetails.book_type}
            totalCount={this.bookDetails.quantity}
            availableCount={this.bookDetails.available_count}
          />
          <div class="flex justify-end pt-4 gap-4">
            <form method="dialog">
              <button class="btn btn-error btn-sm btn-soft"> <X/> Fechar Modal </button>
            </form>
            <button 
              class="btn btn-info btn-sm"
              onClick={() => this.openModalLoan(this.bookDetails?.id!)}
            >
              <ArrowLeftRight/>
              Emprestar
            </button>
          </div>
        </div>
      </dialog>
      <dialog class={{
        "modal": true,
        "modal-open": this.isOpenModalLoan
      }}>
        <div class="modal-box">
          <form>
            <fieldset class='fieldset grid gap-3 grid-cols-2'>
              <legend class="fieldset-legend">Criar Novo Emprestimo</legend>
              <label class="label">Estudante:</label>
              <Combobox
                baseQueryKey="StudentsAPI"
                viewsetAPI={StudentsAPI}
                option={(it: StudentResponse) => ({label: it.name, value: it.id})}
                v-model={this.formModalLoan.student}
              />
              <label class="label">Data/Devolução:</label>
              <input 
                type="date" class="input" 
                v-model={this.formModalLoan.return_date} 
                required
              />
              <div class="flex justify-end gap-3 col-span-2">
              <button 
                  class="btn btn-error btn-sm btn-soft"
                  type="button" 
                  onClick={this.closeModalLoan}
                > 
                  <X/> Fechar Modal 
                </button>
                <button
                  class='btn btn-success btn-sm'
                  type="button"
                  onClick={this.onCreateLoan}
                >
                  Salvar <Save/>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </div>)
  }
})
