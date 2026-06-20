import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthForm />
      </div>
    );
  }

  return (
    <Container className="py-20 max-w-2xl">
      <div className="space-y-8">
        <h1 className="font-serif text-4xl text-coffee-dark">
          {t("accountTitle")}
        </h1>
        <div className="rounded-md border border-border bg-cream/40 p-6">
          <div className="text-xs uppercase tracking-wider text-muted">
            {t("signedInAs")}
          </div>
          <div className="mt-1 text-coffee-dark">{user.email}</div>
        </div>

        <div className="rounded-md border border-border p-6">
          <h2 className="font-serif text-xl text-coffee-dark">
            {t("ordersTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("ordersComingSoon")}</p>
        </div>

        <form action={signOut}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="inline-flex rounded-full border border-coffee-dark px-6 py-3 text-sm font-medium text-coffee-dark hover:bg-cream transition-colors"
          >
            {t("signOut")}
          </button>
        </form>
      </div>
    </Container>
  );
}
