import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { RentalStatus } from "@/types"

// Next.js expects this specific type format for dynamic route parameters
// PATCH /api/admin/rentals/[id]/status - Update rental status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }
    
    // Validate status value
    const validStatuses: RentalStatus[] = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }
    
    // Find rental
    const rental = await prisma.rental.findUnique({
      where: {
        id: params.id,
      },
      include: {
        vehicle: true,
      },
    })
    
    if (!rental) {
      return NextResponse.json(
        { error: "Rental not found" },
        { status: 404 }
      )
    }
    
    // Update vehicle status if rental status changes
    let vehicleStatus = rental.vehicle.status
    
    if (body.status === "ACTIVE" && rental.status !== "ACTIVE") {
      // Mark vehicle as rented when rental becomes active
      vehicleStatus = "RENTED"
    } else if (rental.status === "ACTIVE" && (body.status === "COMPLETED" || body.status === "CANCELLED")) {
      // Mark vehicle as available when rental is completed or cancelled
      vehicleStatus = "AVAILABLE"
    }
    
    // Transaction to update both rental and vehicle
    const [updatedRental] = await prisma.$transaction([
      // Update rental status
      prisma.rental.update({
        where: {
          id: params.id,
        },
        data: {
          status: body.status,
        },
        include: {
          vehicle: true,
          pickUpLocation: true,
          dropOffLocation: true,
        },
      }),
      
      // Update vehicle status if needed
      prisma.vehicle.update({
        where: {
          id: rental.vehicleId,
        },
        data: {
          status: vehicleStatus,
        },
      }),
    ])
    
    return NextResponse.json(updatedRental)
  } catch (error) {
    console.error("Error updating rental status:", error)
    return NextResponse.json(
      { error: "Failed to update rental status" },
      { status: 500 }
    )
  }
}