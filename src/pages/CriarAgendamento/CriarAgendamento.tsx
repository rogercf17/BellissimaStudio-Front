import React, { useEffect, useState } from "react"
import { SERVICOS, type AgendamentoData, type ServicoEnum } from "../../interface/AgendamentoData"
import useAgendamentoMutate from "../../hooks/UseAgendamentoMutate"

export default function CriarAgendamento() {
    const [nomeCliente, setNomeCliente] = useState("")
    const [data, setData] = useState("")
    const [horario, setHorario] = useState("")
    const [servicos, setServicos] = useState<ServicoEnum[]>([])

    function toggleServico(servico: ServicoEnum) {
        setServicos((prev) =>
            prev.includes(servico)
                ? prev.filter((s) => s !== servico)
                : [...prev, servico]
        )
    }

    const { mutate, isSuccess, isPending } = useAgendamentoMutate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const agendamentoData: AgendamentoData = {
            nomeCliente, 
            data,
            horario,
            servicos
        }

        mutate(agendamentoData)

        setNomeCliente("")
        setData("")
        setHorario("")
        setServicos([])
    }

    useEffect(() => {
        if (!isSuccess) return
    }, [isSuccess])

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">
                    Criar Agendamento
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Nome da cliente
                        </label>
                        <input 
                            type="text" 
                            value={nomeCliente} 
                            placeholder="Nome da cliente"
                            onChange={(e) => setNomeCliente(e.target.value)} 
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-gray-700">Data</label>
                            <input 
                                type="date" 
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-gray-700">Horário</label>
                            <input 
                                type="time" 
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                    
                    <label className="text-sm font-medium text-gray-700">
                        Serviço(s):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {SERVICOS.map((servico) => {
                            const selecionado = servicos.includes(servico)
                            return(
                                <label 
                                    key={servico}
                                    className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${
                                        selecionado
                                            ? "border-rose-400 bg-rose-50 text-rose-700"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={servicos.includes(servico)}
                                        onChange={() => toggleServico(servico)}
                                        className="accent-rose-500"
                                    />
                                    {servico}
                                </label>
                            )
                        })}
                    </div>
                    <button 
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full mt-2 rounded-lg bg-rose-500 text-white text-sm font-medium py-2.5 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {isPending ? 'Criando...' : 'Criar'}
                    </button>
                </form>
            </div>
        </div>
    )
}