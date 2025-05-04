import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type ParamsType = Promise<{ id: string }>

// GET /api/locations/[id] - Get location by ID
export async function GET(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    
    const location = await prisma.location.findUnique({
      where: { id },
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
export async function PATCH(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate input
    if (!body.name || !body.address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      )
    }
    
    // Find location
    const location = await prisma.location.findUnique({
      where: { id },
    })
    
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }
    
    // Update location
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: body.name,
        address: body.address,
        isActive: body.isActive !== undefined ? body.isActive : location.isActive,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params
    
    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        pickUps: {
          take: 1, // Just check if there's any related rental
        },
        dropOffs: {
          take: 1, // Just check if there's any related rental
        },
      },
    })
    
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }
    
    // Check if location has rentals
    if (location.pickUps.length > 0 || location.dropOffs.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete location that is being used by rentals" },
        { status: 400 }
      )
    }
    
    // Delete location
    await prisma.location.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    )
  }
} 