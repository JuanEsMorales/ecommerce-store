import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"
import React from "react"

type OrderHistoryEmailProps = {
  orders: {
    id: string
    pricePaidInCents: number
    createdAt: Date
    downloadVerificationId: string
    product: {
      name: string
      imagePath: string
      description: string
    }
  }[]
}

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 1000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name",
        imagePath:
          "/products/012b6337-a998-4175-be45-ebd100208d2d-programming-coding.jpg",
        description: "Product Description",
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 2000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name 2",
        imagePath:
          "/products/19e5d5dc-4a35-4379-8834-99c18a64e637-programming.jpg",
        description: "Product Description 2",
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 4500,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name 3",
        imagePath: "/products/af4540b1-4070-48ba-af75-90743fac229f-Captura.png",
        description: "Product Description 3",
      },
    },
  ],
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History and Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <h2>Order History</h2>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  key={order.id}
                  downloadVerificationId={order.downloadVerificationId}
                  order={order}
                  product={order.product}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
