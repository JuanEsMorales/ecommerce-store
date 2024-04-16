import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExpiredPage() {
  return (
    <>
      <h1 className='text-4xl mb-4 font-bold'>Download link expired</h1>
      <Button asChild size={"lg"}>
        <Link href={"/orders"}>Get new link</Link>
      </Button>
    </>
  )
}
