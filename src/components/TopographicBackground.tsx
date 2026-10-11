import React, { useEffect, useRef } from 'react';

export const TopographicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Contour lines parameters
    const lineCount = 14;
    let time = 0;

    // Glowing pulse packets traveling along the topographic curves
    const pulses = Array.from({ length: 6 }, (_, i) => ({
      lineIndex: (i * 2 + 1) % lineCount,
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
      length: 0.15 + Math.random() * 0.1,
    }));

    const render = () => {
      time += 0.004;

      ctx.clearRect(0, 0, width, height);

      // Deep obsidian base
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, width, height);

      const verticalSpacing = height / (lineCount - 1);

      // Render topographic contour lines
      for (let i = 0; i < lineCount; i++) {
        const baseY = i * verticalSpacing;
        const lineTime = time + i * 0.25;

        ctx.beginPath();

        // Calculate points across the screen
        const points: { x: number; y: number }[] = [];
        const segments = 40;
        const stepX = width / segments;

        for (let j = 0; j <= segments; j++) {
          const x = j * stepX;
          // Organic sinusoidal distortion mimicking topographic elevations
          const elevation =
            Math.sin(j * 0.35 + lineTime) * 35 +
            Math.sin(j * 0.15 - lineTime * 0.8 + i) * 25 +
            Math.cos(j * 0.2 + lineTime * 0.5) * 15;

          const y = baseY + elevation;
          points.push({ x, y });
        }

        // Draw smooth bezier curve through points
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length - 1; j++) {
          const xc = (points[j].x + points[j + 1].x) / 2;
          const yc = (points[j].y + points[j + 1].y) / 2;
          ctx.quadraticCurveTo(points[j].x, points[j].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Base contour line style (thin, subtle titanium/slate)
        ctx.strokeStyle = i % 3 === 0 ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = i % 3 === 0 ? 1.2 : 0.8;
        ctx.stroke();

        // Render traveling light pulses on selected lines
        pulses.forEach((pulse) => {
          if (pulse.lineIndex === i) {
            pulse.progress += pulse.speed;
            if (pulse.progress > 1.2) {
              pulse.progress = -0.2;
              pulse.lineIndex = Math.floor(Math.random() * lineCount);
            }

            const startIndex = Math.max(0, Math.floor((pulse.progress - pulse.length) * segments));
            const endIndex = Math.min(segments, Math.floor(pulse.progress * segments));

            if (startIndex < endIndex && startIndex >= 0 && endIndex < points.length) {
              ctx.beginPath();
              ctx.moveTo(points[startIndex].x, points[startIndex].y);
              for (let k = startIndex + 1; k <= endIndex; k++) {
                ctx.lineTo(points[k].x, points[k].y);
              }

              // Glowing pulse gradient (emerald-tinted white pulse)
              const pulseGradient = ctx.createLinearGradient(
                points[startIndex].x,
                points[startIndex].y,
                points[endIndex].x,
                points[endIndex].y
              );
              pulseGradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
              pulseGradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.35)');
              pulseGradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

              ctx.strokeStyle = pulseGradient;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        });
      }

      // Soft radial focus mask (keeps center text ultra-readable, fades edges)
      const radialMask = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.15,
        width / 2,
        height / 2,
        width * 0.75
      );
      radialMask.addColorStop(0, 'rgba(6, 8, 13, 0.75)');
      radialMask.addColorStop(0.5, 'rgba(6, 8, 13, 0.35)');
      radialMask.addColorStop(1, 'rgba(6, 8, 13, 0.85)');

      ctx.fillStyle = radialMask;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] w-full h-full"
      aria-hidden="true"
    />
  );
};
