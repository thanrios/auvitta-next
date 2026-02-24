export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    me: () => ['users', 'me'] as const,
  },
  patients: {
    all: ['patients'] as const,
    list: (page: number, search: string) => ['patients', 'list', page, search] as const,
    detail: (id: string) => ['patients', 'detail', id] as const,
    phones: (patientId: string) => ['patients', patientId, 'phones'] as const,
    addresses: (patientId: string) => ['patients', patientId, 'addresses'] as const,
    documents: (patientId: string) => ['patients', patientId, 'documents'] as const,
    guardians: (patientId: string) => ['patients', patientId, 'guardians'] as const,
  },
  guardians: {
    all: ['guardians'] as const,
    list: (page: number, search: string) => ['guardians', 'list', page, search] as const,
    detail: (id: string) => ['guardians', 'detail', id] as const,
    phones: (guardianId: string) => ['guardians', guardianId, 'phones'] as const,
    addresses: (guardianId: string) => ['guardians', guardianId, 'addresses'] as const,
    documents: (guardianId: string) => ['guardians', guardianId, 'documents'] as const,
    patients: (guardianId: string) => ['guardians', guardianId, 'patients'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (
      page: number,
      filters?: {
        patient_id?: number
        doctor_id?: number
        status?: string
        date?: string
      }
    ) => ['appointments', 'list', page, filters ?? null] as const,
    detail: (id: number | string) => ['appointments', 'detail', id] as const,
  },
} as const
