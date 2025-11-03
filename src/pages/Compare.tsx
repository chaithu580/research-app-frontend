import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { GitCompare, Loader2, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Compare() {
  const [original, setOriginal] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!original.trim() || !generated.trim()) {
      toast({
        title: "Both texts required",
        description: "Please provide both original and generated text",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.compareAbstracts(original, generated);
      setSimilarity(response.similarity_percent);
    } catch (error) {
      toast({
        title: "Comparison failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 80) return "High Similarity";
    if (score >= 60) return "Moderate Similarity";
    return "Low Similarity";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <GitCompare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Abstract Comparison</span>
        </div>
        <h1 className="text-3xl font-bold">Compare Text Similarity</h1>
        <p className="text-muted-foreground">
          Measure the similarity between original abstracts and AI-generated
          summaries
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass p-6">
          <label className="block text-sm font-medium mb-2">
            Original Abstract
          </label>
          <Textarea
            placeholder="Paste the original research abstract here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            className="resize-none"
          />
        </Card>

        <Card className="glass p-6">
          <label className="block text-sm font-medium mb-2">
            Generated Summary
          </label>
          <Textarea
            placeholder="Paste the AI-generated summary here..."
            value={generated}
            onChange={(e) => setGenerated(e.target.value)}
            rows={10}
            className="resize-none"
          />
        </Card>
      </div>

      <Button
        onClick={handleCompare}
        disabled={loading || !original.trim() || !generated.trim()}
        className="bg-gradient-primary text-white w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Comparing...
          </>
        ) : (
          <>
            <GitCompare className="w-5 h-5 mr-2" />
            Compare Similarity
          </>
        )}
      </Button>

      {similarity !== null && (
        <Card className="glass p-8 space-y-6 animate-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Similarity Score</h3>
            </div>
            <div
              className={`text-6xl font-bold mb-2 ${getSimilarityColor(
                similarity
              )}`}
            >
              {similarity}%
            </div>
            <p className="text-muted-foreground">
              {getSimilarityLabel(similarity)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Lexical Similarity</span>
              <span>{similarity}%</span>
            </div>
            <Progress value={similarity} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {similarity >= 80 ? "✓" : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1">High Match</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {similarity >= 60 && similarity < 80 ? "~" : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Moderate Match
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {similarity < 60 ? "✗" : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Low Match</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="glass p-4 space-y-2">
        <h4 className="font-medium text-sm">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          We use the SequenceMatcher algorithm to calculate lexical similarity
          between the two texts. The score represents how much the generated
          summary matches the original abstract word-for-word.
        </p>
      </Card>
    </div>
  );
}
