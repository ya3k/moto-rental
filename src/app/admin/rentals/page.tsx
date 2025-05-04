"use client"

import { useState, useEffect } from "react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { Rental } from "@/types"

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rentals")
      
      if (!response.ok) {
        throw new Error("Failed to fetch rentals")
      }
      
      const data = await response.json()
      setRentals(data)
    } catch (err) {
      console.error("Error fetching rentals:", err)
      setError("Could not load rentals. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRentals()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/rentals/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update rental status")
      }
      
      // Refresh the rental list
      fetchRentals()
    } catch (error) {
      console.error("Error updating rental status:", error)
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.")
    }
  }

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental)
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center my-8">Đang tải...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center my-8">{error}</div>
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'ACTIVE':
        return 'Đang thuê'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']
    
    // Remove current status
    return allStatuses.filter(status => status !== currentStatus)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản Lý Đơn Thuê Xe</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Xe</TableHead>
            <TableHead>Thời gian nhận</TableHead>
            <TableHead>Thời gian trả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Không có dữ liệu đơn thuê
              </TableCell>
            </TableRow>
          ) : (
            rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id.slice(0, 8)}...</TableCell>
                <TableCell>{rental.customerName}<br/>{rental.customerPhone}</TableCell>
                <TableCell>{rental.vehicle.name}<br/>{rental.vehicle.licensePlate}</TableCell>
                <TableCell>{formatDate(rental.pickUpTime)}</TableCell>
                <TableCell>{formatDate(rental.dropOffTime)}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(rental.status)}`}
                  >
                    {getStatusLabel(rental.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {getStatusOptions(rental.status).map(status => (
                        <DropdownMenuItem 
                          key={status}
                          onClick={() => handleUpdateStatus(rental.id, status)}
                        >
                          Chuyển sang: {getStatusLabel(status)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem 
                        onClick={() => handleViewDetails(rental)}
                        className="border-t mt-1 pt-1"
                      >
                        Xem chi tiết
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đơn Thuê</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn thuê xe.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thông tin khách hàng</h3>
                  <p className="mt-1">{selectedRental.customerName}</p>
                  <p>{selectedRental.customerPhone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <p className="mt-1">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedRental.status)}`}
                    >
                      {getStatusLabel(selectedRental.status)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Thông tin xe</h3>
                <p className="mt-1">
                  {selectedRental.vehicle.name} ({selectedRental.vehicle.licensePlate})
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRental.vehicle.type === "TAY_GA" ? "Xe tay ga" : "Xe số"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Địa điểm nhận xe</h3>
                  <p className="mt-1">{selectedRental.pickUpLocation.name}</p>
                  <p className="text-sm text-gray-500">{selectedRental.pickUpLocation.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Địa điểm trả xe</h3>
                  <p className="mt-1">{selectedRental.dropOffLocation.name}</p>
                  <p className="text-sm text-gray-500">{selectedRental.dropOffLocation.address}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thời gian nhận xe</h3>
                  <p className="mt-1">{formatDate(selectedRental.pickUpTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thời gian trả xe</h3>
                  <p className="mt-1">{formatDate(selectedRental.dropOffTime)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Chi phí</h3>
                <p className="mt-1 text-lg font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    Number(selectedRental.vehicle.pricePerDay) * 
                    Math.ceil(
                      (new Date(selectedRental.dropOffTime).getTime() - 
                       new Date(selectedRental.pickUpTime).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(selectedRental.vehicle.pricePerDay))} × {
                    Math.ceil(
                      (new Date(selectedRental.dropOffTime).getTime() - 
                       new Date(selectedRental.pickUpTime).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )
                  } ngày
                </p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Đóng
                </Button>
                
                <div className="space-x-2">
                  {selectedRental.status === "PENDING" && (
                    <>
                      <Button
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => {
                          handleUpdateStatus(selectedRental.id, "CANCELLED")
                          setIsDialogOpen(false)
                        }}
                      >
                        Hủy đơn
                      </Button>
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedRental.id, "CONFIRMED")
                          setIsDialogOpen(false)
                        }}
                      >
                        Xác nhận
                      </Button>
                    </>
                  )}
                  
                  {selectedRental.status === "CONFIRMED" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedRental.id, "ACTIVE")
                        setIsDialogOpen(false)
                      }}
                    >
                      Đánh dấu đã nhận xe
                    </Button>
                  )}
                  
                  {selectedRental.status === "ACTIVE" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(selectedRental.id, "COMPLETED")
                        setIsDialogOpen(false)
                      }}
                    >
                      Đánh dấu đã trả xe
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 