import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/locations/[id] - Get location by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id: params.id,
      },
    })
    
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(location)
  } catch (error) {
    console.error("Error fetching location:", error)
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    )
  }
}

// PATCH /api/locations/[id] - Update a location
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: {
        id: params.id,
      },
    })
    
    if (!existingLocation) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }
    
    // Update location
    const updatedLocation = await prisma.location.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name ?? existingLocation.name,
        address: body.address ?? existingLocation.address,
        isActive: body.isActive !== undefined ? body.isActive : existingLocation.isActive,
      },
    })
    
    return NextResponse.json(updatedLocation)
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    )
  }
}

// DELETE /api/locations/[id] - Delete a location
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: {
        id: params.id,
      },
      include: {
        pickUps: {
          take: 1, // Just checking if there's any related rental
        },
        dropOffs: {
          take: 1, // Just checking if there's any related rental
        },
      },
    })
    
    if (!existingLocation) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }
    
    // Check if location is being used by any rental
    if (existingLocation.pickUps.length > 0 || existingLocation.dropOffs.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete a location that is being used by rentals" },
        { status: 400 }
      )
    }
    
    // Delete location
    await prisma.location.delete({
      where: {
        id: params.id,
      },
    })
    
    return NextResponse.json(
      { message: "Location deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    )
  }
} 