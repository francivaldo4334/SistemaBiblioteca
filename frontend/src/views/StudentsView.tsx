import CrudTable from "@/components/Crud/CrudContainer";
import type { Schema } from "@/components/Crud/types";
import { StudentsAPI } from "@/services/api/endpoints";
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    studentSchema():Schema {
      return {
          "name": {
            type: "string",
            required: true,
            label: "Nome",
          },
          "registration": {
            type: "string",
            required: true,
            label: "Matrícula"
          }
      }
    }
  },
  render() {
    return (<>
      <CrudTable
        verboseName="Aluno"
        baseQueryKey="StudentsAPI"
        viewsetAPI={StudentsAPI}
        display={["name", "registration"]}
        schema={this.studentSchema}
      />
    </>)
  }
})
