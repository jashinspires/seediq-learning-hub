
import React, { useEffect, useState } from "react";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 1000);
    const timer2 = setTimeout(() => setAnimationStage(2), 2000);
    const timer3 = setTimeout(() => setAnimationStage(3), 3000);
    const timer4 = setTimeout(() => {
      setAnimationStage(4);
      setTimeout(onComplete, 1000);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <span 
            className={`text-5xl md:text-7xl font-bold transition-all duration-1000 ${
              animationStage >= 1 ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            Seed
            <span 
              className={`text-seediq-600 transition-all duration-1000 ${
                animationStage >= 2 ? "opacity-100" : "opacity-0"
              }`}
            >
              IQ
            </span>
          </span>

          {animationStage >= 3 && (
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center overflow-hidden">
              <p className="text-sm md:text-base text-gray-600 animate-fade-in">
                Learn. Grow. Succeed.
              </p>
            </div>
          )}
        </div>

        <div className={`mt-16 flex space-x-3 transition-all duration-500 ${
          animationStage >= 4 ? "opacity-100" : "opacity-0"
        }`}>
          {[1, 2, 3].map((dot) => (
            <div key={dot} className={`h-2 w-2 rounded-full bg-seediq-600 animate-pulse`} 
                style={{ animationDelay: `${dot * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
