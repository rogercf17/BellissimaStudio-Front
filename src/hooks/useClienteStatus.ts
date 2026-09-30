import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

interface AlterarStatusParams {
    id: number
    ativo: boolean
}

const alterarStatus = async ({ id, ativo }: AlterarStatusParams): Promise<void> => {
    await axios.patch(`${API_URL}/cliente/${id}/status`, { ativo })
}

export default function useClienteStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: alterarStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cliente-data"] })
        },
        onError: (error) => {
            console.error("Erro ao alterar status da cliente:", error)
        },
    })
}