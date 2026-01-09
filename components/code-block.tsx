"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace("language-", "") || "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/30 border-b border-border/50 px-4 py-2 rounded-t-lg">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="size-3 mr-1" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderTop: "none",
          fontSize: "0.75rem",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-geist-mono), monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
