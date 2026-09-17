import axios from "axios"
import type { AgendamentoData } from "../interface/AgendamentoData"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

interface AtualizarAgendamentoProps {
    id: number
    data: AgendamentoData
}

const putData = async ({ id, data }: AtualizarAgendamentoProps): Promise<AgendamentoData> => {
    const response = await axios.put(`${API_URL}/agendamento/atualizar/${id}`, data)
    return response.data
}

export default function useAgendamentoUpdate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: putData,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['agendamento-data'],
                type: 'active',
            })
        },
        onError: (error) => console.error("Erro ao atualizar agendamento:", error)
    })
}