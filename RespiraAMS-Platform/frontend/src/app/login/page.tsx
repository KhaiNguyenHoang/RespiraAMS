"use client";

import Image from "next/image";
import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	Shield,
	Loader2,
} from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			setError(null);

			if (!email.trim() || !password.trim()) {
				setError("Email và mật khẩu không được để trống.");
				return;
			}

			setIsLoading(true);

			try {
				const user = await login({ email, password });
				const role = user.role?.toLowerCase() ?? "";
				if (role.includes("admin") || role.includes("manager")) {
					router.push("/manager/dashboard");
				} else if (role.includes("doctor")) {
					router.push("/doctor/diagnose");
				} else {
					console.warn("LoginPage: unknown role", user.role, "defaulting to /manager/dashboard");
					router.push("/manager/dashboard");
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "An unexpected error occurred. Please try again."
				);
			} finally {
				setIsLoading(false);
			}
		},
		[email, password, router]
	);

	return (
		<div className="flex min-h-screen w-full font-sans">
			<div className="relative flex w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-[#0a1628] p-10"
				style={{
					backgroundImage: "url('/Hospital Interior.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-linear-to-br from-cyan-950/60 via-[#0a1628]/70 to-blue-950/60" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />
				<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent" />

				<div className="absolute inset-0 opacity-[0.03] hidden"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
						backgroundSize: "48px 48px",
					}}
				/>

				<div className="absolute left-12 top-32 h-64 w-64 animate-pulse rounded-full bg-cyan-500/5 blur-3xl hidden" />
				<div className="absolute bottom-32 right-8 h-48 w-48 animate-pulse rounded-full bg-blue-500/5 blur-3xl [animation-delay:1s] hidden" />

				<div className="relative z-10">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39B8FD]">
							<Image
								src="/Background.png"
								alt="RespiraAMS Logo"
								width={60}
								height={60}
								className="h-full w-full object-cover rounded"
							/>
						</div>
						<span className="text-xl font-semibold tracking-tight text-white font-heading">
							Clinic Precision
						</span>
					</div>
				</div>

				<div className="relative z-10 space-y-6">
					<div className="flex items-center gap-5 pt-2">
						<div className="flex items-center gap-2 text-xs text-slate-500">
							<Shield className="h-3.5 w-3.5 text-cyan-500/70" />
							<span>256-bit Encrypted</span>
						</div>
						<div className="flex items-center gap-2 text-xs text-slate-500">
							<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
							<span>System Online</span>
						</div>
					</div>
				</div>

				<div className="relative z-10 space-y-6 max-w-[65%]">
					<h1 className="text-4xl font-semibold leading-tight tracking-tight text-white font-heading">
						Advancing Care through
						<br />
						Clinical Excellence.
					</h1>
					<p className="text-sm leading-relaxed text-slate-300">
						Secure access for authorized healthcare administrators
						and medical personnel only. Experience the next
						generation of hospital management systems.
					</p>
					<p className="text-xs text-slate-600">
						&copy; {new Date().getFullYear()} RespiraAMS Platform.
						All rights reserved.
					</p>
				</div>
			</div>

			<div className="flex w-1/2 flex-col items-center justify-center bg-white px-6 dark:bg-[#0d1117]">
				<div className="w-full max-w-115">
					<div className="mb-10 flex items-center gap-3 lg:hidden">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#39B8FD]">
							<Image
								src="/Background.png"
								alt="RespiraAMS Logo"
								width={36}
								height={36}
								className="h-full w-full object-cover rounded"
							/>
						</div>
						<span className="text-lg font-semibold text-foreground font-heading">
							RespiraAMS
						</span>
					</div>

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
							<label
								htmlFor="login-email"
								className="text-[15px] font-semibold text-foreground"
							>
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
									className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-[15px] text-foreground
											   shadow-sm transition-all placeholder:text-muted-foreground/50
											   focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20
											   dark:bg-[#161b22]"
								/>
							</div>
						</div>


						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="login-password"
									className="text-[15px] font-semibold text-foreground"
								>
									Password
								</label>
								<button
									type="button"
									className="text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400"
								>
									Forgot Password?
								</button>
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
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-12 text-[15px] text-foreground
											   shadow-sm transition-all placeholder:text-muted-foreground/50
											   focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20
											   dark:bg-[#161b22]"
								/>
								<button
									type="button"
									tabIndex={-1}
									onClick={() =>
										setShowPassword((v) => !v)
									}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>


						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="h-4 w-4 rounded border-input bg-background text-cyan-600 focus:ring-cyan-500"
								/>
								<span className="text-sm text-muted-foreground">Remember me</span>
							</label>

							<button
								type="submit"
								disabled={isLoading}
								className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500 disabled:opacity-60"
							>
								{isLoading ? (
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
		</div>
	);
}
