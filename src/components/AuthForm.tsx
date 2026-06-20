"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  signIn,
  signUp,
  requestPasswordReset,
} from "@/app/[locale]/account/actions";
import type { AuthState } from "@/lib/auth-types";

type Mode = "signin" | "signup" | "forgot";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-coffee-dark focus:border-coffee focus:outline-none";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-coffee-dark px-6 py-3 text-sm font-medium text-cream hover:bg-coffee transition-colors disabled:opacity-60";

export function AuthForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode: Mode =
    modeParam === "signup" || modeParam === "forgot" ? modeParam : "signin";
  const [mode, setModeState] = useState<Mode>(initialMode);

  // Keep the mode in the URL so it survives navigations (e.g. switching locale).
  function setMode(next: Mode) {
    setModeState(next);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (next === "signin") params.delete("mode");
    else params.set("mode", next);
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }

  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    undefined as AuthState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    undefined as AuthState,
  );
  const [forgotState, forgotAction, forgotPending] = useActionState(
    requestPasswordReset,
    undefined as AuthState,
  );

  const state =
    mode === "signin"
      ? signInState
      : mode === "signup"
        ? signUpState
        : forgotState;

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-center font-serif text-2xl text-coffee-dark">
        {mode === "signin"
          ? t("signInTitle")
          : mode === "signup"
            ? t("signUpTitle")
            : t("forgotTitle")}
      </h2>

      {mode === "forgot" ? (
        <form action={forgotAction} className="mt-6 space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label htmlFor="email" className="block text-sm text-muted">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <button type="submit" disabled={forgotPending} className={buttonClass}>
            {t("sendResetLink")}
          </button>
        </form>
      ) : (
        <form
          action={mode === "signin" ? signInAction : signUpAction}
          className="mt-6 space-y-4"
        >
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label htmlFor="email" className="block text-sm text-muted">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-muted">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <button
            type="submit"
            disabled={mode === "signin" ? signInPending : signUpPending}
            className={buttonClass}
          >
            {mode === "signin" ? t("signIn") : t("signUp")}
          </button>
        </form>
      )}

      {state?.error && <p className="mt-3 text-sm text-accent">{state.error}</p>}
      {state?.notice && (
        <p className="mt-3 text-sm text-coffee">{state.notice}</p>
      )}

      <div className="mt-6 space-y-2 text-center text-sm">
        {mode === "signin" && (
          <>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="block w-full cursor-pointer text-muted hover:text-coffee transition-colors"
            >
              {t("toggleToSignUp")}
            </button>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="block w-full cursor-pointer text-muted hover:text-coffee transition-colors"
            >
              {t("forgotPassword")}
            </button>
          </>
        )}
        {mode === "signup" && (
          <>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="block w-full cursor-pointer text-muted hover:text-coffee transition-colors"
            >
              {t("toggleToSignIn")}
            </button>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="block w-full cursor-pointer text-muted hover:text-coffee transition-colors"
            >
              {t("forgotPassword")}
            </button>
          </>
        )}
        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => setMode("signin")}
            className="block w-full cursor-pointer text-muted hover:text-coffee transition-colors"
          >
            {t("backToSignIn")}
          </button>
        )}
      </div>
    </div>
  );
}
