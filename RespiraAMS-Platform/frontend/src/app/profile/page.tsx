"use client";

import ProfileView from "@/features/auth/profile/components/profileView";
import { ProtectedRoute } from "@/features/auth/components/protectedRoute";

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileView />
        </ProtectedRoute>
    );
}
