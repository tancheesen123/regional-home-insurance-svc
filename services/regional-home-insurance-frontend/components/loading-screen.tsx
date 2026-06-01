import { Shield } from "lucide-react"

interface LoadingScreenProps {
  fullScreen?: boolean
}

export default function LoadingScreen({ fullScreen = true }: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white ${
        fullScreen ? "min-h-screen" : "min-h-[400px]"
      }`}
    >
      {/* Logo + spinner */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer spinning ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-[#0056b3]/20 border-t-[#0056b3] animate-spin" />
        {/* Inner icon */}
        <div className="w-12 h-12 rounded-full bg-[#0056b3]/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-[#0056b3]" />
        </div>
      </div>

      {/* Brand name */}
      <p className="text-[#0056b3] font-semibold text-lg tracking-wide">Etiqa Home Insurance</p>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-3">
        <span className="w-2 h-2 rounded-full bg-[#0056b3] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#0056b3] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#0056b3] animate-bounce" />
      </div>
    </div>
  )
}
