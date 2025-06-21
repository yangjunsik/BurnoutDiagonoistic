import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
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
        return <CheckCircle className="w-10 h-10 text-white" />;
      case "amber":
        return <AlertTriangle className="w-10 h-10 text-white" />;
      case "red":
        return <AlertCircle className="w-10 h-10 text-white" />;
      default:
        return <CheckCircle className="w-10 h-10 text-white" />;
    }
  };

  const getEmoji = () => {
    switch (results.color) {
      case "emerald":
        return "🌟";
      case "amber":
        return "⚠️";
      case "red":
        return "🚨";
      default:
        return "🌟";
    }
  };

  const getBgColor = () => {
    switch (results.color) {
      case "emerald":
        return "bg-emerald-500";
      case "amber":
        return "bg-amber-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-emerald-500";
    }
  };

  const getTextColor = () => {
    switch (results.color) {
      case "emerald":
        return "text-emerald-600";
      case "amber":
        return "text-amber-600";
      case "red":
        return "text-red-600";
      default:
        return "text-emerald-600";
    }
  };

  const getBorderColor = () => {
    switch (results.color) {
      case "emerald":
        return "border-emerald-200";
      case "amber":
        return "border-amber-200";
      case "red":
        return "border-red-200";
      default:
        return "border-emerald-200";
    }
  };

  const getBgColorLight = () => {
    switch (results.color) {
      case "emerald":
        return "bg-emerald-50";
      case "amber":
        return "bg-amber-50";
      case "red":
        return "bg-red-50";
      default:
        return "bg-emerald-50";
    }
  };

  const getTextColorDark = () => {
    switch (results.color) {
      case "emerald":
        return "text-emerald-900";
      case "amber":
        return "text-amber-900";
      case "red":
        return "text-red-900";
      default:
        return "text-emerald-900";
    }
  };

  const getTextColorMedium = () => {
    switch (results.color) {
      case "emerald":
        return "text-emerald-800";
      case "amber":
        return "text-amber-800";
      case "red":
        return "text-red-800";
      default:
        return "text-emerald-800";
    }
  };

  const shareResults = async () => {
    const resultText = `번아웃 자가진단 테스트 결과: ${results.score}점 (${results.category})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '번아웃 자가진단 테스트 결과',
          text: resultText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${resultText}\n${window.location.href}`);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${resultText}\n${window.location.href}`);
        alert('결과가 클립보드에 복사되었습니다!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 ${getBgColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {getIcon()}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">테스트 완료!</h2>
            <div className={`text-6xl font-bold mb-2 ${getTextColor()}`}>
              {results.score}
            </div>
            <p className="text-gray-600 mb-6">총 75점 중 {results.score}점</p>
          </div>

          <div className={`${getBgColorLight()} border ${getBorderColor()} rounded-xl p-6 mb-8`}>
            <h3 className={`font-bold ${getTextColorDark()} text-xl mb-3`}>
              {getEmoji()} {results.category}
            </h3>
            <p className={`${getTextColorMedium()} leading-relaxed`}>
              {results.message}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">💡 추천사항</h3>
            <ul className="text-gray-700 space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index}>
                  • {rec.includes("전문가 상담") ? <strong>{rec}</strong> : rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onRestart}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 h-auto"
            >
              다시 테스트하기
            </Button>
            <Button
              onClick={shareResults}
              variant="outline"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 h-auto"
            >
              결과 공유하기
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ℹ️ 정확한 진단은 전문가와 상담을 통해서만 가능합니다. 지속적인 증상이 있다면 전문의와 상담하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
