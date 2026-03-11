/**
 * React Query hooks for users
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api'
import { API_ROUTES } from '@/lib/api-routes'
import { QUERY_KEYS } from '@/lib/query-keys'

import type { PaginatedResponse } from '@/types/common.types'
import type { UserListItem } from '@/types/user.types'

/**
 * Fetches a paginated list of users.
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 20)
 * @param search - Optional search term
 * @param isActive - Optional active filter (true/false/null)
 */
export function useUsers(
  page = 1,
  pageSize = 20,
  search = '',
  isActive: boolean | null = null,
  ordering: string | null = null
) {
  return useQuery({
    queryKey: QUERY_KEYS.users.list(page, { page_size: pageSize, search: search || null, is_active: isActive, ordering }),
    queryFn: async () => {
      try {
        return api.get<PaginatedResponse<UserListItem>>(API_ROUTES.users.base, {
          params: {
            page,
            page_size: pageSize,
            search: search || undefined,
            is_active: isActive ?? undefined,
            ordering: ordering ?? undefined,
          },
        })
      } catch (error) {
        console.error('Fetch users error:', getErrorMessage(error))
        throw error
      }
    },
    staleTime: 2 * 60 * 1000,
  })
}
