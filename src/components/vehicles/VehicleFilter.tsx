import { Button } from "@/components/ui/button"
import { VehicleType } from "@/types"

interface VehicleFilterProps {
  selectedType: VehicleType | null
  onFilterChange: (type: VehicleType | null) => void
}

export function VehicleFilter({ selectedType, onFilterChange }: VehicleFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedType === null ? "default" : "outline"}
        onClick={() => onFilterChange(null)}
      >
        Tất cả
      </Button>
      <Button
        variant={selectedType === "TAY_GA" ? "default" : "outline"}
        onClick={() => onFilterChange("TAY_GA")}
      >
        Xe tay ga
      </Button>
      <Button
        variant={selectedType === "XE_SO" ? "default" : "outline"}
        onClick={() => onFilterChange("XE_SO")}
      >
        Xe số
      </Button>
    </div>
  )
} 