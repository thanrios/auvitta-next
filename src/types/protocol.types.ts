export type ProtocolStatus = 'active' | 'inactive'

export type ProtocolBlockType =
  | 'section-title'
  | 'separator'
  | 'text'
  | 'textarea'
  | 'number'
  | 'single-select'
  | 'checkbox'

export interface ProtocolBlockOption {
  id: string
  label: string
}

export interface ProtocolBlock {
  id: string
  type: ProtocolBlockType
  label: string
  helperText?: string
  required?: boolean
  options?: ProtocolBlockOption[]
}

export interface ProtocolFormVersion {
  id: string
  groupId: string
  version: number
  name: string
  notes?: string
  status: ProtocolStatus
  blocks: ProtocolBlock[]
  supersedesId?: string
  createdAt: string
  updatedAt: string
}

export interface ProtocolFormInput {
  name: string
  notes?: string
  status: ProtocolStatus
  blocks: ProtocolBlock[]
}
