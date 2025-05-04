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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Vehicle } from "@/types"

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle> | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vehicles")
      
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      
      const data = await response.json()
      setVehicles(data)
    } catch (err) {
      console.error("Error fetching vehicles:", err)
      setError("Could not load vehicles. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleAddClick = () => {
    setCurrentVehicle({
      name: "",
      type: "XE_SO",
      licensePlate: "",
      imageUrl: "",
      pricePerDay: 0,
      status: "AVAILABLE",
      description: "",
    })
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleEditClick = (vehicle: Vehicle) => {
    setCurrentVehicle({...vehicle})
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa xe này không?")) {
      try {
        const response = await fetch(`/api/vehicles/${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          throw new Error("Failed to delete vehicle")
        }
        
        // Refresh the vehicle list
        fetchVehicles()
      } catch (error) {
        console.error("Error deleting vehicle:", error)
        alert("Không thể xóa xe. Vui lòng thử lại sau.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentVehicle) return
    
    try {
      const url = isEditMode 
        ? `/api/vehicles/${currentVehicle.id}` 
        : "/api/vehicles"
      
      const method = isEditMode ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentVehicle),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} vehicle`)
      }
      
      // Close dialog and refresh data
      setIsDialogOpen(false)
      fetchVehicles()
    } catch (error) {
      console.error("Error submitting vehicle:", error)
      alert(`Không thể ${isEditMode ? "cập nhật" : "tạo"} xe. Vui lòng thử lại sau.`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentVehicle(prev => prev ? ({...prev, [name]: value}) : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentVehicle(prev => prev ? ({...prev, [name]: value}) : null)
  }

  if (loading) {
    return <div className="flex justify-center my-8">Đang tải...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center my-8">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Xe Máy</h1>
        <Button onClick={handleAddClick}>Thêm Xe Mới</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Xe</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Biển Số</TableHead>
            <TableHead>Giá/Ngày</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Không có dữ liệu xe
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.name}</TableCell>
                <TableCell>
                  {vehicle.type === "TAY_GA" ? "Xe tay ga" : "Xe số"}
                </TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(vehicle.pricePerDay))}
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.status === "AVAILABLE" 
                        ? "bg-green-100 text-green-800" 
                        : vehicle.status === "RENTED" 
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.status === "AVAILABLE" 
                      ? "Sẵn sàng" 
                      : vehicle.status === "RENTED" 
                      ? "Đang thuê"
                      : "Bảo trì"}
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
                      <DropdownMenuItem onClick={() => handleEditClick(vehicle)}>
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(vehicle.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        Xóa
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Sửa Thông Tin Xe" : "Thêm Xe Mới"}
            </DialogTitle>
            <DialogDescription>
              Điền đầy đủ thông tin xe máy và nhấn lưu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên xe
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={currentVehicle?.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Loại xe
                </Label>
                <Select
                  name="type"
                  value={currentVehicle?.type || "XE_SO"}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XE_SO">Xe số</SelectItem>
                    <SelectItem value="TAY_GA">Xe tay ga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="licensePlate" className="text-right">
                  Biển số
                </Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  className="col-span-3"
                  value={currentVehicle?.licensePlate || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Hình ảnh URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  className="col-span-3"
                  value={currentVehicle?.imageUrl || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pricePerDay" className="text-right">
                  Giá thuê/ngày
                </Label>
                <Input
                  id="pricePerDay"
                  name="pricePerDay"
                  type="number"
                  className="col-span-3"
                  value={currentVehicle?.pricePerDay || 0}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  name="status"
                  value={currentVehicle?.status || "AVAILABLE"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
                    <SelectItem value="RENTED">Đang thuê</SelectItem>
                    <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                  value={currentVehicle?.description || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 