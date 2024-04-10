import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatter"

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })
  // await wait(2000)

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  }
}

function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds))
}

async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}

async function getProductsData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ])
  return {
    activeCount,
    inactiveCount,
  }
}

export default async function AdminDashboard() {
  const [salesData, userData, productsData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductsData(),
  ])
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      <DashboardCard
        title='Sales'
        description={formatNumber(salesData.numberOfSales) + " Orders"}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title='Customers'
        description={
          formatNumber(userData.averageValuePerUser) + " Average Value"
        }
        body={formatCurrency(userData.userCount)}
      />
      <DashboardCard
        title='Active Products'
        description={formatNumber(productsData.inactiveCount) + " Inactive"}
        body={formatCurrency(productsData.activeCount)}
      />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  description: string
  body: string
}

function DashboardCard({ title, description, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
