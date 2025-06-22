import { Sparkles, Heart, AlertTriangle, Share, Download, Instagram, Twitter, ImageIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type BurnoutResult } from "@/lib/burnoutScoring";
import { generatePersonalizedComment } from "@/lib/personalizedComments";
import { generateMemeImage } from "@/lib/memeGenerator";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BurnoutResultsProps {
  results: BurnoutResult;
  answers: number[];
  onRestart: () => void;
}

export default function BurnoutResults({ results, answers, onRestart }: BurnoutResultsProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [memeImageUrl, setMemeImageUrl] = useState<string>("");
  const [personalizedComment, setPersonalizedComment] = useState<string>("");
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Generate personalized comment and meme on component mount
  useEffect(() => {
    const comment = generatePersonalizedComment(answers, results);
    setPersonalizedComment(comment);
    
    // Generate meme image automatically
    generateMemeImage(results, comment).then(url => {
      setMemeImageUrl(url);
    });
  }, [answers, results]);
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
        return "💡";
      case "red":
        return "🔄";
      default:
        return "✨";
    }
  };

  const getBgGradient = () => {
    switch (results.color) {
      case "emerald":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "amber":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "red":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      default:
        return "bg-gradient-to-br from-purple-500 to-pink-500";
    }
  };

  const openScreenshotModal = () => {
    setShowScreenshotModal(true);
  };

  const shareResults = async () => {
    const resultText = `번아웃 체크 결과: ${results.totalScore}점 (${results.category})`;
    
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



  const shareToSocial = (platform: string) => {
    const resultText = `번아웃 체크 결과: ${results.totalScore}점 (${results.category}) 😱\n\n나도 체크해보기 👉`;
    const url = window.location.origin;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}&url=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // 인스타그램은 직접 공유가 안되므로 클립보드 복사
        navigator.clipboard.writeText(`${resultText} ${url}`);
        alert('인스타그램용 텍스트가 클립보드에 복사되었어요!\n스토리나 피드에 붙여넣기 해주세요.');
        return;
      case 'kakao':
        shareUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(resultText)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const chartData = {
    labels: ['정서적 탈진', '냉소적 태도', '성취감 감소'],
    datasets: [
      {
        label: '영역별 점수',
        data: [
          results.categoryScores.exhaustion,
          results.categoryScores.cynicism,
          results.categoryScores.accomplishment
        ],
        backgroundColor: [
          'rgba(75, 85, 99, 0.8)',    // gray-600
          'rgba(107, 114, 128, 0.8)', // gray-500  
          'rgba(156, 163, 175, 0.8)'  // gray-400
        ],
        borderColor: [
          'rgba(75, 85, 99, 1)',
          'rgba(107, 114, 128, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            size: 11
          }
        }
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
            {results.totalScore}점
          </div>
          <p className="text-gray-500">총 60점 중</p>
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
              
              {personalizedComment && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <p className="text-gray-800 text-sm font-medium leading-relaxed">
                    💡 {personalizedComment}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-black mb-4 text-center">영역별 세부 점수</h3>
            <div className="h-48">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-center">
              <div>
                <div className="w-4 h-4 bg-gray-600 rounded mx-auto mb-1"></div>
                <div className="font-medium text-gray-700">정서적 탈진</div>
                <div className="text-gray-500">{results.categoryScores.exhaustion}점</div>
              </div>
              <div>
                <div className="w-4 h-4 bg-gray-500 rounded mx-auto mb-1"></div>
                <div className="font-medium text-gray-700">냉소적 태도</div>
                <div className="text-gray-500">{results.categoryScores.cynicism}점</div>
              </div>
              <div>
                <div className="w-4 h-4 bg-gray-400 rounded mx-auto mb-1"></div>
                <div className="font-medium text-gray-700">성취감 감소</div>
                <div className="text-gray-500">{results.categoryScores.accomplishment}점</div>
              </div>
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
          
          {/* Meme Image Display */}
          {memeImageUrl && (
            <Card className="border-0 shadow-lg rounded-3xl mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-black mb-4 text-center">내게 필요한건?</h3>
                <div className="flex justify-center">
                  <img 
                    src={memeImageUrl} 
                    alt="번아웃 결과 밈" 
                    className="max-w-full h-auto rounded-xl shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Dialog open={showScreenshotModal} onOpenChange={setShowScreenshotModal}>
              <DialogTrigger asChild>
                <Button
                  onClick={openScreenshotModal}
                  disabled={!memeImageUrl}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 rounded-2xl transition-all duration-300 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  내게 필요한건 저장하기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>이미지 저장 방법</DialogTitle>
                  <DialogDescription>
                    아래 방법으로 이미지를 저장할 수 있습니다
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">📱 모바일 (아이폰/안드로이드)</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. 이미지를 길게 눌러주세요</li>
                      <li>2. "이미지 저장" 또는 "사진에 저장" 선택</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">💻 컴퓨터 (PC/Mac)</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. 이미지에 마우스 우클릭</li>
                      <li>2. "이미지를 다른 이름으로 저장" 선택</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">📷 스크린샷</h4>
                    <p className="text-sm text-gray-600">
                      화면 전체를 스크린샷으로 찍어서 저장하셔도 됩니다
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => shareToSocial('twitter')}
              variant="outline"
              className="flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-2xl transition-all duration-300"
            >
              <Twitter className="w-4 h-4 mr-2" />
              X
            </Button>
            <Button
              onClick={() => shareToSocial('instagram')}
              variant="outline"
              className="flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-2xl transition-all duration-300"
            >
              <Instagram className="w-4 h-4 mr-2" />
              인스타
            </Button>
            <Button
              onClick={() => shareToSocial('kakao')}
              variant="outline"
              className="flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-2xl transition-all duration-300"
            >
              <span className="text-gray-600 mr-2">💬</span>
              카톡
            </Button>
          </div>

          <Button
            onClick={shareResults}
            variant="outline"
            className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-2xl transition-all duration-300"
          >
            <Share className="w-4 h-4 mr-2" />
            기본 공유하기
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
