import Link from "next/link"
import { Briefcase, Home, Shield } from "lucide-react"
import LoginForm from "@/components/login-form"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - branding */}
      <div className="bg-[#0056b3] text-white md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Shield className="h-10 w-10 mr-2" />
            <h1 className="text-3xl font-bold">{t("common.appName")}</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">{t("home.headline")}</h2>
          <p className="text-lg mb-6">{t("home.subheadline")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <Home className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">{t("home.propertyProtection")}</h3>
              <p className="text-sm opacity-80">{t("home.propertyProtectionDesc")}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Shield className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">{t("home.instantCoverage")}</h3>
              <p className="text-sm opacity-80">{t("home.instantCoverageDesc")}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Briefcase className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">{t("home.liabilityCoverage")}</h3>
              <p className="text-sm opacity-80">{t("home.liabilityCoverageDesc")}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Home className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">{t("home.regionalSupport")}</h3>
              <p className="text-sm opacity-80">{t("home.regionalSupportDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <LoginForm />
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>{t("common.needAssistance")}</p>
            <p className="mt-1">
              <Link href="/about" className="text-[#0056b3] hover:underline">
                {t("common.learnMore")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
