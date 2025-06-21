import { BurnoutResult } from './burnoutScoring';

function getMemeItem(totalScore: number): { category: string; item: string; message: string; emoji: string } {
  let category: string;
  let items: Array<{ item: string; message: string; emoji: string }>;
  
  if (totalScore <= 24) {
    // 건강한 상태 - 여유로운 아이템들
    category = "healthy";
    items = [
      { item: "아메리카노", message: "여유로운 하루를 위해", emoji: "☕" },
      { item: "운동", message: "건강한 몸과 마음", emoji: "🏃‍♂️" },
      { item: "독서", message: "지식을 쌓는 시간", emoji: "📚" },
      { item: "친구들과 만남", message: "소중한 인연들", emoji: "👥" },
      { item: "취미생활", message: "나만의 특별한 시간", emoji: "🎨" }
    ];
  } else if (totalScore <= 48) {
    // 가벼운 번아웃 - 스트레스 해소 아이템들
    category = "mild";
    items = [
      { item: "치킨", message: "스트레스엔 역시 치킨", emoji: "🍗" },
      { item: "맥주", message: "하루의 끝은 맥주와 함께", emoji: "🍺" },
      { item: "넷플릭스", message: "현실도피의 완벽한 수단", emoji: "📺" },
      { item: "잠", message: "세상에서 가장 좋은 도피처", emoji: "😴" },
      { item: "쇼핑", message: "돈은 없지만 기분전환", emoji: "🛒" }
    ];
  } else {
    // 심한 번아웃 - 극단적인 해결책들
    category = "severe";
    items = [
      { item: "소주", message: "현실을 잊게 해주는 친구", emoji: "🍶" },
      { item: "담배", message: "스트레스 해소의 마지막 수단", emoji: "🚬" },
      { item: "돈", message: "모든 문제의 해결책", emoji: "💰" },
      { item: "휴가", message: "이 모든 걸 떠나고 싶어", emoji: "✈️" },
      { item: "사표", message: "더 이상은 못 참겠어", emoji: "📝" }
    ];
  }
  
  // 랜덤으로 하나 선택
  const randomItem = items[Math.floor(Math.random() * items.length)];
  
  return {
    category,
    ...randomItem
  };
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

function drawItemIcon(ctx: CanvasRenderingContext2D, x: number, y: number, emoji: string) {
  // 큰 이모지 아이콘 그리기
  ctx.font = '120px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
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

    // 필요한 아이템 표시
    const memeItem = getMemeItem(results.totalScore);
    
    // 아이템 아이콘 그리기
    drawItemIcon(ctx, canvas.width / 2, 180, memeItem.emoji);

    // 상단 제목
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('내게 필요한건?', canvas.width / 2, 80);

    // 투박한 말풍선 배경
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    
    // 불규칙한 말풍선
    ctx.beginPath();
    ctx.moveTo(80, 320);
    ctx.lineTo(520, 320);
    ctx.lineTo(530, 330);
    ctx.lineTo(520, 450);
    ctx.lineTo(80, 445);
    ctx.lineTo(75, 325);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 말풍선 꼬리 (투박하게)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 15, 320);
    ctx.lineTo(canvas.width / 2, 270);
    ctx.lineTo(canvas.width / 2 + 20, 320);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // 메인 메시지 (아이템명)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(memeItem.item, canvas.width / 2, 370);

    // 점수 표시
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${results.totalScore}점`, canvas.width / 2, 400);

    // 하단 코멘트 (아이템 설명)
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px monospace';
    const commentLines = wrapText(ctx, memeItem.message, canvas.width - 100);
    commentLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 490 + (index * 25));
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