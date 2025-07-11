
import { useQuery } from "@tanstack/react-query"
import { API_SERVER } from "../constants"
import type { Browser } from "../types/Browser"

export function useBrowsers() {
  return useQuery({
    queryKey: ['getCert'],
    queryFn: async (): Promise<Browser[]> => {
      const response = await fetch(`${API_SERVER}/browsers`)
      return (await response.json())
    },
  })
}
