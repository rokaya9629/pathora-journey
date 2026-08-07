import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Pathora" },
      { name: "description", content: "Achievements on Pathora: part of your student-to-professional growth path." },
      { property: "og:title", content: "Achievements — Pathora" },
      { property: "og:description", content: "Achievements on Pathora: part of your student-to-professional growth path." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Achievements</CardTitle>
          <CardDescription>
            This section is being built next — your profile, skills and roadmap data are already
            stored and will power it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Ask me to build the Achievements next and it will be wired to your live data.
        </CardContent>
      </Card>
    </div>
  );
}
