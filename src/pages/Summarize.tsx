import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api, SummarizeResponse } from "@/lib/api";
import { Sparkles, Send, Loader2, Copy, Check } from "lucide-react";

export default function Summarize() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a question or topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.summarize(query);
      setResult(response);
    } catch (error) {
      toast({
        title: "Summarization failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI-Powered Summarization</span>
        </div>
        <h1 className="text-3xl font-bold">Ask Questions About Your Papers</h1>
        <p className="text-muted-foreground">
          Query uploaded research papers and get intelligent AI-generated
          summaries
        </p>
      </div>

      <Card className="glass p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Question or Topic
            </label>
            <Textarea
              placeholder="E.g., What are the main findings about climate change impacts?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSummarize}
            disabled={loading || !query.trim()}
            className="bg-gradient-primary text-white w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="glass p-6 space-y-4 animate-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Summary
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {result.summary}
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <div className="glass px-4 py-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Context Used</p>
              <p className="text-lg font-semibold">{result.context_count}</p>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Citations Found</p>
              <p className="text-lg font-semibold">
                {result.citations_found.length}
              </p>
            </div>
          </div>

          {result.citations_found.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Citations Detected:</h4>
              <div className="flex flex-wrap gap-2">
                {result.citations_found.map((citation, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono"
                  >
                    {citation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
