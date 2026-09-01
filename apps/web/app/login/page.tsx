import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-sm text-muted-foreground">Sign in or create an account to continue.</p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign-in…</p>}>
        <LoginForm />
      </Suspense>
      <p className="text-xs text-muted-foreground">
        Email and password sign-in. Single sign-on activates once its provider is configured.
      </p>
    </main>
  );
}
