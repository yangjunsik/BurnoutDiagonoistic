import { BurnoutResult } from './burnoutScoring';

export function generateMemeImage(results: BurnoutResult, personalizedComment: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // 밈 이미지 크기 (Instagram Story 비율)
    canvas.width = 1080;
    canvas.height = 1920;

    // 배경 그라데이션
    const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    backgroundGradient.addColorStop(0, '#1a1a2e');
    backgroundGradient.addColorStop(0.5, '#16213e');
    backgroundGradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 제목 배경 (둥근 사각형)
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 60, 120, canvas.width - 120, 180, 30);
    ctx.fill();

    // 제목 텍스트
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('번아웃 체크 결과', canvas.width / 2, 230);

    // 메인 점수 원형 배경
    const scoreGradient = ctx.createRadialGradient(canvas.width / 2, 500, 0, canvas.width / 2, 500, 200);
    scoreGradient.addColorStop(0, '#8b5cf6');
    scoreGradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = scoreGradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 500, 180, 0, 2 * Math.PI);
    ctx.fill();

    // 메인 점수 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(results.totalScore.toString(), canvas.width / 2, 520);
    
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText('점', canvas.width / 2, 570);

    // 상태 텍스트 박스
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 80, 720, canvas.width - 160, 120, 20);
    ctx.fill();

    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(results.category, canvas.width / 2, 800);

    // 재미있는 이모지 추가
    const emoji = getMemeEmoji(results.category);
    ctx.font = '120px Arial, sans-serif';
    ctx.fillText(emoji, canvas.width / 2, 950);

    // 개인화 코멘트 박스
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    roundRect(ctx, 80, 1020, canvas.width - 160, 280, 20);
    ctx.fill();

    // 개인화 코멘트 텍스트 (여러 줄)
    ctx.fillStyle = '#1a1a2e';
    ctx.font = '38px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    const lines = wrapText(ctx, personalizedComment, canvas.width - 200);
    lines.forEach((line, index) => {
      ctx.fillText(line, 120, 1080 + (index * 50));
    });

    // 영역별 점수 (밈 스타일)
    const areas = [
      { name: '탈진', score: results.categoryScores.exhaustion, emoji: '😴', x: 180 },
      { name: '냉소', score: results.categoryScores.cynicism, emoji: '😒', x: 540 },
      { name: '성취감', score: results.categoryScores.accomplishment, emoji: '😔', x: 900 }
    ];

    areas.forEach(area => {
      // 작은 원형 배경
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(area.x, 1420, 80, 0, 2 * Math.PI);
      ctx.fill();

      // 이모지
      ctx.font = '60px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(area.emoji, area.x, 1435);

      // 점수
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText(area.score.toString(), area.x, 1540);

      // 영역명
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText(area.name, area.x, 1570);
    });

    // 하단 워터마크
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('번아웃 체크하기', canvas.width / 2, 1720);

    // 밈 스타일 장식 요소들
    addMemeDecorations(ctx, canvas.width, canvas.height, results.category);

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

function getMemeEmoji(category: string): string {
  switch (category) {
    case "건강한 상태":
      return "😎";
    case "가벼운 번아웃":
      return "🤔";
    case "심한 번아웃":
      return "😵‍💫";
    default:
      return "🤷‍♀️";
  }
}

function addMemeDecorations(ctx: CanvasRenderingContext2D, width: number, height: number, category: string) {
  // 반짝이는 별 효과
  ctx.fillStyle = '#ffd700';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 8 + 4;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 카테고리별 특별 장식
  if (category === "건강한 상태") {
    // 무지개 효과
    const rainbow = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'];
    rainbow.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(width / 2, 500, 200 + index * 10, 0, Math.PI);
      ctx.stroke();
    });
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

export function downloadMemeImage(imageUrl: string, filename: string = 'burnout-result-meme.png') {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}