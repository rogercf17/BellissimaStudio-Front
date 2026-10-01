import { useState } from "react"
import { TrendingUp } from "lucide-react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { useFaturamento } from "../../hooks/useFinanceiroData"
import type { PeriodoGrafico } from "../../interface/FinanceiroData"

const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const formatarData = (iso: string) => {
    const [ano, mes, dia] = iso.split("-")
    return `${dia}/${mes}/${ano}`
}
const formatarDiaMes = (iso: string) => {
    const [, mes, dia] = iso.split("-")
    return `${dia}/${mes}`
}
const periodos: { chave: PeriodoGrafico; rotulo: string; titulo: string }[] = [
    { chave: "7d", rotulo: "7 dias", titulo: "Últimos 7 dias" },
    { chave: "30d", rotulo: "30 dias", titulo: "Últimos 30 dias" },
    { chave: "3m", rotulo: "3 meses", titulo: "Últimos 3 meses" },
]
const COR = "#691B37"

export const GraficoFaturamento = () => {
    const [periodo, setPeriodo] = useState<PeriodoGrafico>("7d")
    const { data, isLoading, isError } = useFaturamento(periodo)

    const dados = data ?? []
    const total = dados.reduce((acc, p) => acc + p.total, 0)
    const titulo = periodos.find((p) => p.chave === periodo)?.titulo

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-bordeaux">
                    <TrendingUp size={22} className="shrink-0" />
                    <div>
                        <h2 className="font-serif text-xl text-ink sm:text-2xl">
                            Faturamento · {titulo}
                        </h2>
                        <p className="text-xs text-ink/60">
                            Total no período: {formatarMoeda(total)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {periodos.map(({ chave, rotulo }) => (
                        <button
                            key={chave}
                            onClick={() => setPeriodo(chave)}
                            aria-pressed={periodo === chave}
                            className={`flex-1 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:flex-none ${
                                periodo === chave
                                    ? "bg-bordeaux text-white"
                                    : "bg-bordeaux/5 text-ink/70 hover:bg-bordeaux/10"
                            }`}
                        >
                            {rotulo}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-56 w-full sm:h-72">
                {isLoading ? (
                    <p className="flex h-full items-center justify-center text-sm text-ink/60">
                        Carregando gráfico...
                    </p>
                ) : isError ? (
                    <p className="flex h-full items-center justify-center text-sm text-danger">
                        Não foi possível carregar o faturamento.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradienteFaturamento" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COR} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={COR} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000014" />

                            <XAxis
                                dataKey="data"
                                tickFormatter={formatarDiaMes}
                                tick={{ fontSize: 11, fill: "#6b6b6b" }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={24}
                            />

                            <YAxis
                                tickFormatter={(v: number) =>
                                    `R$ ${v.toLocaleString("pt-BR", { notation: "compact" })}`
                                }
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />

                            <Tooltip
                                formatter={(valor) => [formatarMoeda(Number(valor)), "Faturamento"]}
                                labelFormatter={(d) => formatarData(String(d))}
                                contentStyle={{ borderRadius: 12, fontSize: 12 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={COR}
                                strokeWidth={2}
                                fill="url(#gradienteFaturamento)"
                                dot={periodo === "7d" ? { r: 3, fill: COR } : false}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}