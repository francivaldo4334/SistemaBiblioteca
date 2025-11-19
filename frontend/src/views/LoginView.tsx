import { TokenAPI } from "@/services/api/endpoints";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useMutation } from "@tanstack/vue-query";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter()
    const loginMutation = useMutation({
      mutationFn: (data: {
        username: string;
        password: string;
      }) => TokenAPI.token(data),
      mutationKey: ["TokenAPI.token"],
    })
    const authStore = useAuthenticationStore()

    return { 
      loginMutation,
      router,
      authStore,
    }
  },
  methods: {
    onSubmit(e: Event) {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData.entries())
      this.onLogin(data as any)
    },
    onLogin(data: {
      username: string;
      password: string;
    }) {
      this.loginMutation.mutate(data, {
        onSuccess: (data) => {
          this.authStore.accessToken = data.access
          this.authStore.refreshToken = data.refresh
          this.router.replace({ name: "app" })
        },
        onError: () => {
          alert("Usuário ou Senha incorreto verifique e tente novamente")
        }
      })
    }
  },
  render() {
    return (
      <main class="w-screen h-screen bg-base-200 flex *:m-auto">
        <form onSubmit={this.onSubmit} class="bg-base-100 rounded-box p-4 grid grid-cols-[auto_1fr] gap-3">
          <legend class="col-span-2">Seja Bem Vindo!</legend>
          <label>Usuário:</label>
          <input class="input" type="text" name="username" />
          <label>Senha:</label>
          <input class="input" type="password" name="password" autocomplete="off" />
          <button class="btn btn-success col-span-2">Iniciar sessão</button>
        </form>
      </main>
    )
  }
})
