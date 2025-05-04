import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Location, RentalFormData, Vehicle } from "@/types"

interface RentalFormProps {
  vehicle: Vehicle
  locations: Location[]
}

export function RentalForm({ vehicle, locations }: RentalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<RentalFormData>>({
    vehicleId: vehicle.id,
    pickUpLocationId: "",
    dropOffLocationId: "",
    pickUpTime: "",
    dropOffTime: "",
    customerName: "",
    customerPhone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string, field: 'pickUpLocationId' | 'dropOffLocationId') => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'pickUpLocationId' && !prev.dropOffLocationId ? { dropOffLocationId: value } : {})
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/thanks')
      } else {
        const error = await response.json()
        console.error('Failed to submit rental:', error)
        alert('Đã xảy ra lỗi khi đặt xe. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error submitting rental:', error)
      alert('Đã xảy ra lỗi khi đặt xe. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="pickUpLocationId">Địa điểm nhận xe</Label>
          <Select
            value={formData.pickUpLocationId}
            onValueChange={(value) => handleLocationChange(value, 'pickUpLocationId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pickUpTime">Thời gian nhận xe</Label>
            <Input
              id="pickUpTime"
              name="pickUpTime"
              type="datetime-local"
              value={String(formData.pickUpTime || "")}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="dropOffTime">Thời gian trả xe</Label>
            <Input
              id="dropOffTime"
              name="dropOffTime"
              type="datetime-local"
              value={String(formData.dropOffTime || "")}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dropOffLocationId">Địa điểm trả xe</Label>
          <Select
            value={formData.dropOffLocationId}
            onValueChange={(value) => handleLocationChange(value, 'dropOffLocationId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Thông tin người thuê</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Họ tên</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Số điện thoại</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang xử lý..." : "Xác nhận đặt xe"}
      </Button>
    </form>
  )
} 