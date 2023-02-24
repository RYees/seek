import { useState, ReactNode, useEffect } from "react";
import styles from "@/styles/Sparkles.module.css";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useRandomInterval from "@/hooks/useRandomInterval";
import { random, range } from "@/helpers/functions";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_COLOR = "#e6cc00";
const generateSparkle = (color: string) => {
  const sparkle = {
    id: uuidv4(),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 100) + '%',
      left: random(0, 100) + '%',
    },
  };
  return sparkle;
};
const Sparkles = ({
  color = DEFAULT_COLOR,
  children,
}: {
  color?: string,
  children: ReactNode
}) => {
  const [sparkles, setSparkles] = useState([] as any[]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const sparkles = range(2).map(() => generateSparkle(color));
    setSparkles(sparkles);
  }, []);

  useRandomInterval(
    () => {
      const sparkle = generateSparkle(color);
      const now = Date.now();
      const nextSparkles = sparkles.filter(sp => {
        const delta = now - sp.createdAt;
        return delta < 750;
      });
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    prefersReducedMotion ? null : 500,
    prefersReducedMotion ? null : 1500
  );

  return (
    <span className={styles.sparklesWrapper} >
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <strong className={styles.childWrapper}>{children}</strong>
    </span>
  );
};
const Sparkle = ({ size, color, style }: { size: number, color: string, style: any }) => {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
  return (
    <span className={styles.sparkleWrapper} style={style}>
      <svg
        className={styles.sparkleSvg}
        width={size}
        height={size}
        viewBox="0 0 68 68"
        fill="none">
        <path d={path} fill={color} />
      </svg>
    </span>
  );
};

export default Sparkles;
