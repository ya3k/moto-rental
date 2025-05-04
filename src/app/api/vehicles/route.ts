import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { VehicleType } from "@/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") as VehicleType | null

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
        ...(type ? { type } : {}),
      },
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