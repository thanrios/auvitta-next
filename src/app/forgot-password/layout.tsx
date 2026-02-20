import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { LifeBuoy, Stethoscope } from "lucide-react"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('layouts.auth')

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Diagonal Cross Top Right Fade Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)"
        }}
      />

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-10 flex items-center gap-2 z-10">
        <Stethoscope className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">Auvitta</span>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        {children}
      </div>

      {/* Support Link - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10">
        <Link
          href={process.env.NEXT_PUBLIC_SUPPORT_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <LifeBuoy className="h-5 w-5" />
          {t('support')}
        </Link>
      </div>
    </div>
  )
}
