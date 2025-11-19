import LibraryMetricCard from "@/components/LibraryMetricCard";
import { BooksAPI } from "@/services/api/endpoints";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useQuery } from "@tanstack/vue-query";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const store = useLibraryStore()
    const period = computed({
      get: () => store.period,
      set: (v) => store["update:period"](v)
    })
    const queryMetrics = useQuery({
      queryFn: () => BooksAPI.metrics(),
      queryKey: ["BooksAPI.metrics"]
    })
    return {
      period,
      queryMetrics,
    }
  },
  computed: {
    metrics() {
      return this.queryMetrics.data.value || []
    },
  },
  methods: {
    mapPeriod() {
      if (!this.period) return "Total"
      return {
        "W": "Semana",
        "M": "Mês",
        "D": "Dia",
        "Y": "Ano",
      }[this.period] || "Total"
    },
    mapTitle(key: string) {
      return {
        "total_books": "Total de Livros",
        "total_not_returned_count": "Não Entregues",
        "total_available_count": "Disponíveis",
        "total_not_returned": `Não Entregues / ${this.mapPeriod()}`,
        "total_returned": `Entregues / ${this.mapPeriod()}`,
      }[key] || key
    }
  },
  render() {
    return (<div>
      <div class='flex w-full p-4 flex justify-end gap-1'>
        <form class='filter' v-model={this.period} onReset={() => this.period = undefined}>
          <input class="btn btn-square" type="reset" value="x" />
          {Object.entries({
            "W": "Semana",
            "D": "Dia",
            "M": "Mês",
            "Y": "Ano",
          }).map(([key, label]) => (
            <input class="btn" type="radio" name="range_type" aria-label={label} onChange={() => (this.period = key as any)} checked={this.period == key} />
          ))}
        </form>
      </div>
      <div
        class="w-full grid grid-cols-5 auto-rows-[10rem] gap-4 px-4 min-h-[10rem] transition-all duration-300 ease-in-out"
      >
        {this.metrics.map(it => (
          <LibraryMetricCard
            title={this.mapTitle(it.key)}
            count={String(it.value)}
            metric=""
            hiddenBadge
          />
        ))}
      </div>

    </div>)
  }
})
