
import { useQuery } from "@tanstack/react-query"
import type { MitmLog } from "../types/Log"
import { API_SERVER } from "../constants"


export function useCertificate() {
  return useQuery({
    queryKey: ['getCert'],
    queryFn: async (): Promise<String> => {
      const response = await fetch(`${API_SERVER}/get-cert`)
      return await response.text()
    },
  })
}

export function useLog(id:string) {
  return useQuery({
    queryKey: ['log',id],
    queryFn: async (): Promise<MitmLog> => {
      const response = await fetch(`${API_SERVER}/log/${id}`)
      return await response.json()
    },
  })
}

export function useLogs() {
  return useQuery({
    queryKey: ['logs'],
    refetchInterval:500,
    queryFn: async (): Promise<Array<MitmLog>> => {
      const response = await fetch(`${API_SERVER}/logs`)
      return await response.json()
    },
  })
}