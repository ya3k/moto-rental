"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, TrendingUp, Users, ShoppingBag, MapPin } from "lucide-react"

type Rental = {
  id: string
  customerName: string
  status: string
  pickUpTime: string
  dropOffTime: string
  vehicle: {
    name: string
    licensePlate: string
  }
  pickUpLocation: {
    name: string
  }
  dropOffLocation: {
    name: string
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    pendingRentals: 0,
    activeRentals: 0,
    completedRentals: 0,
    availableVehicles: 0,
    totalVehicles: 0,
    locations: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    recentRentals: [] as Rental[],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Format currency in VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Format date to local format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>
      case 'CONFIRMED':
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>
      case 'ACTIVE':
        return <Badge className="bg-green-500">Đang thuê</Badge>
      case 'COMPLETED':
        return <Badge className="bg-gray-500">Hoàn thành</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp size={16} />
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp size={16} />
              Doanh thu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.monthlyRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag size={16} />
              Đơn đặt chờ xác nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.pendingRentals}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users size={16} />
              Đơn đang thuê
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeRentals}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Đơn đã hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-purple-600">{stats.completedRentals}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag size={16} />
              Xe đang sẵn sàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {stats.availableVehicles} / {stats.totalVehicles}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MapPin size={16} />
              Địa điểm hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.locations}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Đơn đặt gần đây</h2>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : stats.recentRentals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Xe</TableHead>
                    <TableHead>Ngày thuê</TableHead>
                    <TableHead>Ngày trả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.customerName}</TableCell>
                      <TableCell>{rental.vehicle.name} ({rental.vehicle.licensePlate})</TableCell>
                      <TableCell>{formatDate(rental.pickUpTime)}</TableCell>
                      <TableCell>{formatDate(rental.dropOffTime)}</TableCell>
                      <TableCell>{getStatusBadge(rental.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4">
                <p className="text-center text-gray-500">
                  Không có dữ liệu đơn đặt gần đây để hiển thị.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 