import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";

export const alt = "Café Gourmet — Specialty coffee from Montréal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const eyebrow = locale === "fr" ? "Torréfacteurs depuis 1977" : "Roasters since 1977";
  const tagline =
    locale === "fr"
      ? "Café de spécialité de Montréal"
      : "Specialty coffee from Montréal";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#2a1810",
          color: "#faf5ea",
          padding: "90px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#e89567",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 140, fontWeight: 700, marginTop: 16 }}>
          Café Gourmet
        </div>
        <div style={{ fontSize: 48, marginTop: 24, color: "#ecddbe" }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
