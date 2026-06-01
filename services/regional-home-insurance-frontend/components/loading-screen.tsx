import Image from "next/image"

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
        <div className="absolute w-20 h-20 rounded-full border-4 border-[#F5A623]/20 border-t-[#F5A623] animate-spin" />
        {/* Inner logo */}
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
          <Image
            src="/images/Etiqa_Favicon.png"
            alt="Etiqa"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            priority
          />
        </div>
      </div>

      {/* Logo wordmark */}
      <Image
        src="/images/Etiqa-EGIB.png"
        alt="Etiqa Home Insurance"
        width={120}
        height={36}
        className="h-8 w-auto object-contain mb-3"
      />

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-bounce" />
      </div>
    </div>
  )
}
