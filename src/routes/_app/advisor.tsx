import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/advisor")({
  head: () => ({
    meta: [
      { title: "Career Advisor — Pathora" },
      { name: "description", content: "Career Advisor on Pathora: part of your student-to-professional growth path." },
      { property: "og:title", content: "Career Advisor — Pathora" },
      { property: "og:description", content: "Career Advisor on Pathora: part of your student-to-professional growth path." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Career Advisor</CardTitle>
          <CardDescription>
            This section is being built next — your profile, skills and roadmap data are already
            stored and will power it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Ask me to build the Career Advisor next and it will be wired to your live data.
        </CardContent>
      </Card>
    </div>
  );
}
