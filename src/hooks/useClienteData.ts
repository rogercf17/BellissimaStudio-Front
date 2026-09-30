import axios from "axios"
import type { ClienteData } from "../interface/ClienteData"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const fetchData = async (): Promise<ClienteData[]> => {
    const response = await axios.get<ClienteData[]>(`${API_URL}/clientes`)
    return response.data
}

export default function useClienteData() {
    const query = useQuery({
        queryKey: ["cliente-data"],
        queryFn: fetchData,
        retry: 2
    })

    return query
}