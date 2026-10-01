import type { LucideIcon } from "lucide-react"

interface CardResumoProps {
    titulo: string
    subtitulo: string
    valor: string
    icone: LucideIcon
    cor: string
}

export const CardResumo = ({ titulo, subtitulo, valor, icone: Icone, cor }: CardResumoProps) => {
    return (
        <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: `${cor}14` }}
        >
            <div className="flex items-start gap-3">
                <Icone size={24} style={{ color: cor }} />
                <div>
                    <h3 className="text-sm font-medium text-ink">{titulo}</h3>
                    <p className="text-xs text-ink/60">({subtitulo})</p>
                </div>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-ink text-center">{valor}</h2>
        </div>
    )
}