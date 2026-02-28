import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isVisible: boolean
  label: string
}

export function LoadingOverlay({ isVisible, label }: LoadingOverlayProps) {
  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-background/70 backdrop-blur-[1px] transition-opacity duration-200",
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        aria-live="polite"
        aria-label={label}
        role="status"
        className="flex items-center justify-center"
      >
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border-4 border-primary/25" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary motion-reduce:animate-none animate-spin" />
          <span className="absolute inset-3 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  )
}
