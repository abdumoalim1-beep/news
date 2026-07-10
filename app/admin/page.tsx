import { isAdminConfigured, isAuthenticated } from "@/lib/auth";
import { isGithubConfigured } from "@/lib/github";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  const authed = isAuthenticated();
  if (!authed) {
    return <LoginForm configured={isAdminConfigured()} />;
  }
  return <AdminDashboard githubMode={isGithubConfigured()} />;
}
