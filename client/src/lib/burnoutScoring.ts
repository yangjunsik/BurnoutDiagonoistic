export interface BurnoutResult {
  totalScore: number;
  categoryScores: {
    exhaustion: number;
    cynicism: number;
    accomplishment: number;
  };
  category: string;
  color: string;
  message: string;
  recommendations: string[];
}

import { burnoutQuestions } from './burnoutQuestions';

export function calculateBurnoutScore(answers: number[]): BurnoutResult {
  // Calculate weighted scores by category
  let exhaustionScore = 0;
  let cynicismScore = 0;
  let accomplishmentScore = 0;
  
  answers.forEach((answer, index) => {
    const question = burnoutQuestions[index];
    const weightedAnswer = answer * question.weight;
    
    switch (question.category) {
      case 'exhaustion':
        exhaustionScore += weightedAnswer;
        break;
      case 'cynicism':
        cynicismScore += weightedAnswer;
        break;
      case 'accomplishment':
        accomplishmentScore += weightedAnswer;
        break;
    }
  });

  // Apply category weights: 탈진 40%, 냉소 35%, 성취감 25%
  const totalScore = Math.round(
    (exhaustionScore * 0.4) + (cynicismScore * 0.35) + (accomplishmentScore * 0.25)
  );

  const categoryScores = {
    exhaustion: Math.round(exhaustionScore),
    cynicism: Math.round(cynicismScore), 
    accomplishment: Math.round(accomplishmentScore)
  };

  // 12 questions × 6 points = max 72 points
  // Low burnout: 0-24 (0-33% of max), Medium: 25-48 (34-66%), High: 49-72 (67-100%)
  if (totalScore <= 24) {
    return {
      totalScore,
      categoryScores,
      category: "건강한 상태",
      color: "emerald",
      message: "좋아요! 일과 생활의 균형을 잘 유지하고 계시는 것 같아요. 스트레스 관리도 잘 되고 있고, 전반적으로 건강한 상태예요.",
      recommendations: [
        "현재 패턴 그대로 유지하기",
        "가끔 번아웃 체크해보기",
        "스트레스 쌓이기 전에 미리 해소하기",
        "일과 휴식의 경계 명확히 하기"
      ]
    };
  } else if (totalScore <= 48) {
    return {
      totalScore,
      categoryScores,
      category: "가벼운 번아웃",
      color: "amber",
      message: "살짝 피로가 쌓이고 있는 것 같아요. 일상에서 느끼는 스트레스가 조금씩 누적되고 있을 수 있어요. 지금부터 관리하면 충분히 회복 가능해요.",
      recommendations: [
        "업무 중 5-10분 휴식 자주 가지기",
        "퇴근 후 일 생각 안 하는 시간 만들기",
        "좋아하는 취미나 운동 시간 늘리기",
        "주변 사람들과 스트레스 나누기",
        "수면 패턴 규칙적으로 맞추기"
      ]
    };
  } else {
    return {
      totalScore,
      categoryScores,
      category: "심한 번아웃",
      color: "red",
      message: "번아웃 증상이 꽤 심한 편이에요. 일상생활과 업무에 상당한 영향을 미치고 있을 것 같아요. 혼자서 해결하려 하지 말고 적극적으로 도움을 받으시길 권해요.",
      recommendations: [
        "심리 상담이나 전문가 도움 받기",
        "당분간 업무 강도 조절하기",
        "연차나 휴가 활용해서 충분히 쉬기",
        "가족, 친구들에게 상황 털어놓기",
        "필요하다면 직장 환경 변화 고려하기"
      ]
    };
  }
}
