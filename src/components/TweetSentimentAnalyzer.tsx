import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Smile,
  Meh,
  Frown,
  Heart,
  BarChart3,
  MessageCircle,
  Repeat2,
  Share,
  ArrowLeft,
  Twitter,
} from 'lucide-react';

type Sentiment = 'positive' | 'neutral' | 'negative';

interface SentimentResult {
  id: string;
  text: string;
  sentiment: Sentiment;
  score: number;
  timestamp: number;
}

type ViewMode = 'feed' | 'split';

export default function TweetSentimentAnalyzer() {
  const [tweetText, setTweetText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SentimentResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('feed');

  const clampScore = (n: number) => Math.max(-100, Math.min(100, Math.round(n)));

  const analyzeTweet = async () => {
    if (!tweetText.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      const text = tweetText.toLowerCase();
      let score = 0;
      if (text.includes('love') || text.includes('great') || text.includes('awesome')) score += 45;
      if (text.includes('like') || text.includes('nice')) score += 15;
      if (text.includes('hate') || text.includes('terrible') || text.includes('awful')) score -= 55;
      if (text.includes('smile') || text.includes('happy')) score += 10;
      if (text.includes('angry') || text.includes('mad')) score -= 15;

      score = clampScore(score + Math.round((Math.random() - 0.5) * 18));
      const sentiment: Sentiment = score > 10 ? 'positive' : score < -10 ? 'negative' : 'neutral';

      const newResult: SentimentResult = {
        id: Date.now().toString(),
        text: tweetText,
        sentiment,
        score,
        timestamp: Date.now(),
      };

      setResults((prev) => [newResult, ...prev]);
      setTweetText('');
    } catch {
      setError('Analysis failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openSplitView = (result: SentimentResult) => {
    setSelectedResult(result);
    setViewMode('split');
  };

  const closeSplitView = () => {
    setViewMode('feed');
    setSelectedResult(null);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'split') closeSplitView();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-white">
      {/* Feed View stays visible — no fading, no shifting */}
      <div
        className={`transition-all duration-500 ${
          viewMode === 'split' ? 'opacity-40 blur-sm' : 'opacity-100 blur-0'
        }`}
      >
        <ClassicFeedLayout
          tweetText={tweetText}
          setTweetText={setTweetText}
          analyzeTweet={analyzeTweet}
          isLoading={isLoading}
          error={error}
          setError={setError}
          results={results}
          onOpenResult={openSplitView}
        />
      </div>
      
      {/* Split View (RIGHT SLIDE IN)*/}
      <div
        className={`fixed inset-y-0 right-0 top-0 max-w-7xl w-full bg-white shadow-2xl border-l transition-transform duration-500 ease-out z-50 
          ${viewMode === 'split' ? 'translate-x-0' : 'translate-x-full'}`
        }
      >
        <button
          onClick={closeSplitView}
          className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {selectedResult && <SplitDetailView result={selectedResult} />}
      </div>
    </div>
  );
}

/* ========================= Classic Feed Layout ========================= */
const ClassicFeedLayout: React.FC<{
  tweetText: string;
  setTweetText: (v: string) => void;
  analyzeTweet: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (e: string | null) => void;
  results: SentimentResult[];
  onOpenResult: (r: SentimentResult) => void;
}> = ({ tweetText, setTweetText, analyzeTweet, isLoading, error, setError, results, onOpenResult }) => {
  return (
    <>
      <div className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-xl font-bold text-gray-900">Sentiment Analyzer</h1>
            <Twitter className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl py-6">
        {/* Composer */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What's happening?"
                className="w-full min-h-[120px] text-xl text-gray-900 placeholder-gray-500 focus:outline-none resize-none"
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">{tweetText.length}/280</span>
                <button
                  onClick={analyzeTweet}
                  disabled={isLoading || !tweetText.trim()}
                  className="px-6 py-2.5 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              ×
            </button>
          </div>
        )}

        {/* Results Timeline */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No analyses yet. Type something and hit Analyze!</p>
            </div>
          ) : (
            results.map((result) => (
              <ResultTweet key={result.id} result={result} onClick={() => onOpenResult(result)} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

/* ========================= Result Tweet Card ========================= */
const ResultTweet: React.FC<{
  result: SentimentResult;
  onClick: () => void;
}> = ({ result, onClick }) => {
  const timeAgo = useMemo(() => {
    const sec = (Date.now() - result.timestamp) / 1000;
    if (sec < 60) return 'now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    return `${Math.floor(sec / 3600)}h`;
  }, [result.timestamp]);

  const bgColor =
    result.sentiment === 'positive'
      ? 'hover:bg-green-50'
      : result.sentiment === 'negative'
      ? 'hover:bg-red-50'
      : 'hover:bg-gray-50';

  const icons = [MessageCircle, Repeat2, Heart, Share] as const;

  return (
    <div
      onClick={onClick}
      className={`border border-gray-200 rounded-2xl ${bgColor} transition-all cursor-pointer group`}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">Sentiment AI</span>
              <span className="text-gray-500">@sentiment_ai · {timeAgo}</span>
            </div>
            <p className="text-gray-900 mb-3 whitespace-pre-wrap">"{result.text}"</p>

            <div className="flex items-center gap-4">
              <SentimentBadge result={result} />
              <span className="font-mono text-lg font-bold text-gray-700">
                {result.score > 0 ? '+' : ''}{result.score}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 text-gray-500">
          {icons.map((IconComponent, i) => (
            <button
              key={i}
              className="p-2 rounded-full hover:bg-gray-100 transition-all group-hover:text-blue-500"
            >
              <IconComponent className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================= Split Detail View ========================= */
const SplitDetailView: React.FC<{ result: SentimentResult }> = ({ result }) => {
  return (
    <div className="flex w-full h-screen">
      {/* Left: Original Tweet */}
      <div className="w-1/2 border-r border-gray-200 p-10 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Original Tweet</h2>
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
            <div>
              <div className="font-bold text-lg">You</div>
              <p className="text-gray-600">@user · just now</p>
            </div>
          </div>
          <p className="mt-6 text-xl leading-relaxed text-gray-900 whitespace-pre-wrap">
            {result.text}
          </p>
        </div>
      </div>

      {/* Right: Analysis */}
      <div className="w-1/2 bg-gray-50 p-10 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sentiment Analysis</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div
              className={`rounded-3xl p-12 text-center shadow-2xl border-4 ${
                result.sentiment === 'positive'
                  ? 'bg-green-50 border-green-300'
                  : result.sentiment === 'negative'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 ${
                  result.sentiment === 'positive'
                    ? 'bg-green-100'
                    : result.sentiment === 'negative'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}
              >
                {result.sentiment === 'positive' ? (
                  <Smile className="w-16 h-16 text-green-600" />
                ) : result.sentiment === 'negative' ? (
                  <Frown className="w-16 h-16 text-red-600" />
                ) : (
                  <Meh className="w-16 h-16 text-gray-600" />
                )}
              </div>

              <h3
                className={`text-5xl font-black mb-4 capitalize ${
                  result.sentiment === 'positive'
                    ? 'text-green-600'
                    : result.sentiment === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {result.sentiment}
              </h3>

              <div
                className={`text-8xl font-black mb-2 ${
                  result.score > 0 ? 'text-green-600' : result.score < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {result.score > 0 ? '+' : ''}{result.score}
              </div>
              <p className="text-gray-600 text-lg">Sentiment Score</p>

              <div className="mt-10 h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    result.sentiment === 'positive'
                      ? 'bg-green-500'
                      : result.sentiment === 'negative'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                  style={{ width: `${Math.abs(result.score)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================= Shared Badge ========================= */
function SentimentBadge({ result }: { result: SentimentResult }) {
  const { sentiment, score } = result;
  const colors =
    sentiment === 'positive'
      ? 'bg-green-100 text-green-800'
      : sentiment === 'negative'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800';

  const Icon = sentiment === 'positive' ? Smile : sentiment === 'negative' ? Frown : Meh;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${colors}`}>
      <Icon className="w-5 h-5" />
      <span className="capitalize">{sentiment}</span>
      <span className="font-mono ml-1">({score > 0 ? '+' : ''}{score})</span>
    </div>
  );
}