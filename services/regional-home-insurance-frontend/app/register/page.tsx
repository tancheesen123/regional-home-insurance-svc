import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Register | Etiqa Home Insurance",
  description: "Create your Etiqa Home Insurance account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {}
      <div className="bg-[#0056b3] text-white md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Shield className="h-10 w-10 mr-2" />
            <h1 className="text-3xl font-bold">Etiqa Home Insurance</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Join Our Regional Insurance Network</h2>
          <p className="text-lg mb-6">
            Create your account to access comprehensive home insurance coverage across Cambodia, Philippines, and
            Indonesia.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Instant policy issuance</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Multi-region coverage</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>24/7 customer support</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Online claims processing</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Already have an account?{" "}
              <Link href="/" className="text-[#0056b3] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
