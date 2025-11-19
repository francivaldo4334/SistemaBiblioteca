import { ArrowDown, ArrowUp } from "lucide-vue-next";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, required: true },
    count: { type: String, required: true },
    metric: { type: String, required: true },
    badMetric: Boolean,
    hiddenBadge: Boolean,
  },
  render() {
    return (
      <div class="bg-base-100 rounded-box p-4 flex flex-col justify-between">
        <span class="text-base-content/70">{this.title}</span>
        <p class="text-4xl">{this.count}</p>
        <div>

          <span class={{
            "badge badge-soft": true,
            "badge-error": this.badMetric,
            "badge-success": !this.badMetric,
            "hidden": this.hiddenBadge,
          }}>{this.metric} {
              this.badMetric ?
                <ArrowDown size={16} />
                :
                <ArrowUp size={16} />
            }
          </span>
        </div>
      </div>
    )
  }
})
