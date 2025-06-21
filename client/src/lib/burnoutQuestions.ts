// MBI 기반 3영역 × 4문항 = 12문항
export const burnoutQuestions = [
  // 정서적 탈진 (Emotional Exhaustion) - 4문항
  {
    text: "업무로 인해 정신적, 신체적으로 완전히 지쳐있다",
    category: "exhaustion",
    weight: 1.0
  },
  {
    text: "아침에 일어나서 또 하루 일해야 한다고 생각하면 피곤하다",
    category: "exhaustion", 
    weight: 1.0
  },
  {
    text: "퇴근 후에도 충분히 쉬어도 피로가 풀리지 않는다",
    category: "exhaustion",
    weight: 1.2
  },
  {
    text: "일과 관련된 스트레스로 인해 예민해지고 짜증이 늘었다",
    category: "exhaustion",
    weight: 0.9
  },

  // 냉소적 태도 (Depersonalization) - 4문항  
  {
    text: "동료나 고객을 그냥 하나의 업무 대상으로만 여기게 된다",
    category: "cynicism",
    weight: 1.1
  },
  {
    text: "업무에 대한 흥미와 열정이 현저히 줄어들었다",
    category: "cynicism",
    weight: 1.3
  },
  {
    text: "회사나 업무에 대해 냉소적이고 부정적으로 생각한다",
    category: "cynicism",
    weight: 1.2
  },
  {
    text: "이직이나 퇴사를 진지하게 고민하고 있다",
    category: "cynicism",
    weight: 1.4
  },

  // 개인 성취감 감소 (Reduced Personal Accomplishment) - 4문항
  {
    text: "내가 하는 일이 의미 있고 가치 있다고 느끼기 어렵다",
    category: "accomplishment",
    weight: 1.1
  },
  {
    text: "업무 성과나 능력에 대해 자신감이 떨어졌다",
    category: "accomplishment",
    weight: 1.0
  },
  {
    text: "예전에 비해 업무 실수가 늘고 집중력이 떨어진다",
    category: "accomplishment",
    weight: 1.2
  },
  {
    text: "회사에서 제대로 인정받지 못한다고 느낀다",
    category: "accomplishment",
    weight: 0.9
  }
];

// 간단한 접근을 위한 텍스트만 추출
export const burnoutQuestionTexts = burnoutQuestions.map(q => q.text);

export const answerOptions = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "매우 그렇다" }
];
