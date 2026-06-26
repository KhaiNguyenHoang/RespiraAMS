import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  );
}
