import axios from "axios"
import type { ClienteData } from "../interface/ClienteData"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

const salvarCliente = async (data: ClienteData): Promise<ClienteData> => {
    if (data.id) {
        const response = await axios.put<ClienteData>(
            `${API_URL}/cliente/atualizar/${data.id}`, data
        )
        return response.data
    }
    const response = await axios.post<ClienteData>(`${API_URL}/cliente`, data)
    return response.data
}

export default function useClienteMutate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: salvarCliente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cliente-data"] })
        },
        onError: (error) => {
            console.error("Erro ao salvar cliente:", error)
        },
    })
}