import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Lightbulb } from "lucide-react";

interface ApproachDisplayProps {
  approaches: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
}

export function ApproachDisplay({ approaches }: ApproachDisplayProps) {
  if (approaches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No approaches added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {approaches.map((approach, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Approach {index + 1}
            </CardTitle>
            {approach.title && (
              <p className="text-muted-foreground">{approach.title}</p>
            )}
          </CardHeader>
          {approach.description && (
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{approach.description}</code>
              </pre>
            </CardContent>
          )}
          <CardContent>
            {approach.code && (
              <CodeBlock
                code={approach.code}
                language={approach.language}
                title="Solution"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
