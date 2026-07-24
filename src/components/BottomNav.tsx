"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, PlusCircle, User, LayoutDashboard, ClipboardList } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide on login, onboarding, or admin pages (since admin pages have their own layout usually, but here they might not)
  if (pathname === "/login" || pathname === "/onboarding") {
    return null;
  }

  // Hide if the user is not logged in (e.g., they are seeing the WelcomeGate on the home page)
  if (!session) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/" ? "text-blue-600" : "text-gray-500"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        
        <Link 
          href="/sell"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/sell" ? "text-blue-600" : "text-gray-500"}`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sell</span>
        </Link>
        
        <Link 
          href="/requests"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname.startsWith("/requests") ? "text-blue-600" : "text-gray-500"}`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-bold">Requests</span>
        </Link>
        
        {/* @ts-ignore */}
        {session?.user?.role === "ADMIN" && (
          <Link 
            href="/admin/products"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname.startsWith("/admin") ? "text-blue-600" : "text-gray-500"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Admin</span>
          </Link>
        )}

        <Link 
          href="/profile"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/profile" ? "text-blue-600" : "text-gray-500"}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </div>
  );
}
