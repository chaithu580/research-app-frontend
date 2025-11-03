import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { FileText, Trash2, RefreshCw, Loader2 } from "lucide-react";

export default function Papers() {
  const [papers, setPapers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPapers = async () => {
    setLoading(true);
    try {
      const response = await api.listPapers();
      setPapers(response.uploaded_papers);
    } catch (error) {
      toast({
        title: "Failed to load papers",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    setDeleting(filename);
    try {
      await api.deletePaper(filename);
      setPapers(papers.filter((p) => p !== filename));
      toast({
        title: "Deleted",
        description: `${filename} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Uploaded Papers</h1>
          <p className="text-muted-foreground">
            Manage your research paper collection
          </p>
        </div>
        <Button
          onClick={loadPapers}
          variant="outline"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : papers.length === 0 ? (
        <Card className="glass p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No papers uploaded</h3>
          <p className="text-muted-foreground mb-6">
            Upload your first research paper to get started
          </p>
          <Button
            onClick={() => (window.location.href = "/upload")}
            className="bg-gradient-primary text-white"
          >
            Upload Paper
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <Card key={paper} className="glass p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{paper}</p>
                    <p className="text-sm text-muted-foreground">PDF Document</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(paper)}
                  disabled={deleting === paper}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {deleting === paper ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {papers.length > 0 && (
        <Card className="glass p-4 text-sm text-muted-foreground">
          <p>
            <strong>{papers.length}</strong> paper{papers.length !== 1 ? "s" : ""}{" "}
            in your collection
          </p>
        </Card>
      )}
    </div>
  );
}
