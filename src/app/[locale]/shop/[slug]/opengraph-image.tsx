import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export const alt = "Café Gourmet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#2a1810",
            color: "#faf5ea",
            fontSize: 96,
            fontWeight: 700,
          }}
        >
          Café Gourmet
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#faf5ea" }}>
        <div style={{ display: "flex", width: "600px", height: "630px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt=""
            width={600}
            height={630}
            style={{ width: "600px", height: "630px", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "600px",
            padding: "70px",
            color: "#2a1810",
          }}
        >
          <div
            style={{
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#8b6243",
            }}
          >
            Café Gourmet
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
            {product.name[locale]}
          </div>
          <div style={{ fontSize: 44, marginTop: 28, color: "#4a2c1f" }}>
            {formatPrice(product.priceCents, locale)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
