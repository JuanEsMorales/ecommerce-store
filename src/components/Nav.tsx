"use client"
import { ComponentProps, ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className='bg-primary text-primary-foreground flex justify-center px-4'>
      {children}
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "ClassName">) {
  const pathName = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        "p-4 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathName === props.href && "bg-background text-foreground"
      )}
    />
  )
}
