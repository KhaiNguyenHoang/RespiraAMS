"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export function NotFoundMessage() {
    return (

        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 overflow-hidden">
            <div className="max-w-7xl w-full grid grid-cols-1 gap-16 items-center">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="font-label text-xs tracking-[0.2em] uppercase text-primary font-bold">
                            Error 404
                        </span>
                        <h1 className="font-display text-5xl md:text-7xl text-primary leading-tight -tracking-widest italic">
                            Resource not found. Please try again
                        </h1>
                    </div>
                </div>
            </div>
        </main >
    )
}