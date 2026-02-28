'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type {
  SessionDraft,
  SessionDraftFile,
  SessionDraftProtocol,
  SessionEvolutionStatus,
  SessionFileCategory,
  SessionProtocolType,
  SessionType,
} from '@/types/session.types'

interface SessionDraftStoreState {
  drafts: Record<string, SessionDraft>
  hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
  ensureDraft: (patientId: string) => void
  updateDraft: (patientId: string, updates: Partial<SessionDraft>) => void
  startSession: (patientId: string) => void
  finishSession: (patientId: string) => void
  addProtocol: (patientId: string, protocolType: SessionProtocolType) => void
  updateProtocol: (
    patientId: string,
    protocolId: string,
    updates: Partial<Pick<SessionDraftProtocol, 'protocolType' | 'content'>>
  ) => void
  removeProtocol: (patientId: string, protocolId: string) => void
  addFiles: (patientId: string, files: Array<{ fileName: string; sizeKb: number; category: SessionFileCategory }>) => void
  removeFile: (patientId: string, fileId: string) => void
  updateFileCategory: (patientId: string, fileId: string, category: SessionFileCategory) => void
  setEvolutionEnabled: (patientId: string, enabled: boolean) => void
  setEvolutionProgress: (patientId: string, progress: number) => void
  setEvolutionStatus: (patientId: string, status: SessionEvolutionStatus) => void
  saveDraft: (patientId: string) => void
  resetDraft: (patientId: string) => void
}

function generateId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${randomPart}`
}

function createDefaultDraft(): SessionDraft {
  return {
    sessionName: '',
    sessionType: 'session',
    isSessionRunning: false,
    isCompleted: false,
    sessionStartedAt: null,
    elapsedSeconds: 0,
    notes: '',
    protocols: [],
    files: [],
    hasEvolution: false,
    evolutionProgress: 10,
    evolutionStatus: 'not_started',
    lastSavedAt: null,
  }
}

function ensureDraftValue(drafts: Record<string, SessionDraft>, patientId: string): SessionDraft {
  return drafts[patientId] ?? createDefaultDraft()
}

export function getCurrentElapsedSeconds(draft: SessionDraft): number {
  if (!draft.isSessionRunning || !draft.sessionStartedAt) {
    return draft.elapsedSeconds
  }

  const runningSeconds = Math.floor((Date.now() - draft.sessionStartedAt) / 1000)
  return draft.elapsedSeconds + runningSeconds
}

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':')
}

export const useSessionDraftStore = create<SessionDraftStoreState>()(
  persist(
    (set) => ({
      drafts: {},
      hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated })
      },

      ensureDraft: (patientId) => {
        set((state) => {
          if (state.drafts[patientId]) {
            return state
          }

          return {
            drafts: {
              ...state.drafts,
              [patientId]: createDefaultDraft(),
            },
          }
        })
      },

      updateDraft: (patientId, updates) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                ...updates,
              },
            },
          }
        })
      },

      startSession: (patientId) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          if (current.isSessionRunning) {
            return state
          }

          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                isSessionRunning: true,
                isCompleted: false,
                sessionStartedAt: Date.now(),
              },
            },
          }
        })
      },

      finishSession: (patientId) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          if (!current.isSessionRunning) {
            return state
          }

          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                isSessionRunning: false,
                isCompleted: true,
                elapsedSeconds: getCurrentElapsedSeconds(current),
                sessionStartedAt: null,
              },
            },
          }
        })
      },

      addProtocol: (patientId, protocolType) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          const newProtocol: SessionDraftProtocol = {
            id: generateId('protocol'),
            protocolType,
            content: '',
            createdAt: new Date().toISOString(),
          }

          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                protocols: [...current.protocols, newProtocol],
              },
            },
          }
        })
      },

      updateProtocol: (patientId, protocolId, updates) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                protocols: current.protocols.map((protocol) =>
                  protocol.id === protocolId
                    ? {
                        ...protocol,
                        ...updates,
                      }
                    : protocol
                ),
              },
            },
          }
        })
      },

      removeProtocol: (patientId, protocolId) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                protocols: current.protocols.filter((protocol) => protocol.id !== protocolId),
              },
            },
          }
        })
      },

      addFiles: (patientId, files) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          const normalizedFiles: SessionDraftFile[] = files.map((file) => ({
            id: generateId('file'),
            fileName: file.fileName,
            category: file.category,
            sizeKb: file.sizeKb,
            createdAt: new Date().toISOString(),
          }))

          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                files: [...current.files, ...normalizedFiles],
              },
            },
          }
        })
      },

      removeFile: (patientId, fileId) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                files: current.files.filter((file) => file.id !== fileId),
              },
            },
          }
        })
      },

      updateFileCategory: (patientId, fileId, category) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                files: current.files.map((file) =>
                  file.id === fileId
                    ? {
                        ...file,
                        category,
                      }
                    : file
                ),
              },
            },
          }
        })
      },

      setEvolutionEnabled: (patientId, enabled) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                hasEvolution: enabled,
              },
            },
          }
        })
      },

      setEvolutionProgress: (patientId, progress) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                evolutionProgress: progress,
              },
            },
          }
        })
      },

      setEvolutionStatus: (patientId, status) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                evolutionStatus: status,
              },
            },
          }
        })
      },

      saveDraft: (patientId) => {
        set((state) => {
          const current = ensureDraftValue(state.drafts, patientId)
          return {
            drafts: {
              ...state.drafts,
              [patientId]: {
                ...current,
                lastSavedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      resetDraft: (patientId) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [patientId]: createDefaultDraft(),
          },
        }))
      },
    }),
    {
      name: 'session-draft-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export function mapSessionTypeToLabel(type: SessionType, labels: Record<SessionType, string>): string {
  return labels[type]
}

export function mapProtocolTypeToLabel(
  type: SessionProtocolType,
  labels: Record<SessionProtocolType, string>
): string {
  return labels[type]
}

export function mapFileCategoryToLabel(
  category: SessionFileCategory,
  labels: Record<SessionFileCategory, string>
): string {
  return labels[category]
}
