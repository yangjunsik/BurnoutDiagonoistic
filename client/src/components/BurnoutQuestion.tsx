import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { answerOptions } from "@/lib/burnoutQuestions";

interface BurnoutQuestionProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: number;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onShowResults: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export default function BurnoutQuestion({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswer,
  onNext,
  onPrevious,
  onShowResults,
  canGoNext,
  canGoPrevious,
  isLastQuestion
}: BurnoutQuestionProps) {
  const progressPercent = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-blue-600">
              {questionNumber} / {totalQuestions}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-xl animate-slide-up">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <span className="inline-block bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mb-4">
                질문 {questionNumber}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {answerOptions.map((option) => (
                <div
                  key={option.value}
                  className={`bg-gray-50 hover:bg-blue-50 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    currentAnswer === option.value
                      ? "bg-blue-100 border-blue-300"
                      : "border-transparent hover:border-blue-200"
                  }`}
                  onClick={() => onAnswer(option.value)}
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                이전
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={onShowResults}
                  disabled={!canGoNext}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  결과 보기
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  다음
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
