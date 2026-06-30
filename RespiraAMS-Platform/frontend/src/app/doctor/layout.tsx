import { DoctorSidebar } from "@/features/doctor/components/sidebar"
import { DoctorHeader } from "@/features/doctor/components/header"

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DoctorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DoctorHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
