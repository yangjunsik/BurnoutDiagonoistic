import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BurnoutLandingProps {
  onStart: () => void;
}

export default function BurnoutLanding({ onStart }: BurnoutLandingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-3">번아웃 체크</h1>
          <p className="text-lg text-gray-600">요즘 어떠세요? 간단히 확인해봐요</p>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden mb-6">
          <CardContent className="p-8">
            <div className="space-y-4 text-center">
              <div className="text-2xl">🤔</div>
              <p className="text-gray-700 leading-relaxed">
                지난 2주 동안의 경험을 바탕으로<br/>
                솔직하게 답해주세요
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <span>📝 12문항</span>
                <span>⏱️ 2분</span>
                <span>📱 간편하게</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onStart} 
          className="w-full bg-black hover:bg-gray-900 text-white font-medium py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg shadow-xl"
        >
          시작하기
        </Button>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          가벼운 자가체크용이에요<br/>
          정확한 진단은 전문가와 상담하세요
        </p>
      </div>
    </div>
  );
}
