"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import { getUser, clearAuth, isAuthenticated } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
	firstName: string;
	lastName: string;
	email: string;
}

export default function TestPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push("/login");
			return;
		}

		const userData = getUser();
		if (userData) {
			setUser({
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
			});
		}
		setIsLoading(false);
	}, [router]);

	const handleLogout = () => {
		clearAuth();
		router.push("/login");
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
			</div>
		);
	}

	const fullName = user ? `${user.firstName} ${user.lastName}` : "User";
	const initials = user
		? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
		: "U";

	return (
		<div className="min-h-screen bg-white text-slate-800 dark:bg-[#0d1117] dark:text-slate-100 font-sans">

			<header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#0d1117]/80">
				<div className="flex h-16 items-center justify-between px-6">

					<div className="flex items-center gap-2">
						<span className="font-heading text-lg font-semibold tracking-tight text-cyan-600 dark:text-cyan-400">
							RespiraAMS
						</span>
					</div>


					<div className="flex items-center gap-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer">
									<Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
										<AvatarImage src="/ButtonAvatar.png" alt={fullName} />
										<AvatarFallback className="bg-cyan-500 text-white font-semibold text-xs">
											{initials}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium pr-1 text-slate-700 dark:text-slate-200">
										{fullName}
									</span>
									<ChevronDown className="h-4 w-4 text-slate-400" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48 mt-1">
								<DropdownMenuItem asChild>
									<Link href="/profile" className="flex w-full items-center gap-2 cursor-pointer">
										<User className="h-4 w-4 text-slate-500" />
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleLogout} className="flex w-full items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
									<LogOut className="h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>


			<main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
				<div className="space-y-4 max-w-md">
					<h1 className="text-3xl font-heading font-semibold text-slate-900 dark:text-white">
						Trang thử nghiệm
					</h1>
					<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
						Chào mừng bạn đến với trang trắng thử nghiệm. Đây là trang `/test` sau khi đăng nhập thành công.
					</p>
				</div>
			</main>
		</div>
	);
}
