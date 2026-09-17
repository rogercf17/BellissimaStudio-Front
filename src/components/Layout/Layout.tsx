import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";

export default function Layout() {
    return(
        <div className="flex bg-[#FAF7F4] min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}