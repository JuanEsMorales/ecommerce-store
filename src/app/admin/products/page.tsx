import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageHeader } from "../_components/PageHeader"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminProductsPage() {
  return (
    <>
      <div className='flex justify-between items-center'>
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href='/admin/products/new'>Add new product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  )
}

function ProductsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Available for purchase</span>
          </TableHead>
          <TableHead>Product name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )
}
