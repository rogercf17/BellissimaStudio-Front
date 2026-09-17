import { useEffect, useState } from "react"
import { SERVICOS, type AgendamentoData, type ServicoEnum } from "../../interface/AgendamentoData"
import useAgendamentoUpdate from "../../hooks/useAgendamentoUpdate"

interface CreateModalProps {
    agendamento: AgendamentoData
    closeModal(): void
}

export default function CreateModal({ agendamento, closeModal }: CreateModalProps) {
    const [nomeCliente, setNomeCliente] = useState(agendamento.nomeCliente)
    const [data, setData] = useState(agendamento.data)
    const [horario, setHorario] = useState(agendamento.horario)
    const [servicos, setServicos] = useState<ServicoEnum[]>(() => {
        if (!agendamento.servicos) return []
        
        return agendamento.servicos.map(s => 
            s.toUpperCase().replace(/\s+/g, '_') as ServicoEnum
        )
    })

    function toggleServico(servico: ServicoEnum) {
        setServicos((prev) =>
            prev.includes(servico)
                ? prev.filter((s) => s !== servico)
                : [...prev, servico]
        )
    }

    const { mutate, isSuccess, isPending, isError } = useAgendamentoUpdate()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (typeof agendamento.id !== "number") return

        mutate({
            id: agendamento.id,
            data: { nomeCliente, data, horario, servicos }
        })
    }

    useEffect(() => {
        if (!isSuccess) return
        closeModal()
    }, [isSuccess])

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#EDE3DC] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-serif text-xl text-[#2B2420]">
                    Editar Agendamento
                </h1>
                <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer text-[#9A8B80] hover:text-[#2B2420] transition"
                    aria-label="Fechar"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#2B2420]">
                        Nome da cliente
                    </label>
                    <input
                        type="text"
                        value={nomeCliente}
                        placeholder="Nome da cliente"
                        onChange={(e) => setNomeCliente(e.target.value)}
                        className="rounded-lg border border-[#EDE3DC] px-3 py-2 text-sm text-[#2B2420] placeholder:text-[#B8ACA1] focus:outline-none focus:ring-2 focus:ring-[#B5675D] focus:border-transparent transition"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#2B2420]">Data</label>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="rounded-lg border border-[#EDE3DC] px-3 py-2 text-sm text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#B5675D] focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#2B2420]">Horário</label>
                        <input
                            type="time"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            className="rounded-lg border border-[#EDE3DC] px-3 py-2 text-sm text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#B5675D] focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#2B2420]">
                        Serviço(s)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {SERVICOS.map((servico) => {
                            const selecionado = servicos.includes(servico)
                            return (
                                <label
                                    key={servico}
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${
                                        selecionado
                                            ? "border-[#B5675D] bg-[#FBF7F3] text-[#B5675D] font-medium"
                                            : "border-[#EDE3DC] text-[#2B2420] hover:bg-[#FBF7F3]"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selecionado}
                                        onChange={() => toggleServico(servico)}
                                        className="h-4 w-4 rounded border-[#D9CFC5] text-[#B5675D] focus:ring-[#B5675D] focus:ring-offset-0"
                                    />
                                    {servico}
                                </label>
                            )
                        })}
                    </div>
                </div>

                {isError && (
                    <p className="text-sm text-red-500">
                        Não foi possível salvar as mudanças. Tente novamente.
                    </p>
                )}

                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="cursor-pointer flex-1 rounded-lg border border-[#EDE3DC] text-[#2B2420] text-sm font-medium py-2.5 hover:bg-[#FBF7F3] transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer flex-1 rounded-lg bg-[#B5675D] text-white text-sm font-medium py-2.5 hover:bg-[#9C564D] disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {isPending ? "Editando..." : "Editar"}
                    </button>
                </div>
            </form>
        </div>
    )
}