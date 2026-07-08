"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, restoreSession } from "@/lib/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const check = async () => {
            // On page refresh the in-memory token is gone.
            // Try to restore from the server-side iron-session cookie.
            if (!isAuthenticated()) {
                const restored = await restoreSession();
                if (!restored) {
                    router.replace("/login");
                    return;
                }
            }

            if (cancelled) return;

            if (allowedRoles && allowedRoles.length > 0) {
                const user = getUser();
                const role = user?.role?.toLowerCase();
                const hasAccess = allowedRoles.some((r) => r.toLowerCase() === role);

                if (!hasAccess) {
                    router.replace("/login");
                    return;
                }
            }

            if (!cancelled) setAuthorized(true);
        };

        check();

        return () => { cancelled = true; };
    }, [router, allowedRoles]);

    if (!authorized) return null;

    return <>{children}</>;
}
