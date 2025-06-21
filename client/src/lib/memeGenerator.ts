import { BurnoutResult } from './burnoutScoring';

function getMemeCharacter(category: string): { emoji: string; message: string; comment: string } {
  switch (category) {
    case "건강한 상태":
      return {
        emoji: "🤓",
        message: "어 나 괜찮네?",
        comment: "멘탈 갑인 듯... 근데 진짜임? ㅋㅋ"
      };
    case "가벼운 번아웃":
      return {
        emoji: "🥴",
        message: "어... 좀 이상한데...",
        comment: "아 몰라 일단 치킨이나 시켜야지"
      };
    case "심한 번아웃":
      return {
        emoji: "🤪",
        message: "나 완전 고장남 ㅋㅋ",
        comment: "휴가? 사표? 아니면 그냥 도망?"
      };
    default:
      return {
        emoji: "🫥",
        message: "머리가 텅 비었어",
        comment: "아무것도 모르겠다... 그냥 자자"
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
    canvas.width = 800;
    canvas.height = 800;

    // 밝은 배경
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 메인 캐릭터와 상태 표시
    const character = getMemeCharacter(results.category);
    const characterSize = 200;
    
    // 캐릭터 그리기
    ctx.font = `${characterSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(character.emoji, canvas.width / 2, 250);

    // 말풍선 배경
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    roundRect(ctx, 80, 300, canvas.width - 160, 180, 20);
    ctx.fill();
    ctx.stroke();

    // 말풍선 꼬리
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, 300);
    ctx.lineTo(canvas.width / 2, 270);
    ctx.lineTo(canvas.width / 2 + 20, 300);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // 메인 메시지
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(character.message, canvas.width / 2, 360);

    // 점수 표시
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText(`${results.totalScore}점`, canvas.width / 2, 420);

    // 하단 코멘트
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial, sans-serif';
    const commentLines = wrapText(ctx, character.comment, canvas.width - 120);
    commentLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 550 + (index * 30));
    });

    // 해시태그 스타일 추가
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('#번아웃체크 #멘탈헬스 #자가진단', canvas.width / 2, 720);

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