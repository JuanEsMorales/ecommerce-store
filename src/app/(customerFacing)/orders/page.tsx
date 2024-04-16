"use client"
import { emailOrderHistory } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {})
  return (
    <form action={action} className='max-w-xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>My orders</CardTitle>
          <CardDescription>
            Enter your email and we email you your order history and download
            links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              className='w-full'
              name='email'
              id='email'
              placeholder='example@example.com'
              required
            />
            {data.error && <p className='text-destructive'>{data.error}</p>}
          </div>
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className='w-full' size={"lg"} disabled={pending} type='submit'>
      {pending ? "Sending..." : "Send"}
    </Button>
  )
}
