import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateDraft, updateDraft, approveReply, sendReply } from './api'

export function useGenerateDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (inquiryId: string) => generateDraft(inquiryId),
    onSuccess: (_data, inquiryId) => {
      queryClient.invalidateQueries({ queryKey: ['inquiry', inquiryId] })
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })
}

export function useUpdateDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ replyId, draftText }: { replyId: string; draftText: string }) =>
      updateDraft(replyId, draftText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiry'] })
    },
  })
}

export function useApproveReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (replyId: string) => approveReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiry'] })
    },
  })
}

export function useSendReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (replyId: string) => sendReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiry'] })
    },
  })
}
