import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { answerOptions } from "@/lib/burnoutQuestions";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen p-4 py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-lg mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-500">{questionNumber} / {totalQuestions}</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-2xl rounded-3xl animate-slide-up mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-medium text-black leading-relaxed">
                {question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {answerOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                    currentAnswer === option.value
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  onClick={() => onAnswer(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {currentAnswer === option.value && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            variant="outline"
            className="flex-1 bg-white border-gray-300 text-gray-700 font-medium py-4 rounded-2xl transition-all duration-200 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={onShowResults}
              disabled={!canGoNext}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 rounded-2xl transition-all duration-200 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              완료
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className="flex-1 bg-black hover:bg-gray-900 text-white font-medium py-4 rounded-2xl transition-all duration-200 disabled:opacity-50"
            >
              다음
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
