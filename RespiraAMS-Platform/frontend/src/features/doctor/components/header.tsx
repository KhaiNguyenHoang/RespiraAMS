"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import AccountSection from "@/features/manager/shared/components/accountSection"
import { getUser } from "@/lib/auth"

export function DoctorHeader() {
    const userData = getUser();
    const user = {
        name: userData ? `${userData.firstName} ${userData.lastName}` : "User",
        email: userData?.email ?? "user@respira.com",
        initials: userData
            ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
            : "U",
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm..."
                    className="pl-8"
                />
            </div>

            <div className="flex items-center gap-2 float-right">
                <AccountSection user={user} />
            </div>
        </header>
    )
}
