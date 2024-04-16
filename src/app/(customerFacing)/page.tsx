import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Product } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
}, ["/", "getNewestProducts"])
const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    })
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
)

export default function HomePage() {
  return (
    <main className='space-y-12'>
      <ProductGridSection
        title='Most popular'
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection title='Newest' productsFetcher={getNewestProducts} />
    </main>
  )
}

type ProductGridSectionProps = {
  productsFetcher: () => Promise<Product[]>
  title: string
}

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex gap-4'>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl'>
          {title}
        </h2>
        <Button variant={"outline"} asChild>
          <Link href={"/products"} className='space-x-2'>
            <span>View all</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </section>
  )
}

async function ProductsSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ))
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}
