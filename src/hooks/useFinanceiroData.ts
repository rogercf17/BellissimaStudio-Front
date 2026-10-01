import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    DIAS_POR_PERIODO,
    type FaturamentoDia,
    type Movimentacao,
    type Pendente,
    type PeriodoGrafico,
    type ResumoDoDia,
} from "../interface/FinanceiroData"

const API_URL = import.meta.env.VITE_API_URL

export function useResumo(data: string) {
    return useQuery({
        queryKey: ["financeiro", "resumo", data],
        queryFn: async () =>
            (await axios.get<ResumoDoDia>(`${API_URL}/financeiro/resumo`, { params: { data } })).data,
        enabled: !!data,
    })
}

export function useMovimentacoes(data: string) {
    return useQuery({
        queryKey: ["financeiro", "movimentacoes", data],
        queryFn: async () =>
            (await axios.get<Movimentacao[]>(`${API_URL}/financeiro/movimentacoes`, { params: { data } })).data,
        enabled: !!data,
    })
}

export function usePendentes() {
    return useQuery({
        queryKey: ["financeiro", "pendentes"],
        queryFn: async () =>
            (await axios.get<Pendente[]>(`${API_URL}/financeiro/pendentes`)).data,
    })
}

export function useFaturamento(periodo: PeriodoGrafico) {
    return useQuery({
        queryKey: ["financeiro", "faturamento", periodo],
        queryFn: async () =>
            (await axios.get<FaturamentoDia[]>(`${API_URL}/financeiro/faturamento`, {
                params: { dias: DIAS_POR_PERIODO[periodo] },
            })).data,
        placeholderData: keepPreviousData, // não pisca ao trocar 7d/30d/3m
    })
}