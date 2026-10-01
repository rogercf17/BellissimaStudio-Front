import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { RegistrarPagamentoData } from "../interface/FinanceiroData"

const API_URL = import.meta.env.VITE_API_URL

interface RegistrarPagamentoParams extends RegistrarPagamentoData {
    agendamentoId: number
}

const registrar = async ({ agendamentoId, ...body }: RegistrarPagamentoParams): Promise<void> => {
    await axios.post(`${API_URL}/financeiro/agendamentos/${agendamentoId}/pagamento`, body)
}

export default function useRegistrarPagamento() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: registrar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["financeiro"] })
        },
        onError: (error) => console.error("Erro ao registrar pagamento:", error),
    })
}