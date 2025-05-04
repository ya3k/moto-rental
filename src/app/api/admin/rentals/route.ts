import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/admin/rentals - Get all rentals
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