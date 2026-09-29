import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Layout() {
    const [menuAberto, setMenuAberto] = useState(false)

    useEffect(() => {
        if (!menuAberto) return

        const fecharComEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuAberto(false)
        }
        window.addEventListener("keydown", fecharComEsc)
        return () => window.removeEventListener("keydown", fecharComEsc)
    }, [menuAberto])

    return(
        <div className="flex bg-pearl min-h-dvh">
            <Sidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center gap-3 bg-bordeaux px-4 py-3 text-white lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMenuAberto(true)}
                        aria-label="Abrir menu"
                        aria-expanded={menuAberto}
                        className="-ml-1 cursor-pointer rounded-lg p-2 transition hover:bg-white/10"
                    >
                        <Menu size={22} />
                    </button>
                    <span className="font-serif text-2xl leading-none">Bellíssima</span>
                    <span className="text-[10px] tracking-[0.35em] text-champagne">STUDIO</span>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}