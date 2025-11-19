import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import type { Ref } from "vue";

export const useMutationsAndQueries = (props: {
  baseQueryKey: string;
  verboseName: string;
  viewsetAPI: {
    create: Function;
    delete: Function;
    update: Function;
    list: Function;
  },
  page: Ref<number>;
}) => {
  const queryClient = useQueryClient()
  const mutationCreate = useMutation({
    mutationFn: (data) => props.viewsetAPI.create(data),
    mutationKey: [`${props.baseQueryKey}.create`],
    onSuccess: () => {
      alert(`${props.verboseName} foi criado com sucesso!`)
      queryClient.invalidateQueries({ queryKey: [`${props.baseQueryKey}.list`] })
    },
    onError: () => {
      alert(`Não foi possivel criar o ${props.verboseName}`)
    }
  })
  const mutationUpdate = useMutation({
    mutationFn: (data: any) => props.viewsetAPI.update(data.id, data),
    mutationKey: [`${props.baseQueryKey}.update`],
    onSuccess: () => {
      alert(`${props.verboseName} foi modificado com sucesso!`)
      queryClient.invalidateQueries({ queryKey: [`${props.baseQueryKey}.list`] })
    },
    onError: () => {
      alert(`Não foi possivel modificar o ${props.verboseName}`)
    }
  })
  const mutationDelete = useMutation({
    mutationFn: (id: number) => props.viewsetAPI.delete(id),
    mutationKey: [`${props.baseQueryKey}.delete`],
    onError: () => {
      alert("Ocorreu um erro ao deletar um item")
    }
  })


  const queryList = useQuery({
    queryFn: () => props.viewsetAPI["list"]({ page: props.page.value, page_size: 10, }),
    queryKey: [`${props.baseQueryKey}.list`, props.page]
  })

  return {
    queryClient,
    queryList,
    mutationUpdate,
    mutationDelete,
    mutationCreate,
  }
}
