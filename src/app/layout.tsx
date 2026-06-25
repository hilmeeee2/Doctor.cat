import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "طبيب القات - لوحة الإدارة",
  description: "لوحة تحكم إدارة تطبيق طبيب القات للأمراض الزراعية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
