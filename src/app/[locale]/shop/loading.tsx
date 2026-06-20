import { Container } from "@/components/Container";

export default function ShopLoading() {
  return (
    <Container className="py-14" aria-hidden="true">
      <div className="h-9 w-40 animate-pulse rounded bg-cream" />

      <div className="mt-8 flex gap-2 border-b border-border pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-cream" />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-md bg-cream" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-1/3 rounded bg-cream" />
              <div className="h-4 w-2/3 rounded bg-cream" />
              <div className="h-3 w-1/4 rounded bg-cream" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
