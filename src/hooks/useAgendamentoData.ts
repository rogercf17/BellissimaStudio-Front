import axios from "axios"
import type { AgendamentoData } from "../interface/AgendamentoData"
import { useQuery } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

interface useAgendamentoDataProps {
    data: string
}

const fetchData = async (data: string): Promise<AgendamentoData[]> => {
    const response = await axios.get<AgendamentoData[]>(
        `${API_URL}/agendamento/data/${data}`,
        {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            params: { _t: Date.now() } 
        }
    )
    return response.data
}

export default function useAgendamentoData({ data }: useAgendamentoDataProps) {
    const query = useQuery({
        queryKey: ['agendamento-data', data],
        queryFn: () => fetchData(data),
        enabled: !!data,
        retry: 2,
        staleTime: 0,       
        gcTime: 0          
    })

    return query
}