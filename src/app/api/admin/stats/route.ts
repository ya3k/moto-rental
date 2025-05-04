import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/admin/stats - Get statistics for admin dashboard
export async function GET() {
  try {
    // Get count of pending rentals
    const pendingRentals = await prisma.rental.count({
      where: {
        status: "PENDING",
      },
    })
    
    // Get count of active rentals
    const activeRentals = await prisma.rental.count({
      where: {
        status: "ACTIVE",
      },
    })
    
    // Get count of completed rentals
    const completedRentals = await prisma.rental.count({
      where: {
        status: "COMPLETED",
      },
    })
    
    // Get count of available vehicles
    const availableVehicles = await prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    })
    
    // Get total count of vehicles
    const totalVehicles = await prisma.vehicle.count()
    
    // Get count of active locations
    const locations = await prisma.location.count({
      where: {
        isActive: true,
      },
    })
    
    // Calculate total revenue from completed rentals
    const completedRentalsWithPrice = await prisma.rental.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        vehicle: {
          select: {
            pricePerDay: true,
          },
        },
      },
    })
    
    // Calculate total revenue based on rental duration and vehicle price
    let totalRevenue = 0
    let monthlyRevenue = 0
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    completedRentalsWithPrice.forEach(rental => {
      const days = Math.ceil(
        (rental.dropOffTime.getTime() - rental.pickUpTime.getTime()) / (1000 * 60 * 60 * 24)
      )
      const rentalRevenue = parseFloat(rental.vehicle.pricePerDay.toString()) * days
      
      totalRevenue += rentalRevenue
      
      // Add to monthly revenue if completed this month
      if (rental.updatedAt >= startOfMonth) {
        monthlyRevenue += rentalRevenue
      }
    })
    
    // Get recent rentals
    const recentRentals = await prisma.rental.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        vehicle: {
          select: {
            name: true,
            licensePlate: true,
          },
        },
        pickUpLocation: {
          select: {
            name: true,
          },
        },
        dropOffLocation: {
          select: {
            name: true,
          },
        },
      },
    })
    
    // Return statistics
    return NextResponse.json({
      pendingRentals,
      activeRentals,
      completedRentals,
      availableVehicles,
      totalVehicles,
      locations,
      totalRevenue,
      monthlyRevenue,
      recentRentals,
    })
  } catch (error) {
    console.error("Error fetching admin statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    )
  }
} 