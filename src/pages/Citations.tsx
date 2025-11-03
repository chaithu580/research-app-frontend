"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Search, Loader2, Highlighter } from "lucide-react";
import { api } from "@/lib/api";

interface CitationsResponse {
  citations: string[];
  count: number;
}

export default function Citations() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CitationsResponse | null>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!text.trim()) {
      toast({
        title: "Text Required",
        description: "Please paste some text to extract citations.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.extractCitations(text);
      setResult(response);

      if (response.count === 0) {
        toast({
          title: "No Citations Found",
          description: "The text doesn't contain any recognizable citations.",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Extraction Failed",
        description:
          error instanceof Error ? error.message : "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** Highlight all found citations inside the text */
  const highlightCitations = (inputText: string, citations: string[]): string => {
    let highlighted = inputText;
    citations.forEach((c) => {
      // Escape regex special characters
      const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "g");
      highlighted = highlighted.replace(
        regex,
        `<mark class="bg-yellow-200 dark:bg-yellow-400/30 rounded px-1">${c}</mark>`
      );
    });
    return highlighted;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Citation Extraction</span>
        </div>
        <h1 className="text-3xl font-bold">Extract Citations</h1>
        <p className="text-muted-foreground">
          Automatically detect and extract academic citations from research text
        </p>
      </div>

      {/* Input Section */}
      <Card className="glass p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste Text or Summary
            </label>
            <Textarea
              placeholder="Paste your research text here... Citations like [1], (Smith et al., 2020) will be detected."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="resize-none font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleExtract}
            disabled={loading || !text.trim()}
            className="bg-gradient-primary text-white w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Extract Citations
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {result && (
        <>
          <Card className="glass p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Found {result.count} Citation{result.count !== 1 ? "s" : ""}
              </h3>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {result.count} total
              </div>
            </div>

            {result.count > 0 && (
              <div className="grid gap-2">
                {result.citations.map((citation, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <code className="flex-1 text-sm font-mono">{citation}</code>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Highlighted Text Preview */}
          {result.count > 0 && (
            <Card className="glass p-6 animate-in space-y-3">
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">Highlighted Preview</h3>
              </div>

              <pre
                className="text-sm font-mono whitespace-pre-wrap bg-muted/50 rounded-lg p-4 overflow-x-auto leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightCitations(text, result.citations),
                }}
              />
            </Card>
          )}
        </>
      )}

      {/* Supported Formats Info */}
      <Card className="glass p-4 space-y-2">
        <h4 className="font-medium text-sm">Supported Citation Formats:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Numeric: [1], [42], [123]</li>
          <li>• Author-Year: (Smith et al., 2020), (Jones, 2019)</li>
          <li>• APA-style inline and parenthetical formats</li>
        </ul>
      </Card>
    </div>
  );
}
