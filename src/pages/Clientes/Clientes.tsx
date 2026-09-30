import { Filter, Pencil, Search } from "lucide-react"
import useClienteData from "../../hooks/useClienteData"
import { useMemo, useState } from "react"
import { CreateModalCliente } from "../../components/CreateModalCliente/CreateModalCliente"

function Status({ ativo }: { ativo: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${ativo ? "bg-green-500" : "bg-gray-400"}`} />
            {ativo ? "Ativo" : "Inativo"}
        </span>
    )
}


export default function Clientes() {
    const { data: data, isLoading, isError } = useClienteData()
    const clientes = data ?? []

    const [busca, setBusca] = useState("")
    const [status, setStatus] = useState<"todos" | "ativas" | "inativas">("todos")
    const [ordem, setOrdem] = useState<"nome" | "recente">("nome")
    const [selecionadoId, setSelecionadoId] = useState<number | string | null>(null)

    const ultimoAtendimento = (c: (typeof clientes)[number]) => 
        [...(c.agendamentos ?? [])].sort((a, b) => +new Date(b.data) - +new Date(a.data))[0]

    const filtrados = useMemo(() => {
        const termo = busca.toLowerCase()

        return clientes.filter((c) => 
            c.nome?.toLowerCase().includes(termo)
        )
        .filter((c) => status === "todos" || (status === "ativas" ? c.ativo : !c.ativo))
        .sort((a, b) => {
            if (ordem === "nome") return a.nome.localeCompare(b.nome)
            const da = ultimoAtendimento(a)?.data, db = ultimoAtendimento(b)?.data
            return +new Date(db ?? 0) - +new Date(da ?? 0)
        })
    }, [clientes, busca, status, ordem])

    const selecionado = filtrados.find((c) => c.id === selecionadoId) ?? filtrados[0]

    const limparFiltros = () => { setBusca(""); setStatus("todos"); setOrdem("nome") }

    const selectClass = "h-11 rounded-xl border border-line bg-white px-3 " +
    "text-sm text-ink focus:outline-none focus:ring-2 focus:ring-bordeaux/30"

    const [modalAberto, setModalAberto] = useState(false)
    const [clienteEditando, setClienteEditando] = useState<typeof clientes[number] | undefined>()

    const abrirNovo = () => { setClienteEditando(undefined); setModalAberto(true) }
    const abrirEdicao = () => { setClienteEditando(selecionado); setModalAberto(true) }
    const fecharModal = () => setModalAberto(false)

    return(
        <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-bordeaux">Clientes</h1>
            <p className="font-serif text-xl sm:text-2xl text-ink mb-4">Gerencie os clientes do seu salão.</p>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 sm:gap-6">
                <section className="bg-white rounded-2xl shadow-sm border border-line p-4 sm:p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bordeaux" />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar cliente por nome"
                                className="h-11 w-full rounded-xl border border-line pl-10 pr-3 text-sm text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-bordeaux/30"
                            />
                        </div>
                        <button 
                            className="h-11 inline-flex items-center justify-center gap-2 
                            rounded-xl bg-bordeaux px-5 text-sm font-medium text-white 
                            hover:opacity-90 transition cursor-pointer"
                            onClick={abrirNovo}
                        >
                            + Novo cliente
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value as "todos" | "ativas" | "inativas")} 
                            className={selectClass}
                        >
                            <option value="todos">Todos os status</option>
                            <option value="ativas">Ativas</option>
                            <option value="inativas">Inativas</option>
                        </select>
                        <select
                            value={ordem}
                            onChange={(e) => setOrdem(e.target.value as "nome" | "recente")}
                            className={selectClass}
                        >
                            <option value="nome">Ordenar por nome</option>
                            <option value="recente">Último atendimento</option>
                        </select>
                        <button 
                            onClick={limparFiltros}
                            className="inline-flex items-center gap-2 text-sm text-ink/70 
                            hover:text-bordeaux"
                        >
                            <Filter className="h-4 w-4" /> Limpar filtros
                        </button>
                    </div>

                    {isLoading && <p className="text-sm text-ink/60">Carregando...</p>}
                    {isError && <p className="text-sm text-red-600">Erro ao carregar clientes.</p>}

                    <div className="hidden md:grid grid-cols-[2fr_1.4fr_1.6fr_1fr_1.2fr] gap-3 px-3 text-xs text-ink/60 border-b border-line pb-2">
                        <span>Cliente</span>
                        <span>Telefone</span>
                        <span>Último atendimento</span>
                        <span className="text-right">Status</span>
                    </div>

                    <ul className="flex flex-col">
                        {filtrados.map((c) => {
                            const ult = ultimoAtendimento(c)
                            const ativa = selecionado?.id === c.id
                            return (
                                <li
                                    key={c.id}
                                    onClick={() => { if (c.id !== undefined) setSelecionadoId(c.id) }}
                                    className={`grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1.6fr_1fr_1.2fr] gap-2 md:gap-3 items-center px-3 py-3 rounded-xl cursor-pointer border-b border-line/60 last:border-0 transition ${
                                        ativa ? "bg-bordeaux/5" : "hover:bg-bordeaux/5"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <p className="text-sm font-medium text-ink">{c.nome}</p>
                                    </div>

                                    <p className="text-sm text-ink">{c.telefone}</p>

                                    <div>
                                        {ult ? (
                                            <p className="text-sm text-ink">{ult.data}</p>
                                        ) : (
                                            <p className="text-sm text-ink/50">—</p>
                                        )}
                                    </div>

                                    <div><Status ativo={!!c.ativo} /></div>
                                </li>
                            )
                        })}
                        {!isLoading && filtrados.length === 0 && (
                            <li className="py-8 text-center text-sm text-ink/60">Nenhum cliente encontrado.</li>
                        )}
                    </ul>
                </section>

                {selecionado && (
                    <aside className="bg-white rounded-2xl shadow-sm border border-line p-4 sm:p-6 flex flex-col gap-5 h-fit lg:sticky lg:top-4">
                        <div className="relative flex items-center gap-4 rounded-2xl bg-bordeaux/5 p-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="font-serif text-xl text-bordeaux">{selecionado.nome}</h2>
                                    <Status ativo={!!selecionado.ativo} />
                                </div>
                                <p className="text-xs text-ink/70 mt-1">{selecionado.telefone}</p>
                                <button 
                                    className="absolute top-3 right-3 h-8 w-8 rounded-lg 
                                    border border-line bg-white flex items-center justify-center 
                                    text-bordeaux cursor-pointer"
                                    onClick={abrirEdicao}
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-line p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-ink">Atendimentos</h3>
                            </div>
                            <ul className="flex flex-col gap-2">
                                {(selecionado.agendamentos ?? []).map((a, i) => (
                                    <li key={i} className="flex justify-between text-xs text-ink/70">
                                        <span>{a.data}</span>
                                        <span>{a.servicos.join(" + ")}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                )}
            </div>
            {modalAberto && (
                <CreateModalCliente closeModal={fecharModal} cliente={clienteEditando} />
            )}
        </div>
    )
}