import CrudTable from "@/components/Crud/CrudContainer";
import type { Schema } from "@/components/Crud/types";
import { BooksAPI } from "@/services/api/endpoints";
import { useFetchFile } from "@/utils/useFetchFile";
import { SearchCode } from "lucide-vue-next";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const { fetchFile } = useFetchFile()
    return { fetchFile }
  },
  computed: {
    bookSchema(): Schema {
      return {
        "isbn": {
          label: "ISBN",
          type: "string",
          required: true,
          actions: [
            {
              Icon: SearchCode,
              onAction: ({ getFieldValue, setFieldValue }) => {
                const isConfirmed = confirm("Deseja preencher os dados automaticamente?")
                if (!isConfirmed) return
                const isbn = getFieldValue("isbn")
                BooksAPI.bookByIsbn(isbn)
                  .then(async it => {
                    const authors = it.authors.map(it => it.name).join(", ")
                    const image = await this.fetchFile(it.cover.large)
                    const title = it.title
                    const publishers = it.publishers.map(it => it.name).join(', ')
                    const publish_date = it.publish_date

                    setFieldValue("image", image)
                    setFieldValue("title", title)
                    setFieldValue("authors", authors)
                    setFieldValue("publish_date", publish_date)
                    setFieldValue("publisher", publishers)

                  })
              }
            }
          ]
        },
        "image": {
          label: "Capa",
          type: "file",
          required: true,
        },
        "title": {
          label: "Título",
          type: "string",
          required: true,
        },
        "authors": {
          label: "Autor(s)",
          type: "string",
          required: true,
        },
        "publish_date": {
          label: "Data/Públicação",
          type: "string",
          required: false,
        },
        "publisher": {
          label: "Editora",
          type: "string",
          required: false,
        },
        "quantity": {
          label: "Quantidade",
          type: "number",
          required: true,
        },
        "book_type": {
          label: "Categoria",
          type: "string",
          required: true,
        },
      }
    }
  },
  render() {
    return (<>
      <CrudTable
        verboseName="Livro"
        baseQueryKey="BooksAPI"
        viewsetAPI={BooksAPI}
        display={["isbn", "title", "authors", "book_type"]}
        schema={this.bookSchema}
      />
    </>)
  }
})
