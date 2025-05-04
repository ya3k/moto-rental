"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RentalForm } from "@/components/forms/RentalForm"
import type { Vehicle, Location } from "@/types"

interface RentPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RentPage({ params }: RentPageProps) {
  // In Next.js 15, params is a Promise that needs to be unwrapped with React.use()
  const resolvedParams = use(params)
  const { id } = resolvedParams
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch vehicle data
        const vehicleResponse = await fetch(`/api/vehicles/${id}`)
        if (!vehicleResponse.ok) {
          throw new Error("Failed to fetch vehicle")
        }
        const vehicleData = await vehicleResponse.json()
        
        // Fetch locations
        const locationsResponse = await fetch("/api/locations")
        if (!locationsResponse.ok) {
          throw new Error("Failed to fetch locations")
        }
        const locationsData = await locationsResponse.json()
        
        setVehicle(vehicleData)
        setLocations(locationsData)
      } catch (err) {
        setError("Could not load data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500 mb-4">
            {error || "Không tìm thấy xe này."}
          </p>
          <Link href="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                {vehicle.imageUrl ? (
                  <Image
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{vehicle.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                  {vehicle.type === "TAY_GA" ? "Xe tay ga" : "Xe số"}
                </span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {vehicle.licensePlate}
                </span>
              </div>
              
              <p className="text-xl font-semibold text-primary mb-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(vehicle.pricePerDay))}{" "}
                <span className="text-sm font-normal text-gray-500">/ngày</span>
              </p>
              
              {vehicle.description && (
                <p className="text-gray-700 mt-4">{vehicle.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Thông tin đặt xe</h2>
          <RentalForm vehicle={vehicle} locations={locations} />
        </div>
      </div>
    </div>
  )
} 