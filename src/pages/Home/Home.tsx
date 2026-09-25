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
            <h1 className="font-serif text-2xl text-[#691B37]">Bom dia, Administrador!</h1>
            <p className="font-serif text-2xl text-[#2B1820] mb-2">Aqui está o resumo do seu salão hoje.</p>
            <div className="bg-white rounded-xl border border-[#FAF6F6] p-4 text-center w-[60%] m-auto">
                <p className="text-2xl font-semibold text-[#691B37]">
                    {isLoading ? "..." : total}
                </p>
                <p className="text-xs text-[#7C6169] mt-1">
                    {total === 1 ? "Agendamento" : "Agendamentos"}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E7E0DC] mt-6 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#2B1820] font-medium">Agenda de hoje</h3>
                    <button 
                        className="cursor-pointer text-sm px-4 py-1.5 rounded-lg bg-[#691B37] text-white hover:opacity-90 transition" 
                        onClick={() => handleNavigate("/criar")}
                    >
                        + Novo agendamento
                    </button>
                    <button 
                        className="cursor-pointer text-sm px-4 py-1.5 rounded-lg bg-[#691B37] text-white hover:opacity-90 transition" 
                        onClick={() => handleNavigate("/calendario")}
                    >
                        Ver todos
                    </button>
                </div>

                <div className="divide-y divide-[#E7E0DC] p-4 rounded-2xl flex flex-col gap-3">
                    {isError && (
                        <p className="text-sm text-[#B3261E]">Erro ao carregar agendamentos.</p>
                    )}
                    {!isLoading && total === 0 && (
                        <p className="text-sm text-[#7C6169]">Nenhum agendamento para hoje.</p>
                    )}
                    {agendamentosOrdenados.map((ag) => (
                        <div key={ag.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="text-[#2B1820] font-medium">{ag.nomeCliente}</p>
                                <p className="text-xs text-[#7C6169]">
                                    
                                    {ag.servicos.join(" + ")}
                                </p>
                            </div>
                            <p className="text-sm text-[#292524]">{ag.horario.slice(0, 5)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}