"use client";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-[var(--color-primary)] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">طبيب القات - لوحة الإدارة</h1>
          <div className="flex gap-4 items-center">
            <span className="bg-[var(--color-accent)] text-black px-3 py-1 rounded-full text-sm font-bold">المدير العام</span>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quick Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">المستخدمين المسجلين</h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">--</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">الأمراض المضافة</h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">--</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">النصائح المنشورة</h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">--</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">المحادثات النشطة</h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">--</p>
          </div>
        </div>
      </main>
    </div>
  );
}
