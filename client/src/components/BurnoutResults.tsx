import { Sparkles, Heart, AlertTriangle, Share, Download, Instagram, Twitter, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type BurnoutResult } from "@/lib/burnoutScoring";
import { generateOGImage } from "@/lib/ogImageGenerator";
import { generatePersonalizedComment } from "@/lib/personalizedComments";
import { generateMemeImage, downloadMemeImage } from "@/lib/memeGenerator";
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

  const downloadMeme = () => {
    if (memeImageUrl) {
      downloadMemeImage(memeImageUrl, `번아웃체크-${results.category}-${Date.now()}.png`);
    }
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

  const shareWithImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateOGImage(results);
      
      if (imageUrl) {
        // 이미지를 파일로 변환
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `burnout-result-${results.totalScore}.png`, { type: 'image/png' });
        
        const resultText = `번아웃 체크 결과: ${results.totalScore}점 (${results.category})\n\n✨ 나도 체크해보기: ${window.location.origin}`;
        
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          // 이미지와 함께 공유
          await navigator.share({
            title: '번아웃 체크 결과',
            text: resultText,
            files: [file]
          });
        } else {
          // 이미지 다운로드
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `burnout-result-${results.totalScore}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 텍스트는 클립보드에 복사
          await navigator.clipboard.writeText(resultText);
          alert('이미지가 다운로드되고 텍스트가 클립보드에 복사되었어요!');
        }
        
        // URL 정리
        URL.revokeObjectURL(imageUrl);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('이미지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsGeneratingImage(false);
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
            <Button
              onClick={downloadMeme}
              disabled={!memeImageUrl}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 rounded-2xl transition-all duration-300 disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              내게 필요한건 다운로드
            </Button>

            <Button
              onClick={shareWithImage}
              disabled={isGeneratingImage}
              variant="outline"
              className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-2xl transition-all duration-300 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  OG 이미지 생성 중...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  일반 결과 카드 생성하기
                </>
              )}
            </Button>
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
