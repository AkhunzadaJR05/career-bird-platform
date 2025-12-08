import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-cyan-400">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
