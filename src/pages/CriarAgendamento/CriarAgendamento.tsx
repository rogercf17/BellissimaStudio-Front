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
        <div className="px-0 py-2 sm:px-2 sm:py-4">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-line p-5 sm:p-8">
                <h1 className="font-serif text-2xl sm:text-3xl text-bordeaux mb-6">
                    Criar Agendamento
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-ink">
                            Nome da cliente
                        </label>
                        <input 
                            type="text" 
                            value={nomeCliente} 
                            placeholder="Nome da cliente"
                            onChange={(e) => setNomeCliente(e.target.value)} 
                            className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col gap-4 min-[420px]:flex-row">
                        <div className="flex flex-col gap-1.5 min-w-0 min-[420px]:flex-1">
                            <label className="text-sm font-medium text-ink">Data</label>
                            <input 
                                type="date" 
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-0 min-[420px]:flex-1">
                            <label className="text-sm font-medium text-ink">Horário</label>
                            <input 
                                type="time" 
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-transparent transition"
                            />
                        </div>
                    </div>
                    
                    <label className="text-sm font-medium text-ink">
                        Serviço(s):
                    </label>
                    <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
                        {SERVICOS.map((servico) => {
                            const selecionado = servicos.includes(servico)
                            return(
                                <label 
                                    key={servico}
                                    className={`flex items-center gap-1 rounded-lg border px-3 py-2.5 sm:py-2 text-sm cursor-pointer transition ${
                                        selecionado
                                            ? "border-bordeaux bg-blush text-bordeaux font-medium"
                                            : "border-line text-ink hover:bg-pearl"
                                    }`}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={servicos.includes(servico)}
                                        onChange={() => toggleServico(servico)}
                                        className="h-5 w-5 sm:h-4 sm:w-4 rounded border-line text-bordeaux focus:ring-bordeaux focus:ring-offset-0"
                                    />
                                    {servico}
                                </label>
                            )
                        })}
                    </div>
                    <button 
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full mt-2 rounded-lg bg-bordeaux text-white text-sm font-medium py-3 sm:py-2.5 hover:bg-bordeaux-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {isPending ? 'Criando...' : 'Criar'}
                    </button>
                </form>
            </div>
        </div>
    )
}