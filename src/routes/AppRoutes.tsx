import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Layout from "../components/Layout/Layout";
import Calendario from "../pages/Calendario/Calendario";
import CriarAgendamento from "../pages/CriarAgendamento/CriarAgendamento";

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/criar" element={<CriarAgendamento />} />
            </Route>
        </Routes>
    )
}