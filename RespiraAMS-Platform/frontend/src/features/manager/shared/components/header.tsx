"use client"

import { usePathname } from "next/navigation";
import { SearchInput } from "./searchInput";
import AccountSection from "./accountSection";
import { useSearchStore } from "../stores/searchStore";
import { getUser } from "@/lib/auth";

const HIDE_SEARCH_PATHS = ["/manager/dashboard", "/manager/diseases/"];

export function ManagerHeader() {
    const pathname = usePathname();
    const setSearchValue = useSearchStore((s) => s.setValue);
    const user = getUser();

    const showSearch = !HIDE_SEARCH_PATHS.some((path) => pathname.startsWith(path));

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 justify-between">
            {showSearch && <SearchInput onSearch={setSearchValue} placeholder="Search..." />}

            <div className={`flex items-center gap-2 ${showSearch ? "" : "ml-auto"}`}>
                <AccountSection
                    user={{
                        name: user ? `${user.lastName} ${user.firstName}` : "User",
                        email: user?.email ?? "",
                        initials: user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "NA",
                    }}
                />
            </div>
        </header>
    );
}
