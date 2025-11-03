import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Upload as UploadIcon, FileText, CheckCircle2, X } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    filename: string;
    chunks: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await api.uploadPDF(file);
      setProgress(100);
      setResult({
        filename: response.filename,
        chunks: response.chunks,
      });
      toast({
        title: "Success!",
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Research Paper</h1>
        <p className="text-muted-foreground">
          Upload a PDF to process and extract insights using RAG technology
        </p>
      </div>

      <Card className="glass p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            file
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {!file ? (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <UploadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Drop your PDF here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse files
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-primary text-white"
              >
                Select PDF File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  disabled={uploading}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Processing... {progress}%
                  </p>
                </div>
              )}

              {!uploading && !result && (
                <Button
                  onClick={handleUpload}
                  className="bg-gradient-primary text-white w-full"
                  size="lg"
                >
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload & Process
                </Button>
              )}

              {result && (
                <div className="glass rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Upload Complete!</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Filename: {result.filename}</p>
                    <p>Chunks created: {result.chunks}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {result && (
        <Card className="glass p-6">
          <h3 className="font-semibold mb-3">Next Steps</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Your paper has been processed and vectorized</p>
            <p>✓ Ready for AI-powered summarization</p>
            <p>✓ Navigate to "Summarize" to start asking questions</p>
          </div>
        </Card>
      )}
    </div>
  );
}
