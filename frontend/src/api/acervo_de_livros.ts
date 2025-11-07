import { baseUrl } from "./baseUrl"
import type { LivroRegistroResponse } from "./acervo_de_livros_interface"

export const getLivrosRegistrados = async (): Promise<LivroRegistroResponse[]> => {
  try {
    const response = await fetch(baseUrl("/acervo_de_livros/livros_registrados/"), {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    })
    if (!response.ok) {
      console.log(`Erro ${response.status}`)
      return []
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  }
  catch (error) {
    console.log("Erro de conexão com o servidor", error)
    return []
  }
}
