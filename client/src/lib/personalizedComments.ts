import { BurnoutResult } from './burnoutScoring';

interface AnswerPattern {
  highStress: number; // 5-6점 답변 개수
  moderateStress: number; // 3-4점 답변 개수
  lowStress: number; // 1-2점 답변 개수
  mostProblematicArea: 'exhaustion' | 'cynicism' | 'accomplishment';
}

export function generatePersonalizedComment(
  answers: number[], 
  result: BurnoutResult
): string {
  const pattern = analyzeAnswerPattern(answers, result);
  
  // 가장 문제가 되는 영역별 맞춤 코멘트
  const areaComments = {
    exhaustion: [
      "에너지가 많이 고갈되어 있는 상태네요. 충분한 휴식이 우선이에요.",
      "신체적, 정신적 피로가 누적된 것 같아요. 작은 휴식부터 시작해보세요.",
      "탈진 증상이 두드러져요. 업무 강도를 조절하는 것이 중요해요."
    ],
    cynicism: [
      "일에 대한 회의감이 커져 있네요. 의미 있는 순간들을 찾아보세요.",
      "냉소적인 태도가 강해졌어요. 긍정적인 변화의 가능성을 열어두세요.",
      "직장과 일에 대한 거리감이 느껴져요. 소소한 성취감부터 회복해보세요."
    ],
    accomplishment: [
      "성취감 부족이 주된 문제에요. 작은 목표부터 달성해보세요.",
      "자신의 능력에 대한 의심이 커져 있어요. 지금까지의 성과를 돌아보세요.",
      "개인적 성취감을 느끼기 어려운 상황이네요. 일의 의미를 재발견해보세요."
    ]
  };

  // 스트레스 패턴별 추가 코멘트
  let stressComment = "";
  if (pattern.highStress >= 8) {
    stressComment = " 특히 높은 스트레스 상황이 많이 감지되어, 즉시 도움을 받으시길 권해요.";
  } else if (pattern.highStress >= 5) {
    stressComment = " 중간 정도의 스트레스가 지속되고 있어, 체계적인 관리가 필요해요.";
  } else if (pattern.moderateStress >= 6) {
    stressComment = " 미묘한 스트레스가 누적되고 있어, 예방적 관리가 중요해요.";
  }

  // 결과별 격려 메시지
  const encouragementMessages: Record<string, string[]> = {
    "건강한 상태": [
      "정말 잘 관리하고 계시네요! 🌟",
      "균형잡힌 생활을 유지하고 계시는군요! ✨",
      "현재 상태를 계속 유지하시면 좋을 것 같아요! 💪"
    ],
    "가벼운 번아웃": [
      "아직 회복 가능한 단계예요! 🌱",
      "지금부터 관리하면 충분히 좋아질 수 있어요! 🌿",
      "작은 변화가 큰 차이를 만들 거예요! 🌸"
    ],
    "심한 번아웃": [
      "힘든 시기를 보내고 계시는군요. 혼자가 아니에요! 🤗",
      "회복에는 시간이 걸리지만, 반드시 좋아질 거예요! 🌅",
      "지금 이 순간도 충분히 잘 버텨내고 계세요! 💜"
    ]
  };

  // 최종 코멘트 조합
  const areaComment = areaComments[pattern.mostProblematicArea][
    Math.floor(Math.random() * areaComments[pattern.mostProblematicArea].length)
  ];
  
  const encouragement = encouragementMessages[result.category][
    Math.floor(Math.random() * encouragementMessages[result.category].length)
  ];

  return `${areaComment}${stressComment} ${encouragement}`;
}

function analyzeAnswerPattern(answers: number[], result: BurnoutResult): AnswerPattern {
  const highStress = answers.filter(answer => answer >= 5).length;
  const moderateStress = answers.filter(answer => answer >= 3 && answer <= 4).length;
  const lowStress = answers.filter(answer => answer <= 2).length;

  // 가장 점수가 높은 영역 찾기
  const { exhaustion, cynicism, accomplishment } = result.categoryScores;
  let mostProblematicArea: 'exhaustion' | 'cynicism' | 'accomplishment';
  
  if (exhaustion >= cynicism && exhaustion >= accomplishment) {
    mostProblematicArea = 'exhaustion';
  } else if (cynicism >= accomplishment) {
    mostProblematicArea = 'cynicism';
  } else {
    mostProblematicArea = 'accomplishment';
  }

  return {
    highStress,
    moderateStress,
    lowStress,
    mostProblematicArea
  };
}