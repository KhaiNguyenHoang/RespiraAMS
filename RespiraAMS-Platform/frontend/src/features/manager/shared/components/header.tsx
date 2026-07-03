"use client"

import { SearchInput } from "./searchInput";
import AccountSection from "./accountSection";
import { useSearchStore } from "../stores/searchStore";

const DEFAULT_USER = {
    name: "Nguyen Van A",
    email: "nguyenvana@medcare.vn",
    initials: "NA",
};

export function ManagerHeader() {
    const setSearchValue = useSearchStore((s) => s.setValue);

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 justify-between">
            <SearchInput onSearch={setSearchValue} placeholder="Search..." />

            <div className="flex items-center gap-2 float-right">
                <AccountSection user={DEFAULT_USER} />
            </div>
        </header>
    );
}
