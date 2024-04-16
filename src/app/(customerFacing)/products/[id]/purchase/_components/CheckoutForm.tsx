"use client"
import { userOrderExists } from "@/app/_actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatter"
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"

type CheckoutFormProps = {
  product: {
    imagePath: string
    name: string
    priceInCents: number
    description: string
    id: string
  }
  clientSecret: string
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
)

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className='max-w-2xl w-full mx-auto space-y-8'>
      <div className='flex gap-4 items-center'>
        <div className='aspect-video flex-shrink-0 w-1/3 relative'>
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className='object-cover'
          />
        </div>
        <div>
          <div className='text-xl'>
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <p className='text-muted-foreground line-clamp-3'>
            {product.description}
          </p>
        </div>
      </div>
      <Elements
        options={{
          clientSecret,
          appearance: { labels: "floating", theme: "night" },
        }}
        stripe={stripePromise}
      >
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  )
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number
  productId: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMesagge] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (stripe == null || elements == null || email == null) return
    setIsLoading(true)
    console.log(stripe)

    const orderExists = await userOrderExists(email, productId)

    if (orderExists) {
      setErrorMesagge(
        "You have already placed an order for this product. Try to download it from the My orders page."
      )
      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/products/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMesagge(error.message)
        } else {
          setErrorMesagge("An unknown error ocurred")
        }
      })
      .finally(() => setIsLoading(false))
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className='text-destructive'>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className='mt-4'>
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            size={"lg"}
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
