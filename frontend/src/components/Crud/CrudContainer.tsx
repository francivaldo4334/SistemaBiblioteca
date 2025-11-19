import { defineComponent, reactive, ref } from "vue"
import { useFileToBase64 } from "@/utils/useFileToBase64";
import type { BookRequest } from "@/services/api/request_types";
import { useMutationsAndQueries } from "./useMutationsAndQueries";
import Toolbar from "./Toolbar";
import Table from "./Table";
import Modal from "./Modal";

export default defineComponent({
  name: "CrudContainer",
  props: {
    baseQueryKey: { type: String, required: true },
    viewsetAPI: { type: Object, required: true },
    schema: { type: Object, required: true },
    display: { type: Array, required: true },
    verboseName: {type: String, required: true},
    actions: {type: Object, required: false},
  },
  setup(props) {
    const action = ref<"delete" | "">("")
    const updateId = ref(0)
    const page = ref(1)
    const isOpenModal = ref(false)
    const checks = reactive<Record<string, boolean>>({})
    const formValue = reactive<Partial<BookRequest> & any>({})
    const {
      queryList,
      queryClient,
      mutationCreate,
      mutationUpdate,
      mutationDelete,
    } = useMutationsAndQueries({
      page,
      verboseName: props.verboseName,
      baseQueryKey: props.baseQueryKey,
      viewsetAPI: props.viewsetAPI as any,
    })
    const { fileToBase64, urlToBase64 } = useFileToBase64()

    return {
      queryClient,
      mutationCreate,
      mutationDelete,
      mutationUpdate,
      fileToBase64,
      urlToBase64,
      isOpenModal,
      formValue,
      updateId,
      queryList,
      checks,
      action,
      page,
    }
  },
  mounted(){
    this.cleanForm()
  },
  methods: {
    cleanForm(){
      for (const [key, value] of Object.entries(this.schema)) {
        this.formValue[key] = 
          value.type === "string" ? ""
          : value.type === "number" ? 0 
          : value.type === "file" ? null 
          : undefined
      }
    },
    onCreate(){
      this.mutationCreate.mutate( this.formValue, { onSuccess: this.closeModal })
    },
    onUpdate(){
      this.mutationUpdate.mutate(
        { id: this.updateId, ...this.formValue, } as any, 
        { onSuccess: this.closeModal }
      )
    },
    async onSubmit(){
      if (this.updateId != 0){
        this.onUpdate()
        return
      }
      this.onCreate()
    },
    onExecAaction() {

      const ids = Object.entries(this.checks).filter(([_, value]) => value).map(([key]) => Number(key))
      switch(this.action){
        case "delete":
          const confirmed = confirm(`Realmente deseja excluir os ${Object.keys(this.checks).length} itens selecionados?`)
          if (!confirmed) return;
          Promise.all(ids.map(id => this.mutationDelete.mutate(id)))
          .then(() => {
            alert("Itens deletados com sucesso!")
            this.queryClient.invalidateQueries({queryKey:[`${this.baseQueryKey}.list`]})
          })
          break;
        default:
          (this.actions as any)[this.action].onAction(ids)
          break;
      }
      this.action = ""
      this.checkAll = false
    },
    openModal(){ this.isOpenModal=true },
    closeModal(){ this.isOpenModal=false },
    getField(key:string){ return this.formValue[key] },
    async setField(key:string, value: any){
      if (this.schema[key].type !== "file"){
        this.formValue[key] = value
        return
      }

      const form = document.getElementById(this.verboseName.toLowerCase()) as HTMLFormElement
      const input = form.elements[key as any] as HTMLInputElement
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(value);
      input.files = dataTransfer.files
      this.formValue[key] = await this.fileToBase64(value)
    },
    loadForm(v: any){
      Promise.all(Object.entries(v).map(async ([key, value]) => {
        if (this.schema[key].type === "file") {
          this.formValue[key] = await this.urlToBase64(value as any)
        }
        else{
          this.formValue[key] = value
        }
      }))
    }
  },
  computed: {
    totalPages(){ return this.queryList.data.value?.total_page || 1 },
    headers() { return this.display.map((key) => this.schema[key as any].label) },
    items(){ return (this.queryList.data.value?.results || []) as any[] },
    disabledBtnGoAction(){ return !this.action },
    checkAll: {
      get(){
        const values = Object.values(this.checks)
        return values.every(it => it) && this.items.length === values.length
      },
      set(v: boolean) {
        for (const key of this.items.map(it => String(it.id))) {
          this.checks[key] = v 
        }
      }
    },
  },
  render() {
    return (<div class='grid grid-rows-[auto_1fr] w-full'>
      <Toolbar
        cleanForm={this.cleanForm}
        onExecAaction={this.onExecAaction}
        openModal={this.openModal}
        disabledBtnGoAction={this.disabledBtnGoAction}
        actions={this.actions || {}}
        v-model:action = { this.action }
        v-model:updateId ={this.updateId}
      />
      <div class="overflow-x-auto mx-4 bg-base-100 rounded-box">
        <Table
          headers={this.headers}
          items={this.items}
          loadForm={this.loadForm}
          openModal={this.openModal}
          display={this.display}
          totalPages={this.totalPages}
          v-model:page={this.page}
          v-model:checks={this.checks}
          v-model:checkAll={this.checkAll}
          v-model:updateId={this.updateId}
        />
      </div>
      <Modal
        verboseName = {this.verboseName}
        updateId = {this.updateId}
        schema = {this.schema}
        setField = {this.setField}
        getField = {this.getField}
        onSubmit = {this.onSubmit}
        v-model:isOpen={this.isOpenModal}
        v-model:formValue={this.formValue}
      />
    </div>)
  }
})
