"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, restoreSession } from "@/lib/auth";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const redirect = async () => {
            if (!isAuthenticated()) {
                const restored = await restoreSession();
                if (!restored) {
                    router.replace("/login");
                    return;
                }
            }

            if (cancelled) return;

            const user = getUser();
            const role = user?.role?.toLowerCase();

            if (role === "admin" || role === "manager") {
                router.replace("/manager/dashboard");
            } else if (role === "doctor") {
                router.replace("/doctor/diagnose");
            } else {
                router.replace("/login");
            }
        };

        redirect();

        return () => { cancelled = true; };
    }, [router]);

    return null;
}
