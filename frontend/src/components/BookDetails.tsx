import type { FunctionalComponent } from "vue"

export default ((props) => {
  return <>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <figure class="flex justify-center">
        <img
          src={props.image}
          alt="Capa do livro"
          class="rounded-xl shadow-md object-cover"
        />
      </figure>
      <div class="space-y-3">
        <div>
          <span class="text-sm text-base-content/70">Título</span>
          <p class="font-medium text-base-content">{props.title || "?"}</p>
        </div>

        <div>
          <span class="text-sm text-base-content/70">Autor(es)</span>
          <p class="font-medium text-base-content">{props.author || "?"}</p>
        </div>

        <div>
          <span class="text-sm text-base-content/70">Editora</span>
          <p class="font-medium text-base-content">{props.published || "?"}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <span class="text-sm text-base-content/70">Data/Públicação</span>
            <p class="font-medium text-base-content">{props.year || "?"}</p>
          </div>
          <div>
            <span class="text-sm text-base-content/70">Categoria</span>
            <p class="font-medium text-base-content">{props.category || "?"}</p>
          </div>
        </div>

        <div class="divider my-2"></div>

        <div class="grid grid-cols-3 gap-3 ">
          <div class="rounded-lg p-2">
            <p class="text-xs text-base-content/60">Total</p>
            <p class="text-lg font-bold text-base-content">{props.totalCount || 0}</p>
          </div>
          <div class="rounded-lg p-2">
            <p class="text-xs">Disponíveis</p>
            <p class="text-lg font-bold">{props.availableCount || 0}</p>
          </div>
          <div class="rounded-lg p-2">
            <p class="text-xs">Emprestados</p>
            <p class="text-lg font-bold">{props.totalCount && props.availableCount ? props.totalCount - props.availableCount : 0}</p>
          </div>
        </div>
      </div>
    </div>
  </>
}) as FunctionalComponent<{
  title?: string;
  image?: string;
  author?: string;
  published?: string;
  year?: string;
  category?: string;
  totalCount?: number;
  availableCount?: number;
}>
