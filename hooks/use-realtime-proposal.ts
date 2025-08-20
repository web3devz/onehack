'use client'

import { useEffect, useState, useCallback } from 'react'
import { getStoredProposal, type StoredProposal } from '@/lib/local-storage'
import { toast } from 'sonner'

interface UseRealtimeProposalReturn {
  proposal: StoredProposal | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useRealtimeProposal(proposalId: string | null): UseRealtimeProposalReturn {
  const [proposal, setProposal] = useState<StoredProposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProposal = useCallback(() => {
    if (!proposalId) {
      setProposal(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const proposalData = getStoredProposal(proposalId)
      if (!proposalData) {
        setError('Proposal not found')
        return
      }

      setProposal(proposalData)
    } catch (err) {
      console.error('Error fetching proposal:', err)
      setError(err instanceof Error ? err.message : 'Failed to load proposal')
      toast.error('Failed to load proposal')
    } finally {
      setIsLoading(false)
    }
  }, [proposalId])

  useEffect(() => {
    fetchProposal()
  }, [fetchProposal])

  // Listen for storage changes to update proposal in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sui_multisig_proposals') {
        fetchProposal()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchProposal])

  return {
    proposal,
    isLoading,
    error,
    refetch: fetchProposal
  }
}
