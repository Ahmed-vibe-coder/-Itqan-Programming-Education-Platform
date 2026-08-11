export interface DrawCertificateOptions {
  studentName: string;
  courseTitle?: string;
  completedAt?: string;
  verificationCode?: string;
  academyName?: string;
  instructorName?: string;
  instructorTitle?: string;
}

/**
 * Renders the 1-to-1 Classic Luxury HTML Certificate design onto an HTML5 Canvas element.
 * Resolution: 1200px x 800px.
 */
export function drawHtmlCertificateOnCanvas(
  canvas: HTMLCanvasElement,
  options: DrawCertificateOptions
): void {
  const {
    studentName,
    courseTitle = 'HTML & Web Development Course',
    completedAt,
    verificationCode,
    academyName = 'HTML Master Academy (Itqan Platform)',
    instructorName = 'Ahmed Saeed',
    instructorTitle = 'Ai & Full Stack Developer',
  } = options;

  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Pure White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 800);

  // 2. Top-Left Corner Wedge (Dark Blue + Gold Stripes)
  ctx.save();
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(400, 0);
  ctx.lineTo(0, 350);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(320, 0);
  ctx.lineTo(0, 280);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(340, 0);
  ctx.lineTo(0, 300);
  ctx.stroke();
  ctx.restore();

  // 3. Bottom-Right Corner Wedge (Dark Blue + Gold Stripes)
  ctx.save();
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(1200, 800);
  ctx.lineTo(800, 800);
  ctx.lineTo(1200, 450);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(880, 800);
  ctx.lineTo(1200, 520);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(860, 800);
  ctx.lineTo(1200, 500);
  ctx.stroke();
  ctx.restore();

  // 4. Double Royal Gold Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(80, 80, 1040, 640);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.strokeRect(92, 92, 1016, 616);

  // 5. Header Title & Gold Divider
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 56px Arial, sans-serif';
  ctx.fillText('CERTIFICATE', 600, 190);

  ctx.fillStyle = '#d4af37';
  ctx.fillRect(420, 210, 360, 3);

  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('OF ACHIEVEMENT', 600, 245);

  // 6. Presentation Line
  ctx.fillStyle = '#4b5563';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillText('This certificate is proudly presented to', 600, 310);

  // 7. Student Name
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#2c3e50';
  ctx.font = "italic 76px 'Times New Roman', Baskerville, Georgia, serif";
  ctx.fillText(studentName || 'اسم الطالب', 600, 390);
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 410);
  ctx.lineTo(900, 410);
  ctx.stroke();

  // 8. Completion Text & HTML Course Name
  ctx.fillStyle = '#6b7280';
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('For successfully completing the comprehensive', 600, 465);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText(courseTitle, 600, 525);

  // 9. Completion Date
  const dateObj = completedAt ? new Date(completedAt) : new Date();
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillStyle = '#374151';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(dateFormatted, 600, 585);

  // 10. Official Embossed Gold Seal Badge (Bottom Right)
  ctx.save();
  ctx.translate(950, 640);
  const sealGradient = ctx.createRadialGradient(0, 0, 30, 0, 0, 60);
  sealGradient.addColorStop(0, '#fbbf24');
  sealGradient.addColorStop(0.5, '#d4af37');
  sealGradient.addColorStop(1, '#b8941e');
  ctx.fillStyle = sealGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fill();

  // Seal teeth
  ctx.fillStyle = '#d4af37';
  for (let i = 0; i < 24; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 24);
    ctx.beginPath();
    ctx.moveTo(56, 0);
    ctx.lineTo(66, -4);
    ctx.lineTo(66, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Inner Dark Blue Circle
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fill();

  // Embossed White Seal Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL', 0, -8);
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText('HTML', 0, 14);
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText('★ ★ ★', 0, 30);
  ctx.restore();

  // 11. Instructor Signature Box (Bottom Left - Ahmed Saeed)
  ctx.save();
  ctx.translate(250, 640);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
  ctx.fillRect(-110, -40, 220, 80);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(-110, -40, 220, 80);

  ctx.fillStyle = '#1f2937';
  ctx.font = 'italic 32px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(instructorName, 0, -8);

  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText(instructorTitle, 0, 25);
  ctx.restore();

  // 12. Verification Code & Academy Name
  const cleanInitials = (studentName || 'STU')
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X') || 'STU';
  const certId = verificationCode || `HTML-${cleanInitials}-${Date.now().toString().slice(-6)}`;

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText(`Certificate ID: ${certId}`, 600, 710);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillText(academyName, 600, 750);
}

/**
 * Generates and downloads high-resolution PNG file of the certificate.
 */
export function downloadCertificatePng(options: DrawCertificateOptions): void {
  const canvas = document.createElement('canvas');
  drawHtmlCertificateOnCanvas(canvas, options);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeFileName = (options.studentName || 'student').replace(/\s+/g, '_');
    link.download = `HTML_Certificate_${safeFileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
