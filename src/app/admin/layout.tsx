"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === "/admin/login") return
    
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [isLoading, user, router, pathname])

  // If on login page or still loading, just render children
  if (pathname === "/admin/login" || isLoading) {
    return <>{children}</>
  }

  // If not authenticated and not on login page, don't render anything
  // (useEffect will redirect to login)
  if (!user && pathname !== "/admin/login") {
    return null
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/rentals", label: "Đơn Thuê" },
    { href: "/admin/vehicles", label: "Xe Máy" },
    { href: "/admin/locations", label: "Địa Điểm" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin/dashboard">
            <h1 className="text-xl font-bold">Quản Lý Thuê Xe</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm">
              {user?.email}
            </span>
            <Button 
              variant="outline" 
              className="text-black border-white hover:bg-primary/90"
              onClick={() => signOut().then(() => router.push("/admin/login"))}
            >
              Đăng xuất
            </Button>
            <Link href="/">
              <Button variant="outline" className="text-black border-white hover:bg-primary/90">
                Về Trang Chủ
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 border-r">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block p-2 rounded-md ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
} 