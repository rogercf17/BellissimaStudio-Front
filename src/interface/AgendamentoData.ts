export const SERVICOS = [
    "ESCOVA",
    "LUZES",
    "PROGRESSIVA",
    "SOMBRANCELHA",
    "TERAPIA_CAPILAR",
    "BOTOX",
    "UNHA",
] as const

export type ServicoEnum = typeof SERVICOS[number]

export interface AgendamentoData {
    id?: number
    nomeCliente: string
    data: string
    horario: string
    servicos: ServicoEnum[]
}