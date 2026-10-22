import type { AgendamentoData } from "./AgendamentoData"

export interface ClienteData {
    id?: number
    nome: string
    ativo?: boolean
    agendamentos?: AgendamentoData[]
}