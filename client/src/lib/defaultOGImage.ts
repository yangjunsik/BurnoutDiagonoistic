// Generate a default OG image for the site
export function generateDefaultOGImage(): Promise<string> {
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
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 메인 카드 배경
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    const cardRadius = 32;
    roundRect(ctx, 80, 80, canvas.width - 160, canvas.height - 160, cardRadius);
    ctx.fill();

    // 그림자 리셋
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 아이콘
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '120px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧠', canvas.width / 2, 280);

    // 제목
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('번아웃 자가진단 테스트', canvas.width / 2, 360);

    // 부제목
    ctx.fillStyle = '#64748b';
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillText('MBI 기반 과학적 진단 • 12문항 2분', canvas.width / 2, 410);

    // 웹사이트 URL
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('burnout-check.site', canvas.width / 2, 480);

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