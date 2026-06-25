"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ProtectedRoute will automatically redirect to "/"
    } catch (err: any) {
      setError("فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-[var(--color-secondary)]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-primary)]">
            طبيب القات
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-foreground)]">
            تسجيل الدخول للوحة الإدارة
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:z-10 sm:text-sm"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:z-10 sm:text-sm"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-semibold bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 transition-colors"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
