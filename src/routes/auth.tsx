import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/pathora/ui-bits";

const searchSchema = z.object({
  mode: z.enum(["login", "register", "forgot"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in to Pathora" },
      {
        name: "description",
        content:
          "Log in or create your free Pathora account to get your career readiness score, roadmap and matched opportunities.",
      },
      { property: "og:title", content: "Sign in to Pathora" },
      {
        property: "og:description",
        content: "Create your free Pathora account and start building your path from student to professional.",
      },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register" | "forgot">(mode ?? "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<"confirm" | "reset" | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (tab === "forgot") {
        const parsed = z.string().trim().email().safeParse(email);
        if (!parsed.success) {
          toast.error("Enter a valid email address");
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("reset");
        return;
      }

      const parsed = credentials.safeParse({ email, password });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Check your details");
        return;
      }

      if (tab === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent("confirm");
          return;
        }
        toast.success("Welcome to Pathora!");
        navigate({ to: "/onboarding" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  if (sent) {
    return (
      <Wrapper>
        <Card className="glass-card w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="mx-auto size-8 text-primary" />
            <CardTitle className="mt-2">Check your email</CardTitle>
            <CardDescription>
              {sent === "confirm"
                ? `We sent a confirmation link to ${email}. Confirm it to activate your account.`
                : `We sent a password reset link to ${email}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setSent(null)}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card className="glass-card w-full max-w-md shadow-glow">
        <CardHeader>
          <CardTitle className="text-2xl">
            {tab === "register"
              ? "Create your account"
              : tab === "forgot"
                ? "Reset your password"
                : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {tab === "forgot"
              ? "We'll email you a secure link to set a new password."
              : "Your path from student to professional starts here."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tab !== "forgot" && (
            <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {tab === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  maxLength={100}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Hassan"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
              />
            </div>
            {tab !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {tab === "login" && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => setTab("forgot")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete={tab === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
            )}
            <Button type="submit" disabled={busy} className="gradient-surface w-full shadow-glow">
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              {tab === "register"
                ? "Create account"
                : tab === "forgot"
                  ? "Send reset link"
                  : "Log in"}
            </Button>
          </form>

          {tab === "forgot" ? (
            <Button variant="ghost" className="w-full" onClick={() => setTab("login")}>
              <ArrowLeft className="mr-1 size-4" /> Back to sign in
            </Button>
          ) : (
            <>
              <div className="relative py-1 text-center text-xs text-muted-foreground">
                <span className="relative z-10 bg-card px-2">or</span>
                <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="soft-surface flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Link to="/">
        <Logo />
      </Link>
      {children}
      <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
        ← Back to homepage
      </Link>
    </div>
  );
}
