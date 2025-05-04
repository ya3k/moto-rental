import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ThanksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Đặt xe thành công!</h1>
            <p className="text-gray-500">
              Cảm ơn bạn đã sử dụng dịch vụ thuê xe của chúng tôi.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p>
                Đơn đặt xe của bạn đã được ghi nhận trong hệ thống. Chúng tôi sẽ liên hệ với bạn 
                qua số điện thoại để xác nhận chi tiết.
              </p>
              <p className="text-sm text-gray-500">
                (Đơn đặt xe có hiệu lực sau khi nhận xe và ký hợp đồng)
              </p>
            </div>
            <div className="pt-4 border-t">
              <Link href="/">
                <Button className="w-full">Quay lại trang chủ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 