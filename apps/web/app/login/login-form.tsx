"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signIn, signUp } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const result =
      mode === "signin"
        ? await signIn.email({ email, password })
        : await signUp.email({ email, password, name });
    setBusy(false);
    if (result.error) {
      setError(result.error.message ?? "Something went wrong");
      return;
    }
    router.push(next);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      {mode === "signup" && (
        <input
          className={inputClass}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={inputClass}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </form>
  );
}
