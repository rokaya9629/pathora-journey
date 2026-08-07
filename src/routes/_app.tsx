import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useIsAdmin } from "@/hooks/usePathora";
import { AppShell } from "@/components/pathora/app-shell";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const profile = useProfile(user?.id);
  const isAdmin = useIsAdmin(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile.data && !profile.data.onboarding_complete) navigate({ to: "/onboarding" });
  }, [profile.data, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppShell
      name={profile.data?.full_name ?? ""}
      email={user.email ?? ""}
      xp={profile.data?.xp ?? 0}
      isAdmin={isAdmin.data ?? false}
      onSignOut={() => {
        void signOut().then(() => navigate({ to: "/" }));
      }}
    />
  );

}
