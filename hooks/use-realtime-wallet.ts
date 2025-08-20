'use client'

import { useEffect, useState, useCallback } from 'react'
import { getStoredWallet, getStoredProposals, type StoredWallet, type StoredProposal } from '@/lib/local-storage'

interface UseRealtimeWalletReturn {
  wallet: StoredWallet | null
  proposals: StoredProposal[]
  pendingProposals: StoredProposal[]
  executedProposals: StoredProposal[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useRealtimeWallet(walletId: string): UseRealtimeWalletReturn {
  const [wallet, setWallet] = useState<StoredWallet | null>(null)
  const [proposals, setProposals] = useState<StoredProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)

      // Load wallet data from local storage
      const walletData = getStoredWallet(walletId)
      if (!walletData) {
        setError('Wallet not found')
        return
      }
      setWallet(walletData)

      // Load proposals for this wallet
      const allProposals = getStoredProposals()
      const walletProposals = allProposals.filter(p => p.walletId === walletId)
      setProposals(walletProposals)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet data')
    } finally {
      setIsLoading(false)
    }
  }, [walletId])

  // Load data on mount and when walletId changes
  useEffect(() => {
    loadData()
  }, [loadData])

  // Listen for storage changes to update data in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sui_multisig_wallets' || e.key === 'sui_multisig_proposals') {
        loadData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadData])

  // Filter proposals by status
  const pendingProposals = proposals.filter(p => p.status === 'pending')
  const executedProposals = proposals.filter(p => p.status === 'executed')

  return {
    wallet,
    proposals,
    pendingProposals,
    executedProposals,
    isLoading,
    error,
    refetch: loadData
  }
}
