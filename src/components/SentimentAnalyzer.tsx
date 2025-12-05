import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Sparkles, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  sentiment: "positive" | "neutral" | "negative";
  score: number; // 0–100 from backend
}

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Replace this with your real endpoint later
      const res = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult({ sentiment: data.sentiment, score: data.score });
    } catch {
      setError("Unable to reach server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const sentimentConfig = {
    positive: { color: "emerald", emoji: "😊", label: "Positive" },
    neutral:  { color: "yellow",  emoji: "😐", label: "Neutral" },
    negative: { color: "red",     emoji: "😞", label: "Negative" },
  };

  const config = result ? sentimentConfig[result.sentiment] : null;
  const signedScore = result
    ? result.sentiment === "negative"
      ? -result.score
      : result.sentiment === "neutral"
      ? 0
      : result.score
    : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-3 text-indigo-600 mb-6">
            <Twitter className="w-10 h-10" />
            <span className="text-2xl font-bold">Tweet Sentiment Analyzer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Understand Emotions in Real Time
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste any tweet or any short text and instantly discover if it's positive, neutral, or negative.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-20">
          {/* Input Card */}
          <Card className="bg-white/80 shadow-2xl border-0 ring-1 ring-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Try it now</CardTitle>
              <CardDescription className="text-base">
                Type or paste your text below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="I just got the new iPhone and it's absolutely incredible! The camera is insane"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-40 text-lg resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              />

              <Button
                onClick={analyzeSentiment}
                disabled={loading || !text.trim()}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg transform transition hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Analyze Sentiment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Loading */}
          {loading && (
            <Card className="mt-8 bg-white/70 shadow-xl">
              <CardContent className="pt-10 pb-12">
                <Skeleton className="h-48 w-full rounded-xl" />
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mt-8">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Result – Beautiful Big Card */}
          {result && !loading && config && (
            <Card
              className={cn(
                "mt-8 overflow-hidden shadow-2xl border-0 transform transition-all duration-700 scale-100 hover:scale-[1.02]",
                config.color === "emerald" && "bg-gradient-to-br from-emerald-500 to-teal-600",
                config.color === "yellow"  && "bg-gradient-to-br from-amber-500 to-orange-500",
                config.color === "red"     && "bg-gradient-to-br from-rose-600 to-red-700"
              )}
            >
              <CardHeader className="text-white pb-8">
                <CardTitle className="text-5xl font-bold flex items-center justify-center gap-4">
                  <span className="text-7xl">{config.emoji}</span>
                  <span>{config.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-8 pb-12 bg-white/95">
                <p className="text-2xl text-gray-600 mb-4">Sentiment Score</p>
                <div className={cn(
                  "text-8xl font-bold",
                  signedScore > 0 && "text-emerald-600",
                  signedScore < 0 && "text-rose-600",
                  signedScore === 0 && "text-gray-600"
                )}>
                  {signedScore > 0 && "+"}{signedScore}
                </div>
                <p className="text-lg text-gray-500 mt-3">out of 100</p>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-sm text-gray-500 mt-16">
            Built with React + shadcn/ui • Class Project 2025
          </p>
        </div>
      </div>
    </>
  );
}