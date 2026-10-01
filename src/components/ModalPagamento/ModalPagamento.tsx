import { useState } from "react"
import { isAxiosError } from "axios"
import useRegistrarPagamento from "../../hooks/useRegistrarPagamento"
import {
    FORMAS_PAGAMENTO,
    ROTULO_FORMA,
    type FormaPagamento,
    type Pendente,
} from "../../interface/FinanceiroData"

interface ModalPagamentoProps {
    pendente: Pendente
    closeModal(): void
}

export const ModalPagamento = ({ pendente, closeModal }: ModalPagamentoProps) => {
    const [forma, setForma] = useState<FormaPagamento>("PIX")
    const [valor, setValor] = useState(String(pendente.valor))
    const { mutate, isPending, isError, error } = useRegistrarPagamento()

    const mensagemErro =
        isAxiosError(error) && error.response?.data
            ? Object.values(error.response.data).join(" ")
            : "Não foi possível registrar o pagamento. Tente novamente."

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate(
            { agendamentoId: pendente.agendamentoId, formaPagamento: forma, valor: Number(valor) },
            { onSuccess: closeModal }
        )
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
            onClick={closeModal}
        >
            <div
                className="w-full max-w-md rounded-t-2xl border border-line bg-white p-5 shadow-xl sm:rounded-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-xl text-bordeaux sm:text-2xl">Registrar pagamento</h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Fechar"
                        className="cursor-pointer text-muted transition hover:text-bordeaux"
                    >
                        ✕
                    </button>
                </div>

                <p className="mb-4 text-sm text-ink/70">
                    {pendente.cliente} · {pendente.servicos.join(" + ")}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-ink">Forma de pagamento</span>
                        <div className="grid grid-cols-2 gap-2">
                            {FORMAS_PAGAMENTO.map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    aria-pressed={forma === f}
                                    onClick={() => setForma(f)}
                                    className={`cursor-pointer rounded-lg border px-3 py-2.5 text-sm transition ${
                                        forma === f
                                            ? "border-bordeaux bg-blush font-medium text-bordeaux"
                                            : "border-line text-ink hover:bg-pearl"
                                    }`}
                                >
                                    {ROTULO_FORMA[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-ink">Valor (R$)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0.01"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            className="rounded-lg border border-line px-3 py-2 text-sm text-ink transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bordeaux"
                        />
                    </div>

                    {isError && <p className="text-sm text-danger">{mensagemErro}</p>}

                    <div className="mt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 cursor-pointer rounded-lg border border-line py-2.5 text-sm font-medium text-ink transition hover:bg-pearl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 cursor-pointer rounded-lg bg-bordeaux py-2.5 text-sm font-medium text-white transition hover:bg-bordeaux-dark disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Salvando..." : "Confirmar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}