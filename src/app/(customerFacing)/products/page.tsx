import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Suspense } from "react"

const getProducts = cache(() => {
  return db.product.findMany({ where: { isAvailableForPurchase: true } })
}, ["/products", "getProducts"])

export default function ProductsPage() {
  return (
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
        <ProductsSuspense />
      </Suspense>
    </div>
  )
}

async function ProductsSuspense() {
  const products = await getProducts()
  return products.map((product) => {
    return <ProductCard key={product.id} {...product} />
  })
}
