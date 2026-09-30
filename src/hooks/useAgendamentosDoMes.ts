import { useQuery } from "@tanstack/react-query";
import type { AgendamentoData } from "../interface/AgendamentoData"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface useAgendamentoDoMesProps {
    mes: number;
    ano: number;
}

const fetchAgendamentosDoMes = async (mes: number, ano: number): Promise<AgendamentoData[]> => {
    try {
        const response = await axios.get<AgendamentoData[]>(
            `${API_URL}/agendamento/mes/${mes}/ano/${ano}`
        )
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return []
        }
        throw error
    }
}

export default function useAgendamentoDoMes({ mes, ano}: useAgendamentoDoMesProps) {
    const query = useQuery({
        queryKey: ["agendamento-mes", mes, ano],
        queryFn: () => fetchAgendamentosDoMes(mes + 1, ano),
        retry: 2,
        staleTime: 1000 * 60 * 5,
        select: (agendamentos) => {
            return new Set(agendamentos.map((a) => a.data))
        }
    })

    return query
}