"use client";

export default function Home() {
  return (
    <div className="bg-[var(--color-background)]">
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
