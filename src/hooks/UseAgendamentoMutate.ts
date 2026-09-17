import axios from "axios"
import type { AgendamentoData } from "../interface/AgendamentoData"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const postData = async (data: AgendamentoData): Promise<AgendamentoData> => {
    const response = await axios.post<AgendamentoData>(`${API_URL}/agendamento`, data)
    return response.data
}

export default function useAgendamentoMutate() {
    const queryClient = useQueryClient()

    const agendamentoMutation  = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agendamento-data'] })
        },
        onError: (error) => {
            console.error("Erro ao criar agendamento:", error)
        }
    })

    return agendamentoMutation
}
