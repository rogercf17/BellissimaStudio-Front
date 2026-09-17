import { Calendar, Home, Plus, Settings, User } from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Calendário', icon: Calendar, path: '/calendario' },
    { label: 'Criar Agendamento', icon: Plus, path: '/criar' },
    { label: 'Configurações', icon: Settings, path: '/configuracoes' },
]

export const Sidebar = () => {
    return(
        <aside className="w-64 h-screen bg-white border-r border-[#E7E0DC] flex flex-col">
            <div>
                <div className="px-6 py-8 border-b border-[#E7E0DC]">
                    <h1 className="font-serif text-xl text-[#292524]">Bellíssima</h1>
                    <p className="text-xs tracking-widest text-[#78716C]">STUDIO</p>
                </div>
            </div>

            <div>
                <nav className="mt-4 flex flex-col gap-1 px-3">
                    {menuItems.map(({ label, icon: Icon, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                                    isActive
                                    ? 'bg-[#F3DEDE] text-[#C98989] font-medium'
                                    : 'text-[#78716C] hover:bg-[#FAF7F4]'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="px-6 py-5 border-t border-[#E7E0DC] flex items-center gap-2 fixed bottom-0">
                <User size={18} className="text-[##78716C]" />
                <span className="text-sm text-[#292524]">Admistrador</span>
            </div>
        </aside>
    )
}