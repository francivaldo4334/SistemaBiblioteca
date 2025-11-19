import Sidebar from "@/layouts/Sidebar";
import { defineComponent, type FunctionalComponent } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ArrowLeftRight, Book, Home, LogOut, User2, type LucideIcon } from "lucide-vue-next";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const MenuItem: FunctionalComponent<{ name: string, Icon: LucideIcon, label: string }> = (props) => {
  return <>
    <li>
      <RouterLink
        to={{ name: props.name }}
        activeClass="menu-active"
      >
        <props.Icon />{props.label}
      </RouterLink>
    </li>
  </>
}

export default defineComponent({
  setup() {
    const authStore = useAuthenticationStore()
    const router = useRouter()
    return {
      authStore,
      router,
    }
  },
  methods: {
    onLogout() {
      const confirmed = confirm("Realmente deseja finalizar a sessão?")
      if (!confirmed) return
      this.authStore.cleanSession()
      this.router.replace({ name: "login" })
    }
  },
  render() {
    return (
      <Sidebar >
        {{
          menuContent: () => <>
            <MenuItem
              name="home"
              label="Acervo"
              Icon={Home}
            />
            <MenuItem
              name="library"
              label="Livros"
              Icon={Book}
            />
            <MenuItem
              name="students"
              label="Alunos"
              Icon={User2}
            />
            <MenuItem
              name="loans"
              label="Emprestimos"
              Icon={ArrowLeftRight}
            />
          </>,
          menuContentEnd: () => <>
            <div class="p-4">
              <button class="btn w-full" onClick={this.onLogout}>
                <span class="w-full">Sair da Sessão</span>
                <LogOut />
              </button>
            </div>
          </>,
          default: () => <RouterView />
        }}
      </Sidebar>

    )
  }
})
