import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchInquiries, fetchInquiry, createInquiry } from './api'
import type { CreateInquiryPayload } from '../../types'

export function useInquiries(status?: string) {
  return useQuery({
    queryKey: ['inquiries', status],
    queryFn: () => fetchInquiries(status),
  })
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => fetchInquiry(id),
    enabled: !!id,
  })
}

export function useCreateInquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInquiryPayload) => createInquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })
}
