import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type ParamsType = Promise<{ id: string }>

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