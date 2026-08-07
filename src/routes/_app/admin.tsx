import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Pathora" },
      { name: "description", content: "Admin Panel on Pathora: part of your student-to-professional growth path." },
      { property: "og:title", content: "Admin Panel — Pathora" },
      { property: "og:description", content: "Admin Panel on Pathora: part of your student-to-professional growth path." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <CardDescription>
            This section is being built next — your profile, skills and roadmap data are already
            stored and will power it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Ask me to build the Admin Panel next and it will be wired to your live data.
        </CardContent>
      </Card>
    </div>
  );
}
