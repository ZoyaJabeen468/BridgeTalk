import type { Metadata } from "next";
import { ProfileView } from "@/components/auth/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your BridgeTalk profile, preferences, and progress.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
