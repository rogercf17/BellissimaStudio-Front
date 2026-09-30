import { useEffect, useState } from "react"
import useClienteMutate from "../../hooks/useClienteMutate"
import type { ClienteData } from "../../interface/ClienteData"
import useClienteStatus from "../../hooks/useClienteStatus"

interface CreateModalClienteProps {
    closeModal(): void
    cliente?: ClienteData 
}

export const CreateModalCliente = ({ closeModal, cliente }: CreateModalClienteProps) => {
    const editando = !!cliente
    const [nome, setNome] = useState(cliente?.nome ?? "")
    const [telefone, setTelefone] = useState(cliente?.telefone ?? "")
    const [ativo, setAtivo] = useState(cliente?.ativo ?? true)

    const { mutate: mutateStatus, isPending: statusPending } = useClienteStatus()

    const { mutate, isSuccess, isPending } = useClienteMutate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({ ...cliente, nome, telefone })
    }

    useEffect(() => {
        if (isSuccess) closeModal()
    }, [isSuccess])

    const inputClass =
        "w-full mt-1 px-3 py-2.5 rounded-lg border border-line bg-white text-ink " +
        "placeholder:text-muted/70 focus:outline-none focus:ring-2 " +
        "focus:ring-bordeaux focus:border-bordeaux transition"

    const handleToggleStatus = () => {
        if (cliente?.id === undefined) return

        const novoStatus = !ativo
        mutateStatus(
            { id: cliente.id, ativo: novoStatus },
            { onSuccess: () => setAtivo(novoStatus) }
        )
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={closeModal}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-line p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="font-serif text-2xl sm:text-3xl text-bordeaux">
                        {editando ? "Editar Cliente" : "Cadastrar Cliente"}
                    </h1>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="cursor-pointer text-muted hover:text-bordeaux transition"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-ink">Nome da cliente</label>
                        <input
                            type="text"
                            required
                            placeholder="Nome da cliente"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-ink">Telefone da cliente</label>
                        <input
                            type="tel"
                            required
                            placeholder="(11) 99999-9999"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    
                    {editando && (
                        <div className="flex items-center justify-between rounded-xl border border-line p-3">
                            <div>
                                <p className="text-sm font-medium text-ink">Status da cliente</p>
                                <span
                                    className={`inline-flex items-center gap-1.5 mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${ativo ? "bg-green-500" : "bg-gray-400"}`} />
                                    {ativo ? "Ativa" : "Inativa"}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                disabled={statusPending}
                                className={`h-10 px-4 rounded-xl border text-sm font-medium transition cursor-pointer disabled:opacity-60 ${
                                    ativo
                                        ? "border-line text-ink/70 hover:text-red-600 hover:border-red-300"
                                        : "border-bordeaux text-bordeaux hover:bg-bordeaux/5"
                                }`}
                            >
                                {statusPending ? "Alterando..." : ativo ? "Desativar" : "Ativar"}
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="h-11 px-5 rounded-xl border border-line text-sm 
                            text-ink hover:bg-bordeaux/5 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-11 px-5 rounded-xl bg-bordeaux text-sm font-medium 
                            text-white hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
                        >
                            {isPending ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}