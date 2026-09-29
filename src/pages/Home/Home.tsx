"use client"
import { format } from "date-fns"
import useAgendamentoData from "../../hooks/useAgendamentoData"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const hoje = format(new Date(), "yyyy-MM-dd")

    const { data: agendamentos, isLoading, isError } = useAgendamentoData({ data: hoje })
    const total = agendamentos?.length ?? 0

    const navigate = useNavigate();

    const handleNavigate = (url : string ) => {
        navigate(url)
    }

    const agendamentosOrdenados = agendamentos
        ? [...agendamentos].sort((a, b) => a.horario.localeCompare(b.horario))
        : []

    return(
        <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-bordeaux">Bom dia, Administrador!</h1>
            <p className="font-serif text-xl sm:text-2xl text-ink mb-3 sm:mb-2">Aqui está o resumo do seu salão hoje.</p>
            <div className="bg-pearl rounded-xl border border-blush-deep p-5 text-center w-full sm:w-3/5 mx-auto">
                <p className="text-2xl font-semibold text-bordeuax">
                    {isLoading ? "..." : total}
                </p>
                <p className="text-xs text-muted mt-1">
                    {total === 1 ? "Agendamento" : "Agendamentos"}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-line mt-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-serif text-ink font-medium">Agenda de hoje</h3>
                    <div className="flex gap-2">
                    <button 
                        className="cursor-pointer flex-1 sm:flex-none text-sm px-4 py-2 sm:py-1.5 rounded-lg bg-bordeaux text-white hover:bg-bordeaux-dark transition" 
                        onClick={() => handleNavigate("/criar")}
                    >
                        + Novo agendamento
                    </button>
                    <button 
                        className="cursor-pointer flex-1 sm:flex-none text-sm px-4 py-2 sm:py-1.5 rounded-lg bg-bordeaux text-white hover:bg-bordeaux-dark transition" 
                        onClick={() => handleNavigate("/calendario")}
                    >
                        Ver todos
                    </button>
                    </div>
                </div>

                <div className="divide-y divide-line p-0 sm:p-4 rounded-2xl flex flex-col gap-3">
                    {isError && (
                        <p className="text-sm textdanger">Erro ao carregar agendamentos.</p>
                    )}
                    {!isLoading && total === 0 && (
                        <p className="text-sm text-muted">Nenhum agendamento para hoje.</p>
                    )}
                    {agendamentosOrdenados.map((ag) => (
                        <div key={ag.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-ink font-medium">{ag.nomeCliente}</p>
                                <p className="text-xs text-muted">
                                    
                                    {ag.servicos.join(" + ")}
                                </p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-bordeaux">{ag.horario.slice(0, 5)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}