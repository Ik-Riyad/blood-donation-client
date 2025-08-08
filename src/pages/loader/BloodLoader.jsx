import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BloodLoader = () => {
  const [percent, setPercent] = useState(0);

  // Animate loading percentage from 0 to 100 repeatedly
  useEffect(() => {
    let animationFrame;
    let start;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      const cycleDuration = 3000;
      const cycleProgress = progress % cycleDuration;

      const newPercent = Math.floor((cycleProgress / cycleDuration) * 100);
      setPercent(newPercent);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-4">
      <div className="relative w-40 h-64">

        {/* Smaller blood drop */}
        <motion.svg
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 130, opacity: 1 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          viewBox="0 0 60 100"
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[45px] h-[72px]"  // smaller drop
        >
          <path
            d="
              M30 0
              C40 25, 58 50, 58 70
              A28 28 0 1 1 2 70
              C2 50, 20 25, 30 0
              Z
            "
            fill="#dc2626"
          />
        </motion.svg>

        {/* Bigger blood puddle */}
        <motion.svg
          viewBox="0 0 120 30"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px]"  // bigger puddle
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.85, 0.5, 0.85],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <ellipse
            cx="60"
            cy="15"
            rx="58"
            ry="14"
            fill="#b91c1c"
            stroke="#7f1d1d"
            strokeWidth="2"
          />
          <ellipse
            cx="35"
            cy="12"
            rx="15"
            ry="5"
            fill="rgba(255,255,255,0.3)"
          />
        </motion.svg>
      </div>

      {/* Loading Percentage Text */}
      <div className="text-red-700 font-semibold text-lg select-none">
        Loading {percent}%
      </div>
    </div>
  );
};

export default BloodLoader;
