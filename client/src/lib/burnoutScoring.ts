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
      message: "축하합니다! 현재 번아웃 증상이 거의 없는 건강한 상태입니다. 일과 생활의 균형을 잘 유지하고 계시며, 업무에 대한 만족도와 에너지 수준이 양호합니다.",
      recommendations: [
        "현재의 건강한 루틴을 지속적으로 유지하세요",
        "정기적인 운동과 충분한 휴식을 계속하세요",
        "스트레스 예방을 위한 취미활동을 즐기세요",
        "동료나 가족과의 긍정적 관계를 유지하세요"
      ]
    };
  } else if (totalScore <= 35) {
    return {
      score: totalScore,
      category: "가벼운 번아웃",
      color: "amber",
      message: "약간의 번아웃 증상이 나타나고 있습니다. 피로감이나 업무에 대한 부담감을 느끼기 시작했으며, 적절한 관리가 필요한 단계입니다. 지금이 생활 패턴을 점검하고 개선할 좋은 시기입니다.",
      recommendations: [
        "업무량과 업무 시간을 조절해보세요",
        "규칙적인 휴식 시간을 확보하세요",
        "스트레스 관리 기법을 배우고 실천하세요",
        "신뢰할 수 있는 사람과 고민을 나누세요",
        "충분한 수면과 건강한 식단을 유지하세요"
      ]
    };
  } else {
    return {
      score: totalScore,
      category: "심한 번아웃",
      color: "red",
      message: "심각한 번아웃 증상이 나타나고 있습니다. 극심한 피로감, 업무에 대한 냉소적 태도, 성취감 저하 등을 경험하고 계실 수 있습니다. 전문가의 도움을 받아 체계적인 관리가 필요한 상태입니다.",
      recommendations: [
        "전문가 상담을 적극 권장합니다",
        "충분한 휴식과 회복 시간이 필요합니다",
        "업무 환경이나 역할에 대한 재검토를 고려하세요",
        "가족이나 친구들의 지원을 받으세요",
        "필요하다면 업무 조정이나 휴가를 고려하세요"
      ]
    };
  }
}
