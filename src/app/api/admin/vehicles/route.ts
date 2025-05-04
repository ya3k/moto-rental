import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/admin/vehicles - Get all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    )
  }
}

// POST /api/admin/vehicles - Create a new vehicle
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.licensePlate || !body.type) {
      return NextResponse.json(
        { error: "Name, license plate, and type are required" },
        { status: 400 }
      )
    }
    
    // Check if license plate is already used
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        licensePlate: body.licensePlate,
      },
    })
    
    if (existingVehicle) {
      return NextResponse.json(
        { error: "License plate is already in use" },
        { status: 400 }
      )
    }
    
    const vehicle = await prisma.vehicle.create({
      data: {
        name: body.name,
        type: body.type,
        licensePlate: body.licensePlate,
        imageUrl: body.imageUrl || null,
        pricePerDay: body.pricePerDay,
        status: body.status || "AVAILABLE",
        description: body.description || null,
      },
    })
    
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    )
  }
} 