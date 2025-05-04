import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/types"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {vehicle.imageUrl ? (
            <Image
              src={vehicle.imageUrl}
              alt={vehicle.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
            {vehicle.type === "TAY_GA" ? "Xe tay ga" : "Xe số"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <h3 className="text-lg font-bold">{vehicle.name}</h3>
        <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
        {vehicle.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{vehicle.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold text-primary">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(vehicle.pricePerDay))}{" "}
          <span className="text-sm font-normal text-gray-500">/ngày</span>
        </p>
        <Link href={`/${vehicle.id}/rent`}>
          <Button>Thuê ngay</Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 