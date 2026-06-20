"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";
import type { AuthState } from "@/lib/auth-types";

function resolveLocale(value: FormDataEntryValue | null): Locale {
  return (routing.locales as readonly string[]).includes(value as string)
    ? (value as Locale)
    : routing.defaultLocale;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const explicit = h.get("origin");
  if (explicit) return explicit;
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "";
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = await getTranslations({ locale, namespace: "auth" });
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: t("emailRequired") };
  if (!password) return { error: t("invalidCredentials") };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: t("invalidCredentials") };

  revalidatePath(`/${locale}/account`);
  redirect(`/${locale}/account`);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = await getTranslations({ locale, namespace: "auth" });
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: t("emailRequired") };
  if (password.length < 6) return { error: t("passwordTooShort") };

  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/${locale}/account`,
    },
  });
  if (error) return { error: t("genericError") };

  // When email confirmation is enabled, no session is returned yet.
  if (!data.session) return { notice: t("checkEmail") };

  revalidatePath(`/${locale}/account`);
  redirect(`/${locale}/account`);
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = await getTranslations({ locale, namespace: "auth" });
  const email = String(formData.get("email") ?? "").trim();

  if (email.includes("@")) {
    const supabase = await createClient();
    const origin = await getOrigin();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/${locale}/account/update-password`,
    });
  }

  // Always return the same notice to avoid leaking which emails exist.
  return { notice: t("resetEmailSent") };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = await getTranslations({ locale, namespace: "auth" });
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) return { error: t("passwordTooShort") };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: t("genericError") };

  revalidatePath(`/${locale}/account`);
  redirect(`/${locale}/account`);
}

export async function signOut(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(`/${locale}/account`);
  redirect(`/${locale}/account`);
}
