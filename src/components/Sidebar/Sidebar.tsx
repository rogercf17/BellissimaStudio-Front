import { Calendar, Home, Plus, User, X } from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Calendário', icon: Calendar, path: '/calendario' },
    { label: 'Criar Agendamento', icon: Plus, path: '/criar' },
    { label: 'Clientes', icon: User, path: '/clientes' },
]

interface SidebarProps {
    aberto: boolean
    onFechar(): void
}

export const Sidebar = ({ aberto, onFechar }: SidebarProps) => {
    return(
        <>
            <div
                onClick={onFechar}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-bordeaux-deep/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
                    aberto ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />

            <aside
                className={`fixed top-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col overflow-y-auto bg-bordeaux text-blush transition-[transform,visibility] duration-200 lg:visible lg:sticky lg:z-auto lg:translate-x-0 ${
                    aberto ? 'visible translate-x-0' : 'invisible -translate-x-full'
                }`}
            >
                <div className="relative px-6 py-8 border-b border-white/10">
                    <h1 className="font-serif text-3xl text-white leading-none">Bellíssima</h1>
                    <p className="mt-2 text-xs tracking-[0.35em] text-champagne">STUDIO</p>

                    <button
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar menu"
                        className="absolute right-3 top-3 cursor-pointer rounded-lg p-2 text-blush-deep transition hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav aria-label="Principal" className="mt-4 flex flex-col gap-1 px-3">
                    {menuItems.map(({ label, icon: Icon, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={onFechar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm transition border-l-2 ${
                                    isActive
                                    ? 'bg-bordeaux-dark text-white font-medium border-champagne'
                                    : 'text-blush-deep border-transparent hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-6 py-5 border-t border-white/10 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bordeaux-dark text-champagne">
                        <User size={16} />
                    </span>
                    <span className="text-sm text-white">Administrador</span>
                </div>
            </aside>
        </>
    )
}