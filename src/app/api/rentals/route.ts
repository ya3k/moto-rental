import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/rentals - Get all rentals
export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vehicle: true,
        pickUpLocation: true,
        dropOffLocation: true,
      },
    })
    
    return NextResponse.json(rentals)
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    )
  }
}

// POST /api/rentals - Create a new rental
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.vehicleId || !body.customerName || !body.customerPhone || 
        !body.pickUpLocationId || !body.dropOffLocationId || 
        !body.pickUpTime || !body.dropOffTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Check if vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: body.vehicleId,
        status: "AVAILABLE",
      },
    })
    
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found or not available" },
        { status: 400 }
      )
    }
    
    // Check if locations exist
    const pickUpLocation = await prisma.location.findUnique({
      where: {
        id: body.pickUpLocationId,
        isActive: true,
      },
    })
    
    const dropOffLocation = await prisma.location.findUnique({
      where: {
        id: body.dropOffLocationId,
        isActive: true,
      },
    })
    
    if (!pickUpLocation || !dropOffLocation) {
      return NextResponse.json(
        { error: "Invalid pickup or dropoff location" },
        { status: 400 }
      )
    }
    
    // Create rental
    const rental = await prisma.rental.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        vehicleId: body.vehicleId,
        pickUpLocationId: body.pickUpLocationId,
        dropOffLocationId: body.dropOffLocationId,
        pickUpTime: new Date(body.pickUpTime),
        dropOffTime: new Date(body.dropOffTime),
        status: "PENDING",
      },
      include: {
        vehicle: true,
        pickUpLocation: true,
        dropOffLocation: true,
      },
    })
    
    return NextResponse.json(rental, { status: 201 })
  } catch (error) {
    console.error("Error creating rental:", error)
    return NextResponse.json(
      { error: "Failed to create rental" },
      { status: 500 }
    )
  }
} 