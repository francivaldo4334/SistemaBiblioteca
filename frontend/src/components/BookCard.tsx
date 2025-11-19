import { ArrowLeftRight, Eye } from "lucide-vue-next"
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    title: { type: String, required: true },
    authors: { type: String, required: true },
    publisher: { type: String, required: true },
    category: { type: String, required: true },
    isbn: { type: String, required: true },
    image: { type: String, required: true },
    available: Boolean,
    onDetails: Function,
    onLoan: Function,
  },
  render() {
    return <>
      <div class="card bg-base-100 shadow-sm">
        <figure>
          <img
            src={this.image}
            class="w-full bg-base-200 aspect-[3/4]"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title grid grid-cols-[1fr_auto]">
            <span class="truncate">{this.title}</span>
            {this.available ? (
              <div class="badge badge-soft badge-success">Disponível</div>
            ) : (
              <div class="badge badge-soft badge-error">Idisponível</div>
            )}
          </h2>
          <p class="truncate"><label class="label">Autor(s):</label> {this.authors || "?"}</p>
          <p class="truncate"><label class="label">Editora:</label> {this.publisher || "?"}</p>
          <p class="truncate"><label class="label">Categoria:</label> {this.category || "?"}</p>
          <p class="truncate"><label class="label">ISBN:</label> {this.isbn || "?"}</p>
          <div class="card-actions justify-end pt-4">
            <button
              class="btn btn-soft btn-info btn-sm"
              title="Ver detalhes"
              onClick={() => this.onDetails?.()}
            >
              <Eye /> Detalhes
            </button>
            <button
              class="btn btn-soft btn-info btn-sm"
              title="Emprestar"
              disabled={!this.available}
              onClick={() => this.onLoan?.()}
            >
              <ArrowLeftRight /> Emprestar
            </button>
          </div>
        </div>
      </div>
    </>
  }

})
