"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user || pathname === "/login") return null;

  return (
    <header className="bg-[var(--color-primary)] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          طبيب القات - لوحة الإدارة
        </Link>
        <nav className="flex gap-6 items-center font-semibold">
          <Link href="/" className={`hover:text-[var(--color-accent)] transition-colors ${pathname === "/" ? "text-[var(--color-accent)]" : ""}`}>
            الرئيسية
          </Link>
          <Link href="/users" className={`hover:text-[var(--color-accent)] transition-colors ${pathname === "/users" ? "text-[var(--color-accent)]" : ""}`}>
            المستخدمين
          </Link>
          <Link href="/diseases" className={`hover:text-[var(--color-accent)] transition-colors ${pathname === "/diseases" ? "text-[var(--color-accent)]" : ""}`}>
            الأمراض والآفات
          </Link>
          <Link href="/advice" className={`hover:text-[var(--color-accent)] transition-colors ${pathname === "/advice" ? "text-[var(--color-accent)]" : ""}`}>
            النصائح
          </Link>
          <Link href="/chats" className={`hover:text-[var(--color-accent)] transition-colors ${pathname === "/chats" ? "text-[var(--color-accent)]" : ""}`}>
            المحادثات
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <span className="bg-[var(--color-accent)] text-black px-3 py-1 rounded-full text-sm font-bold">المدير العام</span>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
