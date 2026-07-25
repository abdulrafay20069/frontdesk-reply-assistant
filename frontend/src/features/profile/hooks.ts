import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBusinessProfile, updateBusinessProfile } from './api'
import type { BusinessProfilePayload } from '../../types'

export function useBusinessProfile() {
  return useQuery({
    queryKey: ['business-profile'],
    queryFn: fetchBusinessProfile,
  })
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BusinessProfilePayload) => updateBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] })
    },
  })
}
