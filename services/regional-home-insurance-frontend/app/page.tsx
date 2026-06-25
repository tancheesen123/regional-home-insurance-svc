import Link from "next/link"
import { Briefcase, Home, Shield } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {}
      <div className="bg-[#0056b3] text-white md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Shield className="h-10 w-10 mr-2" />
            <h1 className="text-3xl font-bold">Etiqa Home Insurance</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Protect Your Home Across Southeast Asia</h2>
          <p className="text-lg mb-6">
            Comprehensive home insurance coverage in Cambodia, Philippines, and Indonesia with instant policy issuance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <Home className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">Property Protection</h3>
              <p className="text-sm opacity-80">Coverage for your home structure and belongings</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Shield className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">Instant Coverage</h3>
              <p className="text-sm opacity-80">Immediate policy issuance after payment</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Briefcase className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">Liability Coverage</h3>
              <p className="text-sm opacity-80">Protection against third-party claims</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Home className="h-6 w-6 mb-2" />
              <h3 className="font-medium mb-1">Regional Support</h3>
              <p className="text-sm opacity-80">Local assistance in all covered countries</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <LoginForm />
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need assistance? Contact our support team</p>
            <p className="mt-1">
              <Link href="/about" className="text-[#0056b3] hover:underline">
                Learn more about Etiqa Home Insurance
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
