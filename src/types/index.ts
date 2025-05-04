// Vehicle Types
export type VehicleType = "TAY_GA" | "XE_SO"
export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE"

export interface Vehicle {
  id: string
  name: string
  type: VehicleType
  licensePlate: string
  imageUrl?: string | null
  pricePerDay: number
  status: VehicleStatus
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// Location Types
export interface Location {
  id: string
  name: string
  address: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Rental Types
export type RentalStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED"

export interface Rental {
  id: string
  customerName: string
  customerPhone: string
  vehicleId: string
  vehicle: Vehicle
  pickUpLocationId: string
  pickUpLocation: Location
  dropOffLocationId: string
  dropOffLocation: Location
  pickUpTime: Date
  dropOffTime: Date
  status: RentalStatus
  createdAt: Date
  updatedAt: Date
}

// Form Types
export interface RentalFormData {
  vehicleId: string
  customerName: string
  customerPhone: string
  pickUpLocationId: string
  dropOffLocationId: string
  pickUpTime: string
  dropOffTime: string
} 