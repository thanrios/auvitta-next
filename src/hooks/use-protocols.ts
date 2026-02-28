'use client'

import { useMemo } from 'react'
import { getLatestProtocols, useProtocolStore } from '@/lib/protocol-store'
import type { ProtocolFormInput, ProtocolFormVersion, ProtocolStatus } from '@/types/protocol.types'

export function useProtocols(search = '', status: 'all' | ProtocolStatus = 'all') {
  const hasHydrated = useProtocolStore((state) => state.hasHydrated)
  const protocols = useProtocolStore((state) => state.protocols)

  const latestProtocols = useMemo(() => getLatestProtocols(protocols), [protocols])

  const filteredProtocols = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return latestProtocols.filter((protocol) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        protocol.name.toLowerCase().includes(normalizedSearch) ||
        protocol.groupId.toLowerCase().includes(normalizedSearch)

      const matchesStatus = status === 'all' || protocol.status === status

      return matchesSearch && matchesStatus
    })
  }, [latestProtocols, search, status])

  return {
    protocols: filteredProtocols,
    hasHydrated,
  }
}

export function useProtocolById(protocolId: string | null): ProtocolFormVersion | null {
  return useProtocolStore((state) => {
    if (!protocolId) {
      return null
    }

    return state.getProtocolById(protocolId)
  })
}

export function useProtocolActions() {
  const createProtocol = useProtocolStore((state) => state.createProtocol)
  const createVersionFromProtocol = useProtocolStore((state) => state.createVersionFromProtocol)
  const toggleProtocolStatus = useProtocolStore((state) => state.toggleProtocolStatus)

  return {
    createProtocol: (input: ProtocolFormInput) => createProtocol(input),
    createVersionFromProtocol: (
      sourceProtocolId: string,
      input: Omit<ProtocolFormInput, 'status'>,
      nextStatus: ProtocolStatus
    ) => createVersionFromProtocol(sourceProtocolId, input, nextStatus),
    toggleProtocolStatus: (protocolId: string) => toggleProtocolStatus(protocolId),
  }
}
