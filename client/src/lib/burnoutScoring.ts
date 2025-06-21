export interface BurnoutResult {
  score: number;
  category: string;
  color: string;
  message: string;
  recommendations: string[];
}

export function calculateBurnoutScore(answers: number[]): BurnoutResult {
  // Calculate total score
  // Questions 12-15 (indices 11-14) are reverse scored (positive indicators)
  const totalScore = answers.reduce((sum, answer, index) => {
    if (index >= 11 && index <= 14) {
      return sum + (6 - answer);
    }
    return sum + answer;
  }, 0);

  // Determine category and recommendations
  if (totalScore <= 20) {
    return {
      score: totalScore,
      category: "건강한 상태",
      color: "emerald",
      message: "좋아요! 현재 건강한 상태를 유지하고 계세요. 일과 생활의 균형이 잘 맞춰져 있고, 에너지 수준도 괜찮은 편이에요.",
      recommendations: [
        "지금처럼 좋은 루틴 유지하기",
        "꾸준한 운동과 충분한 휴식",
        "나만의 스트레스 해소법 찾기",
        "소중한 사람들과의 시간 갖기"
      ]
    };
  } else if (totalScore <= 35) {
    return {
      score: totalScore,
      category: "가벼운 번아웃",
      color: "amber",
      message: "조금 피곤하신 것 같아요. 최근에 스트레스를 받거나 무리한 일이 있으셨나요? 지금이 자신을 돌아보고 케어할 좋은 시기에요.",
      recommendations: [
        "일하는 시간 조금 줄여보기",
        "중간중간 짧은 휴식 챙기기",
        "스트레스 풀 수 있는 방법 찾기",
        "믿을 만한 사람과 이야기하기",
        "잠과 식사 잘 챙기기"
      ]
    };
  } else {
    return {
      score: totalScore,
      category: "심한 번아웃",
      color: "red",
      message: "많이 힘드시겠어요. 요즘 정말 지치고 의욕이 없으신 것 같네요. 혼자 견디지 마시고 주변에 도움을 요청하는 것도 좋은 방법이에요.",
      recommendations: [
        "전문가와 상담해보시길 권해요",
        "지금은 충분한 휴식이 필요해요",
        "일하는 환경 바꿔볼 수 있다면 좋겠어요",
        "가족이나 친구들에게 도움 요청하기",
        "잠시 일을 쉬는 것도 고려해보세요"
      ]
    };
  }
}
