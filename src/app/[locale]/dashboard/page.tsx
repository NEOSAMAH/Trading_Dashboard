import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <DashboardContent />
      </div>
    </AuthGuard>
  );
}
