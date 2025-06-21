import { BurnoutResult } from './burnoutScoring';

function getMemeCharacter(totalScore: number): { mood: string; message: string; comment: string } {
  if (totalScore <= 20) {
    return {
      mood: "happy",
      message: "ㅋㅋ 나 개꿀잼",
      comment: "멘탈갑 인정? 진짜 럭키비키자나"
    };
  } else if (totalScore <= 30) {
    return {
      mood: "cheerful", 
      message: "아직 괜찮긴 한데",
      comment: "이정도면 ㄱㅊ? 아직 살만해"
    };
  } else if (totalScore <= 40) {
    return {
      mood: "neutral",
      message: "음... 그냥저냥?",
      comment: "뭔가 애매모호한 느낌이긴 함"
    };
  } else if (totalScore <= 50) {
    return {
      mood: "tired",
      message: "어 뭔가 이상한데",
      comment: "와 진짜 피곤해... 치킨 먹고 자야지"
    };
  } else if (totalScore <= 60) {
    return {
      mood: "stressed",
      message: "야 나 힘들어ㅠㅠ",
      comment: "퇴근하고 싶다... 집가고 싶어"
    };
  } else {
    return {
      mood: "broken",
      message: "나 진짜 망했다",
      comment: "도망가고 싶어... 이 모든걸 던지고"
    };
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawSimpleFace(ctx: CanvasRenderingContext2D, x: number, y: number, mood: string) {
  // 짱구 스타일 얼굴 (살색 + 검은 테두리)
  ctx.fillStyle = '#fdbcb4'; // 짱구 살색
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  
  // 둥근 얼굴 (짱구처럼)
  ctx.beginPath();
  ctx.arc(x, y, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // 눈 그리기 (짱구 스타일)
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  
  if (mood === "happy") {
    // 웃는 눈 (^_^) - 짱구처럼 간단하게
    ctx.beginPath();
    ctx.arc(x - 18, y - 15, 8, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 18, y - 15, 8, 0.3, Math.PI - 0.3);
    ctx.stroke();
  } else if (mood === "cheerful") {
    // 둥근 눈 (●●) - 짱구 기본 눈
    ctx.beginPath();
    ctx.arc(x - 18, y - 15, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 18, y - 15, 4, 0, 2 * Math.PI);
    ctx.fill();
  } else if (mood === "broken" || mood === "stressed") {
    // X눈 - 짱구가 기절했을 때
    ctx.lineWidth = 3;
    // 왼쪽 X
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 22);
    ctx.lineTo(x - 11, y - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 22);
    ctx.lineTo(x - 25, y - 8);
    ctx.stroke();
    // 오른쪽 X
    ctx.beginPath();
    ctx.moveTo(x + 11, y - 22);
    ctx.lineTo(x + 25, y - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 25, y - 22);
    ctx.lineTo(x + 11, y - 8);
    ctx.stroke();
  } else if (mood === "tired") {
    // 반쯤 감은 눈 (-_-)
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 15);
    ctx.lineTo(x - 11, y - 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 11, y - 15);
    ctx.lineTo(x + 25, y - 15);
    ctx.stroke();
  } else {
    // 일반 눈 (●●) - 기본 짱구 눈
    ctx.beginPath();
    ctx.arc(x - 18, y - 15, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 18, y - 15, 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 입 그리기 (짱구 스타일)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  
  if (mood === "happy") {
    // 큰 웃음 (D 모양)
    ctx.beginPath();
    ctx.arc(x, y + 15, 20, 0, Math.PI);
    ctx.stroke();
  } else if (mood === "cheerful") {
    // 작은 웃음
    ctx.beginPath();
    ctx.arc(x, y + 15, 12, 0.4, Math.PI - 0.4);
    ctx.stroke();
  } else if (mood === "broken" || mood === "stressed") {
    // 슬픈 입 (역 D 모양)
    ctx.beginPath();
    ctx.arc(x, y + 35, 15, Math.PI, 2 * Math.PI);
    ctx.stroke();
  } else if (mood === "tired") {
    // 물결 입 (~)
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 20);
    ctx.quadraticCurveTo(x - 5, y + 25, x + 5, y + 20);
    ctx.quadraticCurveTo(x + 15, y + 15, x + 15, y + 20);
    ctx.stroke();
  } else {
    // 일자 입
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 20);
    ctx.lineTo(x + 12, y + 20);
    ctx.stroke();
  }

  // 홍조 (상태에 따라)
  if (mood === "stressed" || mood === "tired") {
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.arc(x - 45, y + 5, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 45, y + 5, 6, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // 눈물 (broken 상태일 때)
  if (mood === "broken") {
    ctx.fillStyle = '#87ceeb';
    ctx.beginPath();
    ctx.arc(x - 15, y + 5, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15, y + 5, 2, 0, 2 * Math.PI);
    ctx.fill();
    // 눈물 방울
    ctx.beginPath();
    ctx.arc(x - 15, y + 15, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15, y + 15, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function generateMemeImage(results: BurnoutResult, personalizedComment: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // 밈 이미지 크기 (정사각형 SNS 최적화)
    canvas.width = 600;
    canvas.height = 600;

    // 검은 배경
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 메인 캐릭터와 상태 표시
    const character = getMemeCharacter(results.totalScore);
    
    // 투박한 얼굴만 그리기 (순수 개웃긴 스타일)
    drawSimpleFace(ctx, canvas.width / 2, 200, character.mood);

    // 투박한 말풍선 배경
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    
    // 불규칙한 말풍선
    ctx.beginPath();
    ctx.moveTo(100, 380);
    ctx.lineTo(500, 380);
    ctx.lineTo(510, 390);
    ctx.lineTo(500, 480);
    ctx.lineTo(100, 475);
    ctx.lineTo(95, 385);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 말풍선 꼬리 (투박하게)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 15, 380);
    ctx.lineTo(canvas.width / 2, 340);
    ctx.lineTo(canvas.width / 2 + 20, 380);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // 메인 메시지 (투박한 폰트)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(character.message, canvas.width / 2, 420);

    // 점수 표시
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${results.totalScore}점`, canvas.width / 2, 450);

    // 하단 코멘트 (투박하게)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    const commentLines = wrapText(ctx, character.comment, canvas.width - 120);
    commentLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 520 + (index * 22));
    });

    // 투박한 장식 점들
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 이미지를 Base64로 변환
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        resolve(url);
      } else {
        resolve('');
      }
    }, 'image/png');
  });
}

export function downloadMemeImage(imageUrl: string, filename: string = 'burnout-meme.png') {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}