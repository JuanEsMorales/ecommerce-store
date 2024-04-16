import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
    description: string
  }
  order: {
    id: string
    pricePaidInCents: number
    createdAt: Date
  }
  downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product Name",
    imagePath:
      "/products/012b6337-a998-4175-be45-ebd100208d2d-programming-coding.jpg",
    description: "Product Description",
  },
  order: {
    id: crypto.randomUUID(),
    pricePaidInCents: 1000,
    createdAt: new Date(),
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <h2>Purchase Receipt</h2>
            <OrderInformation
              downloadVerificationId={downloadVerificationId}
              order={order}
              product={product}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
