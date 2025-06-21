import { Sparkles, Heart, AlertTriangle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type BurnoutResult } from "@/lib/burnoutScoring";

interface BurnoutResultsProps {
  results: BurnoutResult;
  onRestart: () => void;
}

export default function BurnoutResults({ results, onRestart }: BurnoutResultsProps) {
  const getIcon = () => {
    switch (results.color) {
      case "emerald":
        return <Sparkles className="w-12 h-12 text-white" />;
      case "amber":
        return <Heart className="w-12 h-12 text-white" />;
      case "red":
        return <AlertTriangle className="w-12 h-12 text-white" />;
      default:
        return <Sparkles className="w-12 h-12 text-white" />;
    }
  };

  const getEmoji = () => {
    switch (results.color) {
      case "emerald":
        return "✨";
      case "amber":
        return "💫";
      case "red":
        return "🌿";
      default:
        return "✨";
    }
  };

  const getBgGradient = () => {
    switch (results.color) {
      case "emerald":
        return "bg-gradient-to-br from-green-400 to-emerald-500";
      case "amber":
        return "bg-gradient-to-br from-orange-400 to-amber-500";
      case "red":
        return "bg-gradient-to-br from-red-400 to-pink-500";
      default:
        return "bg-gradient-to-br from-green-400 to-emerald-500";
    }
  };

  const shareResults = async () => {
    const resultText = `번아웃 체크 결과: ${results.score}점 (${results.category})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '번아웃 체크 결과',
          text: resultText,
          url: window.location.href
        });
      } catch (error) {
        await navigator.clipboard.writeText(`${resultText}\n${window.location.href}`);
        alert('결과가 클립보드에 복사되었어요!');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${resultText}\n${window.location.href}`);
        alert('결과가 클립보드에 복사되었어요!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${getBgGradient()} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            {getIcon()}
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">체크 완료!</h2>
          <div className="text-5xl font-bold mb-2 text-black">
            {results.score}점
          </div>
          <p className="text-gray-500">총 75점 중</p>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl mb-6">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="text-3xl">{getEmoji()}</div>
              <h3 className="text-2xl font-bold text-black mb-3">
                {results.category}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {results.message}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-black mb-3">💡 나에게 도움되는 것들</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{rec.includes("전문가 상담") ? <strong>{rec}</strong> : rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={onRestart}
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            다시 체크하기
          </Button>
          <Button
            onClick={shareResults}
            variant="outline"
            className="w-full bg-white border-gray-300 text-gray-700 font-medium py-4 rounded-2xl transition-all duration-300"
          >
            <Share className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          가벼운 자가체크용이에요<br/>
          정확한 진단은 전문가와 상담하세요
        </p>
      </div>
    </div>
  );
}
