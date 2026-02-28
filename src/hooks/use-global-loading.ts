import { useLoadingOverlayContext } from '@/providers/loading-overlay-provider'

export function useGlobalLoading() {
  return useLoadingOverlayContext()
}
