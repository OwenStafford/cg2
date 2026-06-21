import { Container } from "@/components/Container";

// Overrides the parent shop grid skeleton for the single-product route —
// mirrors the product-detail layout (one large image + info column).
export default function ProductLoading() {
  return (
    <Container className="py-14" aria-hidden="true">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square animate-pulse rounded-md bg-cream" />

        {/* Info */}
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded bg-cream" />
          <div className="mt-4 h-10 w-3/4 rounded bg-cream" />
          <div className="mt-4 h-6 w-24 rounded bg-cream" />

          <div className="mt-7 space-y-2">
            <div className="h-4 w-full rounded bg-cream" />
            <div className="h-4 w-11/12 rounded bg-cream" />
            <div className="h-4 w-4/5 rounded bg-cream" />
          </div>

          <div className="mt-8 space-y-3">
            <div className="h-4 w-2/3 rounded bg-cream" />
            <div className="h-4 w-1/2 rounded bg-cream" />
            <div className="h-4 w-1/3 rounded bg-cream" />
          </div>

          <div className="mt-8 h-12 w-44 rounded-full bg-cream" />
        </div>
      </div>
    </Container>
  );
}
