import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BurnoutLandingProps {
  onStart: () => void;
}

export default function BurnoutLanding({ onStart }: BurnoutLandingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">번아웃 자가진단 테스트</h1>
            <p className="text-lg text-gray-600 mb-6">간단한 질문을 통해 현재 나의 번아웃 상태를 확인해보세요</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">📋 테스트 안내</h3>
            <p className="text-blue-800 mb-3">
              <strong>지난 2주 동안의 나의 경험을 바탕으로 솔직하게 응답해주세요.</strong>
            </p>
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>• 총 15개의 질문으로 구성되어 있습니다</li>
              <li>• 각 질문은 5점 척도로 응답합니다</li>
              <li>• 테스트 완료까지 약 3-5분이 소요됩니다</li>
              <li>• 모든 데이터는 개인정보로 보호됩니다</li>
            </ul>
          </div>

          <Button 
            onClick={onStart} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg h-auto"
          >
            테스트 시작하기
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            ⚠️ 이 테스트는 의학적 진단을 대체할 수 없습니다. 심각한 증상이 지속될 경우 전문가와 상담하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
