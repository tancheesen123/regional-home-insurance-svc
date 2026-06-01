import type { Metadata } from "next"
import ProfileForm from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Profile | Etiqa Home Insurance",
  description: "Manage your profile and account settings",
}

export default function ProfilePage() {
  return (
    <div className="p-6">
      <ProfileForm />
    </div>
  )
}
