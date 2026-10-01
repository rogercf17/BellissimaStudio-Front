export const SERVICOS = [
    "ESCOVA",
    "LUZES",
    "PROGRESSIVA",
    "SOMBRANCELHA",
    "TERAPIA_CAPILAR",
    "BOTOX",
    "UNHA",
    "ESCOVA_E_PRANCHA",
    "PENTEADO",
    "MAQUIAGEM",
] as const

export type ServicoEnum = typeof SERVICOS[number]

export interface AgendamentoData {
    id?: number
    clienteId: number
    nomeCliente?: string
    telefoneCliente?: string
    data: string
    horario: string
    servicos: ServicoEnum[]
    valor: number
}