import { computed, defineComponent,ref } from "vue";
import Pagination from "../ui/Pagination";
import { Edit2 } from "lucide-vue-next";

export default defineComponent({
  props: {
    headers: {type: Array, required: true},
    items: {type: Array, required: true},
    loadForm:{type:Function, required:true},
    openModal:{type:Function, required:true},
    display: {type:Array, required: true},
    totalPages: {type: Number, required:true},
    checkAll: Boolean,
    checks: Object,
    updateId: Number,
    page: Number,
  },
  emits: ["update:checkAll", "update:checks", "update:updateId", "update:page"],
  setup(props, {emit}){
    const page = computed({
      get: () => props.page,
      set: v => emit("update:page", v)
    })
    const checkAll = computed({
      get: () => props.checkAll,
      set: v => emit("update:checkAll", v)
    })
    const checks = computed({
      get: () => props.checks as any,
      set: v => emit("update:checks", v)
    })
    const updateId = computed({
      get: () => props.updateId as any,
      set: v => emit("update:updateId", v)
    })
    return { 
      checkAll,
      checks,
      updateId,
      page,
    }
  },
  computed: {
    countCols() { return this.display.length + 2 },
  },
  render(){
    return (
      <table class="table">
        <thead>
          <tr>
            <th> <input type="checkbox" class="checkbox" v-model={this.checkAll}/> </th>
            {this.headers.map(v => <th key={v as any}>{v}</th>)}
            <th class="text-end"> Ações </th>
          </tr>
        </thead>
        <tbody>
          {this.items.map((it:any) => (
            <tr key={it.id}>
              <th> <input type="checkbox" class="checkbox" v-model={this.checks[String(it.id)]}/> </th>
              {this.display.map(v => (
                <td>{it[v as any]}</td>
              ))}
              <th class="flex justify-end"><button class="btn btn-square" onClick={()=>{
                this.updateId = it.id
                this.loadForm(it)
                this.openModal()
              }}><Edit2 size={16}/></button></th>
            </tr>
          ))}
        </tbody>
        <tr>
          <th colspan={this.countCols}>
            <Pagination
              v-model:page={this.page}
              totalPages={this.totalPages}
            />
          </th>
        </tr>
      </table>
    )
  }
})
