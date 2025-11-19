import { LibraryBig } from "lucide-vue-next";
import { defineComponent, type SlotsType } from "vue";

export default defineComponent({
  slots: Object as SlotsType<{
    menuContent: () => any,
    menuContentEnd: () => any,
    default: () => any
  }>,
  render() {
    return (
      <section class="h-screen grid grid-cols-[15rem_auto] bg-base-300">
        <nav class="bg-base-100 flex flex-col">
          <div class="flex flex-col">
            <div class="flex gap-3 p-4 pb-2 font-bold text-xl">
              <LibraryBig /> Bíblioteca
            </div>
            <div class="divider my-0" />
          </div>
          <ul class="menu w-fullpnpm add lucide-vue-next text-lg w-full">
            <this.$slots.menuContent />
          </ul>
          <div class="flex-1"/>
          <this.$slots.menuContentEnd />
        </nav>
        <main class="overflow-y-auto h-screen">
          <this.$slots.default />
        </main>
      </section>
    )
  }
})
