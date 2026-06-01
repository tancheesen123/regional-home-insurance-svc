import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: "Register | Etiqa Home Insurance",
  description: "Create your Etiqa Home Insurance account",
}

export default function RegisterPage() {
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
          <h2 className="text-2xl font-semibold mb-4">{t("register.headline")}</h2>
          <p className="text-lg mb-6">{t("register.subheadline")}</p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>{t("register.instantPolicy")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>{t("register.multiRegion")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>{t("register.support247")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>{t("register.onlineClaims")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - registration form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              {t("auth.alreadyHaveAccount")}{" "}
              <Link href="/" className="text-[#0056b3] hover:underline font-medium">
                {t("auth.signInHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
