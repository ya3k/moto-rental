import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting seed operation...')
    
    // Create sample locations
    console.log('Creating locations...')
    const locations = [
      {
        name: 'Quận 1',
        address: '123 Nguyễn Huệ, Quận 1, TP. HCM',
        isActive: true,
      },
      {
        name: 'Quận 3',
        address: '456 Võ Văn Tần, Quận 3, TP. HCM',
        isActive: true,
      },
      {
        name: 'Quận 7',
        address: '789 Nguyễn Văn Linh, Quận 7, TP. HCM',
        isActive: true,
      },
    ]

    // Clear existing locations first
    await prisma.location.deleteMany()
    console.log('Existing locations deleted')
    
    // Create new locations
    for (const location of locations) {
      await prisma.location.create({
        data: location,
      })
    }
    console.log('Locations created successfully')

    // Create sample vehicles
    console.log('Creating vehicles...')
    
    // Clear existing vehicles first
    await prisma.vehicle.deleteMany()
    console.log('Existing vehicles deleted')
    
    const vehicles = [
      {
        name: 'Honda Wave Alpha',
        type: 'XE_SO',
        licensePlate: '59H1-12345',
        imageUrl: 'https://cdn.honda.com.vn/motorbikes/December2021/FBbnZZJPV2W3UrRvmlRr.png',
        pricePerDay: 150000,
        status: 'AVAILABLE',
        description: 'Xe số phổ thông tiết kiệm nhiên liệu, phù hợp đi lại trong thành phố.',
      },
      {
        name: 'Honda Air Blade',
        type: 'TAY_GA',
        licensePlate: '59H1-23456',
        imageUrl: 'https://cdn.honda.com.vn/motorbikes/December2021/ZsM0wQZdpLvfwkopTJ9F.png',
        pricePerDay: 200000,
        status: 'AVAILABLE',
        description: 'Xe tay ga thể thao, động cơ mạnh mẽ, phù hợp cho người thích tốc độ.',
      },
      {
        name: 'Honda Vision',
        type: 'TAY_GA',
        licensePlate: '59H1-34567',
        imageUrl: 'https://cdn.honda.com.vn/motorbikes/December2021/Av5Vr8rRfTojFs4zzEWa.png',
        pricePerDay: 180000,
        status: 'AVAILABLE',
        description: 'Xe tay ga nhỏ gọn, tiết kiệm nhiên liệu, phù hợp cho nữ giới.',
      },
      {
        name: 'Yamaha Exciter',
        type: 'XE_SO',
        licensePlate: '59H1-45678',
        imageUrl: 'https://yamaha-motor.com.vn/wp-content/uploads/2021/12/Exciter-155-GP.png',
        pricePerDay: 220000,
        status: 'AVAILABLE',
        description: 'Xe côn tay thể thao, động cơ mạnh mẽ, phù hợp cho người đam mê tốc độ.',
      },
      {
        name: 'Yamaha Grande',
        type: 'TAY_GA',
        licensePlate: '59H1-56789',
        imageUrl: 'https://yamaha-motor.com.vn/wp-content/uploads/2022/03/grande-xanh-1.jpg',
        pricePerDay: 190000,
        status: 'AVAILABLE',
        description: 'Xe tay ga cao cấp, thiết kế sang trọng, phù hợp cho nữ giới.',
      },
      {
        name: 'Suzuki Raider',
        type: 'XE_SO',
        licensePlate: '59H1-67890',
        imageUrl: 'https://suzuki.com.vn/images/Xe%20May/Raider/r150-xanh-den.png',
        pricePerDay: 210000,
        status: 'AVAILABLE',
        description: 'Xe côn tay thể thao, động cơ mạnh mẽ, thiết kế góc cạnh.',
      },
    ]

    for (const vehicle of vehicles) {
      await prisma.vehicle.create({
        data: vehicle,
      })
    }
    console.log('Vehicles created successfully')

    // Create a few sample rentals
    console.log('Creating sample rentals...')
    
    // Clear existing rentals first
    await prisma.rental.deleteMany()
    console.log('Existing rentals deleted')
    
    // Get created vehicles and locations for relationships
    const allVehicles = await prisma.vehicle.findMany()
    const allLocations = await prisma.location.findMany()
    
    if (allVehicles.length > 0 && allLocations.length > 0) {
      // Create two sample rentals
      const rentals = [
        {
          customerName: 'Nguyễn Văn A',
          customerPhone: '0901234567',
          vehicleId: allVehicles[0].id,
          pickUpLocationId: allLocations[0].id,
          dropOffLocationId: allLocations[0].id,
          pickUpTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          dropOffTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
          status: 'PENDING',
        },
        {
          customerName: 'Trần Thị B',
          customerPhone: '0909876543',
          vehicleId: allVehicles[1].id,
          pickUpLocationId: allLocations[1].id,
          dropOffLocationId: allLocations[2].id,
          pickUpTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          dropOffTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          status: 'ACTIVE',
        },
      ]
      
      for (const rental of rentals) {
        await prisma.rental.create({
          data: rental,
        })
      }
      
      // Update the status of rented vehicles
      await prisma.vehicle.update({
        where: { id: allVehicles[1].id },
        data: { status: 'RENTED' },
      })
      
      console.log('Sample rentals created successfully')
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error('Error in seed script:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('Prisma disconnected')
  }) 