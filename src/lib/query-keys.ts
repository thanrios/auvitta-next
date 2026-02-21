export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    me: () => ['users', 'me'] as const,
  },
  patients: {
    all: ['patients'] as const,
    list: (page: number, search: string) => ['patients', 'list', page, search] as const,
    detail: (id: number | string) => ['patients', 'detail', id] as const,
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
