"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AccountMenu() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="redirect">
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Ingresar
          </button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <button
            type="button"
            className="hidden rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 sm:inline-flex"
          >
            Crear cuenta
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
