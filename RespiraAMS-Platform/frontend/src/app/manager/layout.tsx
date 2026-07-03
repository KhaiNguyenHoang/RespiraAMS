import { ManagerHeader } from "@/features/manager/shared/components/header";
import { ManagerSidebar } from "@/features/manager/shared/components/sidebar";

export default function ManagerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen overflow-hidden">
            <ManagerSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <ManagerHeader />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
