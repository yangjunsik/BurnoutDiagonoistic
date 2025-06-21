import { useState } from "react";
import BurnoutLanding from "@/components/BurnoutLanding";
import BurnoutQuestion from "@/components/BurnoutQuestion";
import BurnoutResults from "@/components/BurnoutResults";
import { burnoutQuestionTexts } from "@/lib/burnoutQuestions";
import { calculateBurnoutScore, type BurnoutResult } from "@/lib/burnoutScoring";

type TestState = "landing" | "question" | "results";

export default function BurnoutTest() {
  const [testState, setTestState] = useState<TestState>("landing");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<BurnoutResult | null>(null);

  const startTest = () => {
    setTestState("question");
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  };

  const answerQuestion = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < burnoutQuestionTexts.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const showResults = () => {
    const result = calculateBurnoutScore(answers);
    setResults(result);
    setTestState("results");
  };

  const restartTest = () => {
    setTestState("landing");
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  };

  if (testState === "landing") {
    return <BurnoutLanding onStart={startTest} />;
  }

  if (testState === "question") {
    return (
      <BurnoutQuestion
        question={burnoutQuestionTexts[currentQuestion]}
        questionNumber={currentQuestion + 1}
        totalQuestions={burnoutQuestionTexts.length}
        currentAnswer={answers[currentQuestion]}
        onAnswer={answerQuestion}
        onNext={nextQuestion}
        onPrevious={previousQuestion}
        onShowResults={showResults}
        canGoNext={answers[currentQuestion] !== undefined}
        canGoPrevious={currentQuestion > 0}
        isLastQuestion={currentQuestion === burnoutQuestionTexts.length - 1}
      />
    );
  }

  if (testState === "results" && results) {
    return <BurnoutResults results={results} onRestart={restartTest} />;
  }

  return null;
}
