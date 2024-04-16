"use server"

import db from '@/db/db'
import { z } from 'zod'
import fs  from 'fs/promises'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const fileSchema = z.instanceof(File, { message: 'required' })

const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith('image/'))

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(file => file.size > 0, "Required")
})
export async function addProduct(prevState: unknown, formData:FormData) {
  const results = addSchema.safeParse(Object.fromEntries(formData.entries()))  
  if (results.success === false) {
    return results.error.formErrors.fieldErrors
     
  }
  const { name, description, file, image, priceInCents } = results.data

  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${file.name}`
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))

  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${image.name}`
  await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()))

  await db.product.create({ data: {
    name,
    priceInCents,
    description,
    imagePath,
    filePath,
    isAvailableForPurchase: false
  } })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional()
})

export async function updateProduct(id: string, prevState: unknown, formData:FormData) {
  const results = editSchema.safeParse(Object.fromEntries(formData.entries()))  
  if (results.success === false) {
    return results.error.formErrors.fieldErrors
     
  }
  const { name, description, file, image, priceInCents } = results.data

  const product = await db.product.findUnique({where: {id}})
  if (!product) {
    return notFound()
  }

  let filePath = product.filePath

  if (file && file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `products/${crypto.randomUUID()}-${file.name}`
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))
  }
  
  let imagePath = product.imagePath
  if (image && image.size > 0) {
    await fs.unlink(product.imagePath)
    imagePath = `/products/${crypto.randomUUID()}-${image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()))
  }

  await db.product.update({
    where: {id}, 
    data: {
    name,
    priceInCents,
    description,
    imagePath,
    filePath,
  } })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}
export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase }
  })
  revalidatePath("/")
  revalidatePath("/products")
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({
    where: { id }
  })
  if (product == null) return notFound()
  
  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)
  revalidatePath("/")
  revalidatePath("/products")
}