"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../queries";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginMutation = useLogin();

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            setError(null);

            if (!email.trim() || !password.trim()) {
                setError("Email and password are required.");
                return;
            }

            const toastID = toast.loading("Signing in...");

            loginMutation.mutate(
                { email, password },
                {
                    onSuccess: (data) => {
                        toast.success("Welcome back!");
                        toast.dismiss(toastID);
                        const role = data.role?.toLowerCase() ?? "";
                        if (role.includes("admin") || role.includes("manager")) {
                            router.push("/manager/dashboard");
                        } else if (role.includes("doctor")) {
                            router.push("/doctor/diagnose");
                        } else {
                            console.warn("LoginForm: unknown role", data.role, "defaulting to /manager/dashboard");
                            router.push("/manager/dashboard");
                        }
                    },
                    onError: (err) => {
                        toast.error(err.message || "Login failed");
                        toast.dismiss(toastID);
                        setError(err.message || "An unexpected error occurred.");
                    },
                }
            );
        },
        [email, password, loginMutation, router]
    );

    return (
        <div className="flex w-1/2 flex-col items-center justify-center bg-white px-6 dark:bg-[#0d1117]">
            <div className="w-full max-w-[460px]">
                <div className="mb-8 space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground font-heading">
                        Welcome Back
                    </h2>
                    <p className="text-[15px] text-muted-foreground">
                        Please enter your credentials to access the system.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
                        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        <p className="text-[15px] text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="login-email" className="text-[15px] font-semibold text-foreground">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                                id="login-email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="name@respira.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-[15px] text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:bg-[#161b22]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="login-password" className="text-[15px] font-semibold text-foreground">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-12 text-[15px] text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:bg-[#161b22]"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500 disabled:opacity-60"
                        >
                            {loginMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowRight className="h-4 w-4" />
                            )}
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
