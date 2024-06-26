import { formatCurrency } from "@/lib/formatter"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

type ProductCardProps = {
  id: string
  description: string
  priceInCents: number
  imagePath: string
  name: string
}

export function ProductCard({
  name,
  priceInCents,
  description,
  id,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className='flex overflow-hidden flex-col'>
      <div className='relative w-full h-auto aspect-video'>
        <Image src={imagePath} fill alt={name} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className='flex-grow'>
        <p className='line-clamp-4'>{description}</p>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <Button asChild size={"lg"} className='w-full'>
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// skeletons for the product card

export function ProductCardSkeleton() {
  return (
    <Card className='flex overflow-hidden flex-col animate-pulse'>
      <div className='relative w-full h-auto aspect-video bg-gray-400'></div>
      <CardHeader>
        <CardTitle>
          <div className='w-3/4 h-6 rounded-full bg-gray-400'></div>
        </CardTitle>
        <CardDescription>
          <div className='w-1/2 h-4 rounded-full bg-gray-400'></div>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow space-y-2'>
        <div className='w-full h-4 rounded-full bg-gray-400'></div>
        <div className='w-full h-4 rounded-full bg-gray-400'></div>
        <div className='w-3/4 h-4 rounded-full bg-gray-400'></div>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <Button size={"lg"} className='bg-gray-700 w-full' disabled></Button>
      </CardFooter>
    </Card>
  )
}
