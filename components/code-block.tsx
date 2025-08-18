"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Eye, EyeOff } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      python: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      javascript:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      java: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      cpp: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      c: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      typescript:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    return (
      colors[lang] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <Card className="gap-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title && <CardTitle className="text-sm">{title}</CardTitle>}
            <Badge className={getLanguageColor(language)}>{language}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {/* Code block */}
        <pre className={`bg-muted p-4 rounded-md overflow-x-auto text-sm `}>
          <code className={`font-mono ${hidden ? "blur-sm select-none" : ""}`}>
            {code}
          </code>
          {/* Eye toggle button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-6"
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </pre>
      </CardContent>
    </Card>
  );
}
