"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
      <pre className="max-w-xl text-sm text-muted-foreground overflow-auto border rounded-md p-4 bg-muted/50">
        {error.message}
        {"\n\n"}
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
