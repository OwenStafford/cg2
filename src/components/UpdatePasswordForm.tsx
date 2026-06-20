"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { updatePassword } from "@/app/[locale]/account/actions";
import type { AuthState } from "@/lib/auth-types";

export function UpdatePasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action, pending] = useActionState(
    updatePassword,
    undefined as AuthState,
  );

  return (
    <form action={action} className="mt-10 max-w-sm space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="password" className="block text-sm text-muted">
          {t("newPassword")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-coffee-dark focus:border-coffee focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors disabled:opacity-60"
      >
        {t("updatePassword")}
      </button>
      {state?.error && <p className="text-sm text-accent">{state.error}</p>}
    </form>
  );
}
