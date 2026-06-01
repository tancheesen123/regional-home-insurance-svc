import LoginForm from "@/components/login-form"
import LanguageSwitcher from "@/components/language-switcher"
import { useTranslations } from "next-intl"
import { Home, Briefcase, Lock, CheckCircle, Shield } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const t = useTranslations()

  const features = [
    {
      icon: Home,
      title: t("home.propertyProtection"),
      desc:  t("home.propertyProtectionDesc"),
    },
    {
      icon: Shield,
      title: t("home.instantCoverage"),
      desc:  t("home.instantCoverageDesc"),
    },
    {
      icon: Briefcase,
      title: t("home.liabilityCoverage"),
      desc:  t("home.liabilityCoverageDesc"),
    },
    {
      icon: CheckCircle,
      title: t("home.regionalSupport"),
      desc:  t("home.regionalSupportDesc"),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ── Left — Branding panel ─────────────────────────────────────────── */}
      <div className="lg:w-[52%] bg-[#111827] relative overflow-hidden flex flex-col justify-between p-10 lg:p-14">

        {/* Gold accent stripe at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5A623]" />

        {/* Decorative circle (background) */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F5A623]/5 pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-[#F5A623]/5 pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-14">
            <div className="inline-flex items-center justify-center bg-white rounded-xl px-4 py-2.5 shadow-md">
              <Image
                src="/images/Etiqa-EGIB.png"
                alt="Etiqa"
                width={120}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Hero copy */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-snug mb-4">
            {t("home.headline")}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-sm">
            {t("home.subheadline")}
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors duration-150"
              >
                <div className="w-8 h-8 bg-[#F5A623]/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-[#F5A623]" />
                </div>
                <p className="text-white text-sm font-semibold mb-1 leading-snug">{title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust line at bottom */}
        <div className="relative z-10 mt-12 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-gray-600 shrink-0" />
          <span className="text-gray-600 text-xs">
            256-bit encrypted · ISO 27001 compliant · Regional data residency
          </span>
        </div>
      </div>

      {/* ── Right — Form panel ────────────────────────────────────────────── */}
      <div className="lg:w-[48%] flex flex-col bg-white">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 lg:px-14 pt-8">
          <span className="text-xs text-[#9E9E9E]">{t("common.regionalPortal")}</span>
          <LanguageSwitcher />
        </div>

        {/* Vertically centred form */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-14 py-12">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 lg:px-14 pb-8 text-center">
          <p className="text-xs text-[#9E9E9E]">
            © {new Date().getFullYear()} {t("common.appName")}. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}
