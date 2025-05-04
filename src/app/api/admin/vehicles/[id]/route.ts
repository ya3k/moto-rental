import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type ParamsType = Promise<{ id: string }>

// GET /api/admin/vehicles/[id] - Get vehicle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })
    
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/vehicles/[id] - Update a vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
    })
    
    if (!existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }
    
    // If license plate is changed, check if it's already used
    if (body.licensePlate && body.licensePlate !== existingVehicle.licensePlate) {
      const duplicatePlate = await prisma.vehicle.findUnique({
        where: {
          licensePlate: body.licensePlate,
        },
      })
      
      if (duplicatePlate) {
        return NextResponse.json(
          { error: "License plate is already in use" },
          { status: 400 }
        )
      }
    }
    
    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        licensePlate: body.licensePlate,
        imageUrl: body.imageUrl,
        pricePerDay: body.pricePerDay,
        status: body.status,
        description: body.description,
      },
    })
    
    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/vehicles/[id] - Delete a vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    
    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        rentals: {
          take: 1, // Just checking if there's any related rental
          where: {
            status: {
              in: ["PENDING", "CONFIRMED", "ACTIVE"] // Only care about active rentals
            }
          }
        }
      },
    })
    
    if (!existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }
    
    // Check if vehicle is being used by any active rental
    if (existingVehicle.rentals.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete a vehicle that has active rentals" },
        { status: 400 }
      )
    }
    
    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id },
    })
    
    return NextResponse.json(
      { message: "Vehicle deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    )
  }
} 