import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api, ClusterResponse } from "@/lib/api";
import { Network, Loader2, RefreshCw } from "lucide-react";

export default function Clusters() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClusterResponse | null>(null);
  const { toast } = useToast();

  const handleCluster = async () => {
    setLoading(true);
    try {
      const response = await api.clusterTopics();
      setResult(response);
    } catch (error) {
      toast({
        title: "Clustering failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCluster();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Topic Clustering</h1>
          <p className="text-muted-foreground">
            Discover patterns and themes across your research papers
          </p>
        </div>
        <Button
          onClick={handleCluster}
          variant="outline"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && !result ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Analyzing topics...</p>
        </div>
      ) : result ? (
        <div className="grid gap-4">
          {result.clusters.map((cluster, idx) => (
            <Card
              key={idx}
              className="glass p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">
                    Topic Cluster {idx + 1}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cluster.map((term, termIdx) => (
                      <span
                        key={termIdx}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No data to cluster</h3>
          <p className="text-muted-foreground">
            Upload and process papers first to see topic clusters
          </p>
        </Card>
      )}

      <Card className="glass p-4 space-y-2">
        <h4 className="font-medium text-sm">About Topic Clustering:</h4>
        <p className="text-sm text-muted-foreground">
          Using TF-IDF vectorization and K-Means clustering, we group similar
          content from your papers and extract the most representative keywords
          for each cluster.
        </p>
      </Card>
    </div>
  );
}
