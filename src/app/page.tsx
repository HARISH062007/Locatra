"use client";

import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/screens/SplashScreen";

export default function AppLaunchScreen() {
  const router = useRouter();

  return (
    <SplashScreen 
      onComplete={(isAuthenticated) => {
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      }} 
    />
  );
}
