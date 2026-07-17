import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <LoginForm />
    </main>
  );
}
