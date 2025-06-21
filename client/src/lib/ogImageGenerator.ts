export function generateOGImage(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // OG 이미지 표준 크기 (1200x630)
    canvas.width = 1200;
    canvas.height = 630;

    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1'); // 보라색
    gradient.addColorStop(1, '#ec4899'); // 핑크색
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 메인 제목
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('번아웃 자가진단 테스트', canvas.width / 2, 200);

    // 서브 제목
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('내 상태 확인하기', canvas.width / 2, 280);

    // 설명 텍스트
    ctx.font = '28px Arial, sans-serif';
    ctx.fillText('MBI 기반 과학적 진단 • 12문항 2분 완료', canvas.width / 2, 350);

    // 아이콘/이모지 (간단한 얼굴)
    ctx.font = '120px Arial, sans-serif';
    ctx.fillText('😰', canvas.width / 2 - 150, 480);
    ctx.fillText('😐', canvas.width / 2, 480);
    ctx.fillText('😊', canvas.width / 2 + 150, 480);

    // 하단 URL
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('burnout-check.site', canvas.width / 2, 570);

    // 이미지를 Base64로 변환
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } else {
        resolve('');
      }
    }, 'image/png');
  });
}

// 서버에서 사용할 정적 OG 이미지 생성
export async function generateStaticOGImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = 1200;
  canvas.height = 630;

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#ec4899');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 메인 제목
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('번아웃 자가진단 테스트', canvas.width / 2, 200);

  // 서브 제목
  ctx.font = '36px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('내 상태 확인하기', canvas.width / 2, 280);

  // 설명 텍스트
  ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('MBI 기반 과학적 진단 • 12문항 2분 완료', canvas.width / 2, 350);

  // 간단한 원형 아이콘들 (이모지 대신)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  
  // 슬픈 얼굴
  ctx.beginPath();
  ctx.arc(450, 450, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.arc(435, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(465, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(450, 470, 15, Math.PI, 2 * Math.PI);
  ctx.stroke();

  // 중간 얼굴
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(600, 450, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.arc(585, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(615, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(585, 465);
  ctx.lineTo(615, 465);
  ctx.stroke();

  // 행복한 얼굴
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(750, 450, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.arc(735, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(765, 435, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(750, 460, 15, 0, Math.PI);
  ctx.stroke();

  // 하단 URL
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('burnout-check.site', canvas.width / 2, 570);

  return canvas.toDataURL('image/png');
}

// 페이지 로드 시 OG 이미지 생성 및 설정 (클라이언트 사이드에서는 제한적)
export async function setupOGImage() {
  // 클라이언트 사이드에서는 메타 태그 동적 변경이 SNS 크롤러에 효과가 제한적이므로
  // 정적 이미지 파일을 사용하는 것이 좋습니다
  console.log('OG 이미지는 정적 파일로 설정되어 있습니다.');
}