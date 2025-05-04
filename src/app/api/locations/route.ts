import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/locations - Get all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
    })
    
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

// POST /api/locations - Create a new location
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      )
    }
    
    const location = await prisma.location.create({
      data: {
        name: body.name,
        address: body.address,
        isActive: body.isActive ?? true,
      },
    })
    
    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    )
  }
} 