export type StatusPagamento = "PAGO" | "PENDENTE"
export type FormaPagamento = "PIX" | "DINHEIRO" | "CARTAO_DEBITO" | "CARTAO_CREDITO"
export type PeriodoGrafico = "7d" | "30d" | "3m"

export const FORMAS_PAGAMENTO: FormaPagamento[] = ["PIX", "DINHEIRO", "CARTAO_DEBITO", "CARTAO_CREDITO"]

export const ROTULO_FORMA: Record<FormaPagamento, string> = {
    PIX: "Pix",
    DINHEIRO: "Dinheiro",
    CARTAO_DEBITO: "Cartão de débito",
    CARTAO_CREDITO: "Cartão de crédito",
}

export const DIAS_POR_PERIODO: Record<PeriodoGrafico, number> = {
    "7d": 7,
    "30d": 30,
    "3m": 90,
}

export interface FormaPagamentoTotal {
    forma: FormaPagamento
    total: number
    quantidade: number
}

export interface ResumoDoDia {
    data: string
    produzido: number
    recebido: number
    pendente: number
    totalServicos: number
    totalAtendimentos: number
    porForma: FormaPagamentoTotal[]
}

export interface Movimentacao {
    agendamentoId: number
    cliente: string
    data: string
    horario: string
    servicos: string[]
    valor: number
    status: StatusPagamento
    formaPagamento: FormaPagamento | null
}

export interface Pendente {
    agendamentoId: number
    cliente: string
    data: string
    horario: string
    servicos: string[]
    valor: number
}

export interface FaturamentoDia {
    data: string
    total: number
}

export interface RegistrarPagamentoData {
    formaPagamento: FormaPagamento
    valor: number
}