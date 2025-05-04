"use client"

import { useState, useEffect } from "react"
import { VehicleCard } from "@/components/vehicles/VehicleCard"
import { VehicleFilter } from "@/components/vehicles/VehicleFilter"
import type { Vehicle, VehicleType } from "@/types"

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build URL with optional type filter
        const url = selectedType
          ? `/api/vehicles?type=${selectedType}`
          : "/api/vehicles"
          
        console.log(`Fetching vehicles from: ${url}`)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`Fetched ${data.length} vehicles`)
        
        setVehicles(data)
        setFilteredVehicles(data)
      } catch (err) {
        console.error("Error fetching vehicles:", err)
        setError("Could not load vehicles. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [selectedType])

  const handleFilterChange = (type: VehicleType | null) => {
    setSelectedType(type)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dịch Vụ Thuê Xe Máy</h1>

      <VehicleFilter selectedType={selectedType} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Đang tải danh sách xe...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Không tìm thấy xe nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </main>
  )
}
