import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const deleteData = async (id: number): Promise<undefined> => {
    await axios.delete(`${API_URL}/agendamento/deletar/${id}`)
}

export default function useAgendamentoDelete() {
    const queryCliente = useQueryClient()

    return useMutation({
        mutationFn: deleteData,
        onSuccess: async () => {
            await queryCliente.refetchQueries({
                queryKey: ['agendamento-data'],
                type: 'active',
            })
        }
    })
}
