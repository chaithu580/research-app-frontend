import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Upload,
  MessageSquare,
  Network,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "PDF Upload",
      description: "Seamlessly upload research papers and extract insights",
    },
    {
      icon: MessageSquare,
      title: "AI Summarization",
      description: "Generate intelligent summaries with RAG technology",
    },
    {
      icon: Network,
      title: "Topic Clustering",
      description: "Discover patterns and group similar research themes",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Lightning-quick analysis powered by Gemini AI",
    },
    {
      icon: Shield,
      title: "Citation Extraction",
      description: "Automatically identify and extract all citations",
    },
    {
      icon: TrendingUp,
      title: "Smart Comparison",
      description: "Compare abstracts and measure similarity scores",
    },
  ];

  return (
    <div className="space-y-16 animate-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 text-white shadow-glow">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Transform Research Papers into
            <br />
            <span className="text-white/90">Actionable Insights</span>
          </h1>

          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Upload PDFs, ask questions, and get intelligent summaries powered by
            advanced RAG technology and AI-driven analysis.
          </p>

          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/upload")}
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Paper
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/summarize")}
              className="border-2 border-white text-white hover:bg-white/10"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Summarizing
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for Research Analysis
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with intuitive design to help
            you extract maximum value from academic papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass rounded-3xl p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
            <p className="text-muted-foreground">Papers Analyzed</p>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">95%</div>
            <p className="text-muted-foreground">Accuracy Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">&lt;5s</div>
            <p className="text-muted-foreground">Average Processing</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Upload your first research paper and experience the power of AI-driven
          analysis.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/upload")}
          className="bg-gradient-primary text-white hover:opacity-90 shadow-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Get Started Now
        </Button>
      </section>
    </div>
  );
}
