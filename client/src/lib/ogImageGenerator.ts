import { type BurnoutResult } from './burnoutScoring';

export function generateOGImage(results: BurnoutResult): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    // Canvas 크기 설정 (1200x630 - OG 이미지 권장 크기)
    canvas.width = 1200;
    canvas.height = 630;

    // 배경 그라데이션
    const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    backgroundGradient.addColorStop(0, '#f8fafc');
    backgroundGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 메인 카드 배경
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    const cardRadius = 24;
    roundRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, cardRadius);
    ctx.fill();

    // 그림자 리셋
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 제목
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('번아웃 체크 결과', canvas.width / 2, 180);

    // 점수 원형 배경 - 그라데이션 효과 (보라-핑크)
    const scoreGradient = ctx.createLinearGradient(canvas.width / 2 - 80, 240, canvas.width / 2 + 80, 400);
    scoreGradient.addColorStop(0, '#8b5cf6'); // purple-500
    scoreGradient.addColorStop(1, '#ec4899'); // pink-500
    ctx.fillStyle = scoreGradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 320, 80, 0, 2 * Math.PI);
    ctx.fill();

    // 점수 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${results.totalScore}점`, canvas.width / 2, 340);

    // 카테고리
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px system-ui, -apple-system, sans-serif';
    const emoji = getCategoryEmoji(results.color);
    ctx.fillText(`${emoji} ${results.category}`, canvas.width / 2, 450);

    // 부제목
    ctx.fillStyle = '#64748b';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillText('총 60점 중', canvas.width / 2, 490);

    // 웹사이트 URL
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText('burnout-check.site', canvas.width / 2, 550);

    // Canvas를 blob으로 변환 후 URL 생성
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

function getScoreColor(color: string): string {
  // 모든 카테고리에서 보라색 포인트 컬러 사용
  return '#8b5cf6'; // purple-500
}

function getCategoryEmoji(color: string): string {
  switch (color) {
    case 'emerald':
      return '✨';
    case 'amber':
      return '💡';
    case 'red':
      return '🔄';
    default:
      return '✨';
  }
}