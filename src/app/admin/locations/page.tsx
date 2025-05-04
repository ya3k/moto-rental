"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Toaster, toast } from "sonner"
import type { Location } from "@/types"

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    isActive: true,
  })

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/locations")
      
      if (!response.ok) {
        throw new Error("Failed to fetch locations")
      }
      
      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast.error("Lỗi khi tải danh sách địa điểm")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      isActive: true,
    })
    setSelectedLocation(null)
  }

  const handleAddClick = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
      isActive: location.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (location: Location) => {
    setSelectedLocation(location)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleCreateLocation = async () => {
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create location")
      }

      setIsAddDialogOpen(false)
      toast.success("Đã thêm địa điểm mới thành công")
      fetchLocations()
    } catch (error) {
      console.error("Error creating location:", error)
      toast.error("Lỗi khi thêm địa điểm mới")
    }
  }

  const handleUpdateLocation = async () => {
    if (!selectedLocation) return

    try {
      const response = await fetch(`/api/locations/${selectedLocation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update location")
      }

      setIsEditDialogOpen(false)
      toast.success("Đã cập nhật địa điểm thành công")
      fetchLocations()
    } catch (error) {
      console.error("Error updating location:", error)
      toast.error("Lỗi khi cập nhật địa điểm")
    }
  }

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return

    try {
      const response = await fetch(`/api/locations/${selectedLocation.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete location")
      }

      setIsDeleteDialogOpen(false)
      toast.success("Đã xóa địa điểm thành công")
      fetchLocations()
    } catch (error) {
      console.error("Error deleting location:", error)
      toast.error("Lỗi khi xóa địa điểm. Có thể địa điểm này đang được sử dụng bởi các đơn hàng.")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Địa điểm</h1>
        <Button onClick={handleAddClick}>Thêm Địa điểm</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Địa điểm</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Đang tải...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Chưa có địa điểm nào được tạo.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên địa điểm</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          location.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {location.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(location)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(location)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Địa điểm mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên địa điểm</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên địa điểm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ chi tiết"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Đang hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleCreateLocation}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật Địa điểm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên địa điểm</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên địa điểm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ chi tiết"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-isActive">Đang hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleUpdateLocation}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Bạn có chắc chắn muốn xóa địa điểm{" "}
              <span className="font-semibold">{selectedLocation?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hành động này không thể hoàn tác. Và có thể thất bại nếu địa điểm đang
              được sử dụng bởi các đơn hàng.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteLocation}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 