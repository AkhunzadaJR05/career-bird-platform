import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-teal-400">
          Loading...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
