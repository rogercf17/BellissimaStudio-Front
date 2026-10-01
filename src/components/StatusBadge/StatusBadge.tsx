import type { StatusPagamento } from "../../interface/FinanceiroData"

interface StatusBadgeProps {
    status: StatusPagamento
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const pago = status === "PAGO"

    return (
        <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                pago ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
            }`}
        >
            {pago ? "Pago" : "Pendente"}
        </span>
    )
}