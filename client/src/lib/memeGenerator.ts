import { BurnoutResult } from './burnoutScoring';

function getMemeCharacter(totalScore: number): { face: string; message: string; comment: string } {
  if (totalScore <= 20) {
    return {
      face: "😇",
      message: "나 천사임?",
      comment: "완벽한 인간... 근데 진짜임?"
    };
  } else if (totalScore <= 30) {
    return {
      face: "😊",
      message: "아직 괜찮지",
      comment: "이 정도면 여유롭지 않나?"
    };
  } else if (totalScore <= 40) {
    return {
      face: "😐",
      message: "음... 그냥 그래",
      comment: "뭔가 애매한 느낌이긴 해"
    };
  } else if (totalScore <= 50) {
    return {
      face: "😅",
      message: "좀 이상한데?",
      comment: "아 치킨 시켜야겠다"
    };
  } else if (totalScore <= 60) {
    return {
      face: "🥴",
      message: "어어... 뭔가 힘들어",
      comment: "퇴근하고 싶다..."
    };
  } else {
    return {
      face: "😵‍💫",
      message: "나 완전 고장남",
      comment: "도망가고 싶어요..."
    };
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
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
    
    // 투박한 얼굴 그리기
    drawRoughFace(ctx, canvas.width / 2, 200, character.face);

    // 투박한 말풍선 배경
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    
    // 불규칙한 말풍선
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(500, 320);
    ctx.lineTo(510, 330);
    ctx.lineTo(500, 420);
    ctx.lineTo(100, 415);
    ctx.lineTo(95, 325);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 말풍선 꼬리 (투박하게)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 15, 320);
    ctx.lineTo(canvas.width / 2, 280);
    ctx.lineTo(canvas.width / 2 + 20, 320);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // 메인 메시지 (투박한 폰트)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(character.message, canvas.width / 2, 360);

    // 점수 표시
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${results.totalScore}점`, canvas.width / 2, 390);

    // 하단 코멘트 (투박하게)
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px monospace';
    const commentLines = wrapText(ctx, character.comment, canvas.width - 120);
    commentLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 480 + (index * 25));
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

function drawRoughFace(ctx: CanvasRenderingContext2D, x: number, y: number, emotion: string) {
  // 투박한 얼굴 타원
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  
  // 불규칙한 타원
  ctx.beginPath();
  ctx.ellipse(x, y, 80, 60, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // 눈 (투박하게)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x - 25, y - 15, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + 25, y - 15, 6, 0, 2 * Math.PI);
  ctx.fill();

  // 감정에 따른 입
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  
  if (emotion === "😇" || emotion === "😊") {
    // 웃는 입
    ctx.beginPath();
    ctx.arc(x, y + 15, 20, 0, Math.PI);
    ctx.stroke();
  } else if (emotion === "😐") {
    // 일자 입
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 20);
    ctx.lineTo(x + 15, y + 20);
    ctx.stroke();
  } else if (emotion === "😅") {
    // 약간 곤란한 입
    ctx.beginPath();
    ctx.arc(x - 5, y + 15, 15, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (emotion === "🥴") {
    // 비틀린 입
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 20);
    ctx.quadraticCurveTo(x, y + 30, x + 15, y + 15);
    ctx.stroke();
  } else {
    // 슬픈 입
    ctx.beginPath();
    ctx.arc(x, y + 30, 20, Math.PI, 2 * Math.PI);
    ctx.stroke();
  }

  // 투박한 홍조 (감정에 따라)
  if (emotion === "😅" || emotion === "🥴" || emotion === "😵‍💫") {
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.arc(x - 45, y + 5, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 45, y + 5, 8, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function downloadMemeImage(imageUrl: string, filename: string = 'burnout-meme.png') {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}