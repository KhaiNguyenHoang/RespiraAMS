"use client";

// This is use for a detail error message, usually a data update request
export function ErrorMessage({ error }: { error: string }) {
    return (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
        </p>
    )
}