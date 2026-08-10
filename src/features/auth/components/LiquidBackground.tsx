import { useTransform } from "framer-motion";
import { motion, useSpring, useVelocity } from "framer-motion";
interface BlobProps {
  mouseX: any;
  mouseY: any;
  isHovered: boolean;
  size: number;
  color: string;
  lag: { stiffness: number; damping: number };
  offsetX: number;
  offsetY: number;
  floatPath: { x: number[]; y: number[] };
  duration: number;
}

function LiquidBlob({
  mouseX,
  mouseY,
  isHovered,
  size,
  color,
  lag,
  offsetX,
  offsetY,
  floatPath,
  duration,
}: BlobProps) {
  const springX = useSpring(mouseX, lag);
  const springY = useSpring(mouseY, lag);

  const velocityX = useVelocity(springX);
  const velocityY = useVelocity(springY);

  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [1.35, 1, 1.35]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [0.75, 1, 0.75]);

  const centeredX = useTransform(springX, (v) => v - size / 2 + offsetX);
  const centeredY = useTransform(springY, (v) => v - size / 2 + offsetY);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      initial={false}
      animate={isHovered ? { scale: [1, 1.08, 0.96, 1] } : { scale: [0.98, 1.02, 0.99, 1] }}
      transition={
        isHovered
          ? { type: "spring", stiffness: lag.stiffness, damping: lag.damping }
          : { duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
      }
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: 0,
        top: 0,
        x: centeredX,
        y: centeredY,
        scaleX: isHovered ? scaleX : 1,
        scaleY: isHovered ? scaleY : 1,
        opacity: isHovered ? 1 : 0.95,
      }}
    />
  );
}

export function LiquidBackground({
  mouseX,
  mouseY,
  isHovered,
}: {
  mouseX: any;
  mouseY: any;
  isHovered: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-[#0a0a12] pointer-events-none">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 35 -12"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 mix-blend-screen" style={{ filter: "url(#goo-filter)" }}>
        <LiquidBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} size={420} color="rgba(42, 60, 255, 0.65)" lag={{ stiffness: 35, damping: 40 }} offsetX={-180} offsetY={-80} floatPath={{ x: [-120, 150, -80], y: [-90, 100, -50] }} duration={14} />
        <LiquidBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} size={340} color="rgba(0, 229, 179, 0.5)" lag={{ stiffness: 55, damping: 20}} offsetX={200} offsetY={120} floatPath={{ x: [140, -100, 120], y: [90, -120, 60] }} duration={11} />
        <LiquidBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} size={260} color="rgba(0, 0, 9, 0.5)" lag={{ stiffness: 85, damping: 14 }} offsetX={40} offsetY={-160} floatPath={{ x: [80, -140, 60], y: [-150, 80, -100] }} duration={9} />
      </div>

      <div className="absolute inset-0 backdrop-blur-2xl pointer-events-none" />
    </div>
  );
}