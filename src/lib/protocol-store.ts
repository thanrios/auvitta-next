'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type {
  ProtocolBlock,
  ProtocolFormInput,
  ProtocolFormVersion,
  ProtocolStatus,
} from '@/types/protocol.types'

interface ProtocolStoreState {
  protocols: ProtocolFormVersion[]
  hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
  createProtocol: (input: ProtocolFormInput) => ProtocolFormVersion
  createVersionFromProtocol: (
    sourceProtocolId: string,
    input: Omit<ProtocolFormInput, 'status'>,
    nextStatus: ProtocolStatus
  ) => ProtocolFormVersion | null
  toggleProtocolStatus: (protocolId: string) => void
  getProtocolById: (protocolId: string) => ProtocolFormVersion | null
}

function generateId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${randomPart}`
}

function cloneBlocks(blocks: ProtocolBlock[]): ProtocolBlock[] {
  return blocks.map((block) => ({
    ...block,
    options: block.options?.map((option) => ({ ...option })) ?? undefined,
  }))
}

function sortByCreatedAtDesc(protocols: ProtocolFormVersion[]): ProtocolFormVersion[] {
  return [...protocols].sort(
    (protocolA, protocolB) =>
      new Date(protocolB.createdAt).getTime() - new Date(protocolA.createdAt).getTime()
  )
}

function createInitialProtocols(): ProtocolFormVersion[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'protocol-seed-1-v1',
      groupId: 'protocol-seed-1',
      version: 1,
      name: 'Initial Speech Assessment',
      notes: 'Base form for first speech-language pathology intake.',
      status: 'active',
      blocks: [
        {
          id: generateId('block'),
          type: 'section-title',
          label: 'Patient Identification',
        },
        {
          id: generateId('block'),
          type: 'text',
          label: 'Main complaint',
          required: true,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'protocol-seed-2-v1',
      groupId: 'protocol-seed-2',
      version: 1,
      name: 'Motor Coordination Follow-up',
      notes: 'Used on periodic follow-up sessions.',
      status: 'inactive',
      blocks: [
        {
          id: generateId('block'),
          type: 'section-title',
          label: 'Session Follow-up',
        },
        {
          id: generateId('block'),
          type: 'single-select',
          label: 'Progress perception',
          options: [
            { id: generateId('opt'), label: 'No change' },
            { id: generateId('opt'), label: 'Small improvement' },
            { id: generateId('opt'), label: 'Significant improvement' },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function keepOnlyLatestVersions(protocols: ProtocolFormVersion[]): ProtocolFormVersion[] {
  const latestByGroup = new Map<string, ProtocolFormVersion>()

  for (const protocol of protocols) {
    const currentLatest = latestByGroup.get(protocol.groupId)
    if (!currentLatest || protocol.version > currentLatest.version) {
      latestByGroup.set(protocol.groupId, protocol)
    }
  }

  return sortByCreatedAtDesc(Array.from(latestByGroup.values()))
}

export function getLatestProtocols(protocols: ProtocolFormVersion[]): ProtocolFormVersion[] {
  return keepOnlyLatestVersions(protocols)
}

export const useProtocolStore = create<ProtocolStoreState>()(
  persist(
    (set, get) => ({
      protocols: createInitialProtocols(),
      hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated })
      },

      createProtocol: (input) => {
        const now = new Date().toISOString()
        const protocolId = generateId('protocol')
        const groupId = generateId('protocol-group')

        const newProtocol: ProtocolFormVersion = {
          id: protocolId,
          groupId,
          version: 1,
          name: input.name,
          notes: input.notes,
          status: input.status,
          blocks: cloneBlocks(input.blocks),
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          protocols: sortByCreatedAtDesc([...state.protocols, newProtocol]),
        }))

        return newProtocol
      },

      createVersionFromProtocol: (sourceProtocolId, input, nextStatus) => {
        const state = get()
        const sourceProtocol = state.protocols.find((protocol) => protocol.id === sourceProtocolId)

        if (!sourceProtocol) {
          return null
        }

        const nextVersion = sourceProtocol.version + 1
        const now = new Date().toISOString()

        const newVersion: ProtocolFormVersion = {
          id: generateId('protocol'),
          groupId: sourceProtocol.groupId,
          version: nextVersion,
          name: input.name,
          notes: input.notes,
          status: nextStatus,
          blocks: cloneBlocks(input.blocks),
          supersedesId: sourceProtocol.id,
          createdAt: now,
          updatedAt: now,
        }

        const updatedProtocols = state.protocols.map((protocol) => {
          if (protocol.groupId !== sourceProtocol.groupId) {
            return protocol
          }

          if (protocol.id === sourceProtocol.id) {
            return {
              ...protocol,
              status: 'inactive',
              updatedAt: now,
            }
          }

          if (nextStatus === 'active' && protocol.status === 'active') {
            return {
              ...protocol,
              status: 'inactive',
              updatedAt: now,
            }
          }

          return protocol
        })

        set({
          protocols: sortByCreatedAtDesc([...updatedProtocols, newVersion]),
        })

        return newVersion
      },

      toggleProtocolStatus: (protocolId) => {
        set((state) => {
          const targetProtocol = state.protocols.find((protocol) => protocol.id === protocolId)
          if (!targetProtocol) {
            return state
          }

          const nextStatus: ProtocolStatus = targetProtocol.status === 'active' ? 'inactive' : 'active'
          const now = new Date().toISOString()

          return {
            protocols: state.protocols.map((protocol) => {
              if (protocol.id === protocolId) {
                return {
                  ...protocol,
                  status: nextStatus,
                  updatedAt: now,
                }
              }

              if (
                nextStatus === 'active' &&
                protocol.groupId === targetProtocol.groupId &&
                protocol.id !== protocolId &&
                protocol.status === 'active'
              ) {
                return {
                  ...protocol,
                  status: 'inactive',
                  updatedAt: now,
                }
              }

              return protocol
            }),
          }
        })
      },

      getProtocolById: (protocolId) => {
        return get().protocols.find((protocol) => protocol.id === protocolId) ?? null
      },
    }),
    {
      name: 'protocol-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        protocols: state.protocols,
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { protocols: createInitialProtocols() }
        }

        const typedState = persistedState as { protocols?: ProtocolFormVersion[] }
        const persistedProtocols = typedState.protocols

        if (!persistedProtocols || persistedProtocols.length === 0) {
          return { protocols: createInitialProtocols() }
        }

        return {
          protocols: sortByCreatedAtDesc(persistedProtocols),
        }
      },
    }
  )
)
