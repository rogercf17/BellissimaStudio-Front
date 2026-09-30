"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import useAgendamentoData from "../../hooks/useAgendamentoData"
import useAgendamentoDelete from "../../hooks/useAgendamentoDelete"
import useAgendamentoDoMes from "../../hooks/useAgendamentosDoMes"
import { Trash, Pencil } from "lucide-react"
import CreateModal from "../../components/CreateModal/CreateModal"
import type { AgendamentoData } from "../../interface/AgendamentoData"

function pad(n: number) {
    return String(n).padStart(2, "0")
}
function diaSelecionadoKey(ano: number, mes: number, dia: number) {
    return `${ano}-${pad(mes + 1)}-${pad(dia)}`
}
const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
type DiaCell = {
    dia: number
    ano: number
    mes: number
    noMes: boolean
}
function montarGridMes(ano: number, mes: number): DiaCell[] {
    const primeiroDoMes = new Date(ano, mes, 1)
    const diasNoMes = new Date(ano, mes + 1, 0).getDate()
    const diasNoMesPassado = new Date(ano, mes, 0).getDate()
    const colunaInicial = primeiroDoMes.getDay()

    const cells: DiaCell[] = []

    for (let i = 0; i < colunaInicial; i++) {
        const dia = diasNoMesPassado - colunaInicial + 1 + i
        cells.push({ dia, ano, mes: mes - 1, noMes: false })
    }
    for (let dia = 1; dia <= diasNoMes; dia++) {
        cells.push({ dia, ano, mes, noMes: true })
    }
    let proximoDia = 1
    while (cells.length < 42) {
        cells.push({ dia: proximoDia, ano, mes: mes + 1, noMes: false })
        proximoDia++
    }
    return cells
}
function formatarMesAno(data: Date) {
    return capitalize(format(data, "MMMM", { locale: ptBR }))
}
function formatarDiaDaSemanaLongo(data: Date) {
    return capitalize(format(data, "EEEE", { locale: ptBR }))
}
function formatarDataCompleta(data: Date) {
    return format(data, "dd 'de' MMMM", { locale: ptBR })
}
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Calendario() {
    const hoje = new Date()
    const [ano, setAno] = useState(hoje.getFullYear())
    const [mes, setMes] = useState(hoje.getMonth())
    const [diaSelecionado, setDiaSelecionado] = useState(
        format(hoje, "yyyy-MM-dd")
    )

    const { data: agendamentos } = useAgendamentoData({ data: diaSelecionado })
    const { mutate, isSuccess, isPending } = useAgendamentoDelete()

    const { data: diasComAgendamento } = useAgendamentoDoMes({ mes, ano })

    const cells = useMemo(() => montarGridMes(ano, mes), [ano, mes])

    const mesLabel = useMemo(
        () => formatarMesAno(new Date(ano, mes, 1)),
        [ano, mes]
    )

    const diaSelecionadoDate = useMemo(
        () => parseISO(diaSelecionado),
        [diaSelecionado]
    )

    const diaSelecionadoLabelLongo = useMemo(
        () => formatarDiaDaSemanaLongo(diaSelecionadoDate),
        [diaSelecionadoDate]
    )
    const diaSelecionadoLabelCurto = useMemo(
        () => formatarDataCompleta(diaSelecionadoDate),
        [diaSelecionadoDate]
    )

    const agendamentosDoDia = useMemo(() => {
        const agendamentosDia = agendamentos || []
        return [...agendamentosDia].sort((a, b) => a.horario.localeCompare(b.horario))
    }, [agendamentos])

    function irParaMes(delta: number) {
        let novoMes = mes + delta
        let novoAno = ano
        if (novoMes < 0) {
            novoMes = 11
            novoAno -= 1
        } else if (novoMes > 11) {
            novoMes = 0
            novoAno += 1
        }
        setMes(novoMes)
        setAno(novoAno)
    }

    function hojeKey() {
        return format(hoje, "yyyy-MM-dd")
    }

    useEffect(() => {
        if (!isSuccess) return
    }, [isSuccess])

    const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState<AgendamentoData | null>(null)

    return (
        <div className="w-full bg-pearl p-1 text-ink scrollbar-gutter-stable">
            <h1 className="mb-2 font-serif text-3xl text-bordeaux sm:text-4xl">Calendario</h1>

            <div className="w-full grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
                <div className="w-full min-w-0 overflow-hidden rounded-2xl border-line bg-white p-3 shadow-sm sm:p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => irParaMes(-1)}
                                className="rounded-full border border-line px-3 py-1.5 sm:px-2.5 sm:py-1 
                                text-bordeaux hover:bg-blush transition"
                                aria-label="Mês anterior"
                            >
                                ‹
                            </button>
                            <h2 className="font-serif text-2xl text-bordeaux sm:text-3xl">{mesLabel} {ano}</h2>
                            <button
                                onClick={() => irParaMes(1)}
                                className="rounded-full border border-line px-3 py-1.5 sm:px-2.5 sm:py-1 
                                text-bordeaux hover:bg-blush transition"
                                aria-label="Próximo mês"
                            >
                                ›
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setAno(hoje.getFullYear())
                                setMes(hoje.getMonth())
                                setDiaSelecionado(hojeKey())
                            }}
                            className="cursor-pointer rounded-xl border border-bordeaux px-3 py-1.5 
                            text-sm text-bordeaux hover:bg-blush transition"
                        >
                            Hoje
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-medium text-muted">
                        {diasDaSemana.map((d) => (
                            <div key={d} className="pb-2">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                        {cells.map((cell, idx) => {
                            const key = diaSelecionadoKey(cell.ano, cell.mes, cell.dia)
                            const isSelecionado = cell.noMes && key === diaSelecionado
                            const isHoje = cell.noMes && key === hojeKey()
                            const temAgendamentos = cell.noMes && diasComAgendamento?.has(key)

                            return (
                                <button
                                    key={idx}
                                    disabled={!cell.noMes}
                                    onClick={() => setDiaSelecionado(key)}
                                    className={`relative box-border flex aspect-square w-full cursor-pointer flex-col items-center justify-start overflow-hidden rounded-lg pt-1.5 text-sm transition-colors outline-none sm:rounded-xl sm:pt-2 ${
                                        !cell.noMes
                                            ? "cursor-default text-line"
                                            : isSelecionado
                                            ? "bg-bordeaux text-white ring-2 ring-bordeaux ring-inset"
                                            : "text-ink hover:bg-blush"
                                    }`}
                                >
                                    <span className={isHoje && !isSelecionado ? "font-semibold text-bordeaux" : isSelecionado ? "font-medium" : ""}>
                                        {cell.dia}
                                    </span>

                                    {temAgendamentos && (
                                        <span
                                            className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                                                isSelecionado ? "bg-champagne" : "bg-bordeaux"
                                            }`}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="w-full min-w-0 rounded-2xl border-line bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="mb-1 font-serif text-xl text-bordeaux sm:text-2xl">
                        Agendamentos de {diaSelecionadoLabelCurto}
                    </h2>
                    <p className="mb-4 text-xs text-muted">{diaSelecionadoLabelLongo}</p>

                    <div className="flex flex-col gap-3">
                        {agendamentosDoDia.length === 0 && (
                            <p className="py-6 text-center text-sm italic text-muted">
                                Nenhum agendamento para este dia.
                            </p>
                        )}
                        {agendamentosDoDia.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center gap-3 rounded-xl border-l-4 
                                border-l-bordeaux bg-blush/60 p-3"
                            >
                                <div className="w-14 shrink-0 text-xs">
                                    <p className="font-medium text-ink">{a.horario}</p>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#2B2420]">{a.nomeCliente}</p>
                                    <p className="truncate text-xs text-muted">{a.servicos.join(" + ")}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                                    <button
                                        className="cursor-pointer rounded-md p-2 text-muted sm:p-1 
                                        hover:bg-danger/10 hover:text-danger transition"
                                        onClick={() => {
                                            if (typeof a.id === "number") {
                                                mutate(a.id)
                                            }
                                        }}
                                        disabled={isPending}
                                        aria-label="Excluir agendamento"
                                    >
                                        {isPending ? "Excluindo..." : <Trash color="#ff0000" size={18} />}
                                    </button>
                                    <button
                                        className="cursor-pointer rounded-md p-2 text-muted sm:p-1 
                                        hover:bg-blush hover:text-bordeaux transition"
                                        onClick={() => setAgendamentoEmEdicao(a)}
                                        aria-label="Editar agendamento"
                                    >
                                        <Pencil color="#00ff1e" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {agendamentoEmEdicao && (
                <div className="fixed inset-0 z-50 flex overflow-y-auto bg-bordeaux-deep/60 p-4 backdrop-blur-sm">
                    <CreateModal
                        agendamento={agendamentoEmEdicao}
                        closeModal={() => setAgendamentoEmEdicao(null)}
                    />
                </div>
            )}
        </div>
    )
}