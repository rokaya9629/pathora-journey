import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/skills")({
  head: () => ({
    meta: [
      { title: "Skills Gap — Pathora" },
      { name: "description", content: "Skills Gap on Pathora: part of your student-to-professional growth path." },
      { property: "og:title", content: "Skills Gap — Pathora" },
      { property: "og:description", content: "Skills Gap on Pathora: part of your student-to-professional growth path." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Skills Gap</CardTitle>
          <CardDescription>
            This section is being built next — your profile, skills and roadmap data are already
            stored and will power it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Ask me to build the Skills Gap next and it will be wired to your live data.
        </CardContent>
      </Card>
    </div>
  );
}
