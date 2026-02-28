export type SessionType = 'session' | 'evolution' | 'anamnesis'

export type SessionEvolutionStatus = 'not_started' | 'in_progress' | 'achieved'

export type SessionFileCategory = 'anamnesis' | 'report' | 'protocol' | 'other'

export type SessionProtocolType = 'speech-assessment' | 'motor-coordination' | 'school-follow-up'

export interface SessionDraftProtocol {
  id: string
  protocolType: SessionProtocolType
  content: string
  createdAt: string
}

export interface SessionDraftFile {
  id: string
  fileName: string
  category: SessionFileCategory
  sizeKb: number
  createdAt: string
}

export interface SessionDraft {
  sessionName: string
  sessionType: SessionType
  isSessionRunning: boolean
  isCompleted: boolean
  sessionStartedAt: number | null
  elapsedSeconds: number
  notes: string
  protocols: SessionDraftProtocol[]
  files: SessionDraftFile[]
  hasEvolution: boolean
  evolutionProgress: number
  evolutionStatus: SessionEvolutionStatus
  lastSavedAt: string | null
}
