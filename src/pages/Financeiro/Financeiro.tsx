import { useState } from "react"
import { Banknote, CalendarDays, Clock, CreditCard, QrCode, Wallet, WandSparkles } from "lucide-react"
import { useMovimentacoes, usePendentes, useResumo } from "../../hooks/useFinanceiroData"
import {
    FORMAS_PAGAMENTO,
    ROTULO_FORMA,
    type FormaPagamento,
    type Pendente,
} from "../../interface/FinanceiroData"
import { CardResumo } from "../../components/CardResumo/CardResumo"
import { StatusBadge } from "../../components/StatusBadge/StatusBadge"
import { GraficoFaturamento } from "../../components/GraficoFaturamento/GraficoFaturamento"
import { ModalPagamento } from "../../components/ModalPagamento/ModalPagamento"

const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const formatarData = (iso: string) => {
    const [ano, mes, dia] = iso.split("-")
    return `${dia}/${mes}/${ano}`
}

const formatarHora = (hora: string) => hora.slice(0, 5)

const hojeIso = () => {
    const d = new Date()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${d.getFullYear()}-${mm}-${dd}`
}

const iconeForma: Record<FormaPagamento, typeof QrCode> = {
    PIX: QrCode,
    DINHEIRO: Banknote,
    CARTAO_DEBITO: CreditCard,
    CARTAO_CREDITO: CreditCard,
}

export default function Financeiro() {
    const [dataSelecionada, setDataSelecionada] = useState(hojeIso)
    const [pendenteSelecionado, setPendenteSelecionado] = useState<Pendente | null>(null)

    const resumoQuery = useResumo(dataSelecionada)
    const movimentacoesQuery = useMovimentacoes(dataSelecionada)
    const pendentesQuery = usePendentes()

    const resumo = resumoQuery.data
    const movimentacoes = movimentacoesQuery.data ?? []
    const pendentes = pendentesQuery.data ?? []

    const totalPorForma = (resumo?.porForma ?? []).reduce((acc, f) => acc + f.total, 0)
    const formas = FORMAS_PAGAMENTO.map((forma) => {
        const valor = resumo?.porForma.find((f) => f.forma === forma)?.total ?? 0
        return {
            forma,
            rotulo: ROTULO_FORMA[forma],
            valor,
            percentual: totalPorForma > 0 ? (valor / totalPorForma) * 100 : 0,
        }
    })

    const moeda = (v?: number) => (v === undefined ? "—" : formatarMoeda(v))

    const cards = [
        {
            titulo: "Valor produzido",
            subtitulo: "serviços realizados",
            valor: moeda(resumo?.produzido),
            icone: WandSparkles,
            cor: "#691B37",
        },
        {
            titulo: "Valor recebido",
            subtitulo: "já pago",
            valor: moeda(resumo?.recebido),
            icone: Wallet,
            cor: "#2F7D5B",
        },
        {
            titulo: "Valor pendente",
            subtitulo: "a receber",
            valor: moeda(resumo?.pendente),
            icone: Clock,
            cor: "#C2622D",
        },
        {
            titulo: "Total de serviços",
            subtitulo: "realizados no dia",
            valor: resumo ? String(resumo.totalServicos) : "—",
            icone: CalendarDays,
            cor: "#6B5BA8",
        },
    ]

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-bordeaux sm:text-4xl">
                        Bom dia, Administrador!
                    </h1>
                    <p className="font-serif text-xl text-ink sm:text-2xl">
                        Aqui está o resumo do seu salão.
                    </p>
                </div>
                <input
                    type="date"
                    value={dataSelecionada}
                    onChange={(e) => e.target.value && setDataSelecionada(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-3 
                    py-2 text-sm text-ink sm:w-auto"
                />
            </div>

            {(resumoQuery.isError || movimentacoesQuery.isError || pendentesQuery.isError) && (
                <p className="rounded-xl bg-orange-100 px-4 py-3 text-sm text-orange-800">
                    Não foi possível carregar os dados do financeiro. 
                    Verifique a conexão e tente novamente.
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {cards.map((card) => (
                    <CardResumo
                        key={card.titulo}
                        titulo={card.titulo}
                        subtitulo={card.subtitulo}
                        valor={card.valor}
                        icone={card.icone}
                        cor={card.cor}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-col gap-4 rounded-2xl border border-line 
                bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex items-center gap-2 text-bordeaux">
                        <CalendarDays size={22} />
                        <h2 className="font-serif text-xl text-ink sm:text-2xl">
                            Movimentações do dia
                        </h2>
                    </div>

                    {movimentacoesQuery.isLoading ? (
                        <p className="text-sm text-ink/60">Carregando...</p>
                    ) : movimentacoes.length === 0 ? (
                        <p className="text-sm text-ink/60">Nenhuma movimentação neste dia.</p>
                    ) : (
                        <>
                            <ul className="flex flex-col gap-2 sm:hidden">
                                {movimentacoes.map((m) => (
                                    <li
                                        key={m.agendamentoId}
                                        className="flex items-center justify-between gap-3 
                                        rounded-xl border border-line p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-ink">
                                                {m.cliente}
                                            </p>
                                            <p className="text-xs text-ink/60">
                                                {m.servicos.join(" + ")} · {formatarHora(m.horario)}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                            <span className="text-sm font-medium text-ink">
                                                {formatarMoeda(m.valor)}
                                            </span>
                                            <StatusBadge status={m.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="bg-bordeaux/5 text-xs uppercase 
                                        tracking-wide text-ink/60">
                                            <th className="rounded-l-lg px-3 py-2.5 font-medium">
                                                Cliente
                                            </th>
                                            <th className="px-3 py-2.5 font-medium">
                                                Serviço(s)
                                            </th>
                                            <th className="px-3 py-2.5 font-medium">
                                                Valor
                                            </th>
                                            <th className="px-3 py-2.5 font-medium">
                                                Pagamento
                                            </th>
                                            <th className="rounded-r-lg px-3 py-2.5 font-medium">
                                                Hora
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimentacoes.map((m) => (
                                            <tr
                                                key={m.agendamentoId}
                                                className="border-b border-line transition-colors 
                                                last:border-b-0 hover:bg-bordeaux/5"
                                            >
                                                <td className="px-3 py-3 font-medium text-ink">
                                                    {m.cliente}
                                                </td>
                                                <td className="px-3 py-3 text-ink/80">
                                                    {m.servicos.join(" + ")}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3 text-ink">
                                                    {formatarMoeda(m.valor)}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <StatusBadge status={m.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3 text-ink/80">
                                                    {formatarHora(m.horario)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                <aside className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col gap-3 rounded-2xl border border-line 
                    bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-bordeaux">
                            <Clock size={22} />
                            <h2 className="font-serif text-xl text-ink">
                                Pagamentos pendentes
                            </h2>
                        </div>

                        {pendentesQuery.isLoading ? (
                            <p className="text-sm text-ink/60">Carregando...</p>
                        ) : pendentes.length === 0 ? (
                            <p className="text-sm text-ink/60">Nenhum pagamento pendente.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {pendentes.map((p) => (
                                    <li
                                        key={p.agendamentoId}
                                        className="flex flex-col gap-2 rounded-xl border 
                                        border-line p-3 sm:flex-row sm:items-center 
                                        sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-ink">
                                                {p.cliente}
                                            </p>
                                            <p className="text-xs text-ink/60">
                                                {p.servicos.join(" + ")} · {formatarMoeda(p.valor)}
                                            </p>
                                            <p className="text-xs text-ink/50">
                                                {formatarData(p.data)} às {formatarHora(p.horario)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setPendenteSelecionado(p)}
                                            className="w-full cursor-pointer rounded-lg bg-bordeaux/10 
                                            px-3 py-2 text-xs font-medium text-bordeaux transition-colors 
                                            hover:bg-bordeaux/20 sm:w-auto"
                                        >
                                            Registrar pagamento
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-line 
                    bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="font-serif text-xl text-ink">Formas de pagamento</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {formas.map(({ forma, rotulo, valor, percentual }) => {
                                const Icone = iconeForma[forma]
                                return (
                                    <div
                                        key={forma}
                                        className="rounded-xl border border-line bg-bordeaux/5 p-3"
                                    >
                                        <div className="flex items-center gap-2 text-bordeaux">
                                            <Icone size={18} className="shrink-0" />
                                            <span className="text-xs font-medium text-ink">
                                                {rotulo}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-ink">
                                            {formatarMoeda(valor)}
                                        </p>
                                        <p className="text-xs text-ink/60">
                                            ({percentual.toFixed(1).replace(".", ",")}%)
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </aside>
            </div>

            <GraficoFaturamento />

            {pendenteSelecionado && (
                <ModalPagamento
                    pendente={pendenteSelecionado}
                    closeModal={() => setPendenteSelecionado(null)}
                />
            )}
        </div>
    )
}