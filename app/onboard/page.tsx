
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardPage() {
  console.log("--- ONBOARD PAGE HIT ---");
  
  const { userId } = await auth();
  console.log("userId:", userId);

  if (!userId) {
    console.log("Redirecting to /sign-in");
    redirect("/sign-in");
  }

  const userOnboarded = true;

  if (userOnboarded) {
    console.log("Redirecting to /dashboard");
    redirect("/dashboard");
  }

  console.log("Redirecting to /setup");
  redirect("/setup");
  
}