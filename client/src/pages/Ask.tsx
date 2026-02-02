import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";
import { useRequest } from "@/hooks/use-requests";
import { HeartLoader } from "@/components/HeartLoader";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

export default function Ask() {
  const [, params] = useRoute("/ask/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: request, isLoading } = useRequest(id);
  const { toast } = useToast();

  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [containerRect, setContainerRect] = useState<{ width: number, height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Position for the No button
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noButtonVisible, setNoButtonVisible] = useState(true);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerRect({ width, height });
    }
  }, [isLoading]);

  // Handle the "No" button teleportation logic
  const handleNoInteraction = () => {
    if (!containerRect) return;
    
    // Increment counter
    const newCount = Math.min(noCount + 1, 10);
    setNoCount(newCount);

    if (newCount >= 10) {
      setNoButtonVisible(false);
      return;
    }

    const noWidth = 100;
    const noHeight = 60;
    
    // Exact equal growth in 10 steps
    // Initial scale: 1
    // Final scale at 10 steps: we want it to cover the screen. 
    // Let's use 20 as the "full screen" scale.
    // Growth per step = (20 - 1) / 10 = 1.9
    const growthPerStep = 1.9;
    const nextYesScale = 1 + (newCount * growthPerStep);
    
    const yesSizeBase = 120; // Approximate base diameter of the button
    const yesCurrentRadius = (yesSizeBase * nextYesScale) / 2;

    let randomX = 0;
    let randomY = 0;
    let collision = true;
    let attempts = 0;

    // Safety margin to prevent overlap
    const margin = 30;

    while (collision && attempts < 100) {
      attempts++;
      // Get random coordinates within container
      randomX = Math.random() * (containerRect.width - noWidth) - (containerRect.width / 2 - noWidth / 2);
      randomY = Math.random() * (containerRect.height - noHeight) - (containerRect.height / 2 - noHeight / 2);

      // Distance from center (where Yes button is)
      const dist = Math.sqrt(Math.pow(randomX, 2) + Math.pow(randomY, 2));
      
      // If distance is greater than Yes button radius + margin, we're safe
      if (dist > (yesCurrentRadius + margin)) {
        collision = false;
      }
    }

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    setYesPressed(true);
    
    // Trigger confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Yes button grows with each No interaction
  // Every step increases scale equally until it fills screen at step 10
  // Growth per step = (20 - 1) / 10 = 1.9
  const yesScale = 1 + (noCount * 1.9);
  
  // If request not found
  if (!isLoading && !request) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 text-center">
        <div>
          <h1 className="text-4xl font-handwriting text-primary mb-4">Oh no! 💔</h1>
          <p className="text-muted-foreground">This question seems to have disappeared.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="min-h-screen bg-pink-50 flex items-center justify-center"><HeartLoader /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              y: [null, Math.random() * -100]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute text-primary/20"
          >
            <Heart size={Math.random() * 50 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!yesPressed ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-4xl text-center relative z-10"
          >
            {/* The Question */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-handwriting text-primary font-bold mb-12 drop-shadow-sm px-4 leading-tight">
              {request?.question}
            </h1>

            {/* Interactive Area */}
            <div 
              ref={containerRef}
              className="h-[500px] w-full relative flex items-center justify-center gap-12"
            >
              {/* NO Button (Starts Left) */}
              {noButtonVisible && (
                <motion.button
                  animate={{ 
                    x: noCount === 0 ? -100 : noPosition.x, 
                    y: noCount === 0 ? 0 : noPosition.y 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={handleNoInteraction}
                  onClick={handleNoInteraction}
                  className="absolute px-8 py-4 bg-slate-200 text-slate-500 font-bold rounded-full text-xl md:text-2xl hover:bg-slate-300 transition-colors z-20"
                >
                  No
                </motion.button>
              )}

              {/* YES Button (Starts Right) */}
              <motion.button
                layout
                onClick={handleYesClick}
                animate={{ 
                  x: noCount === 0 ? 100 : 0,
                  scale: noCount >= 10 ? 30 : yesScale,
                  // When huge, ensure it covers the screen properly
                  zIndex: noCount >= 10 ? 50 : 10,
                }}
                className={`
                  bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/30 
                  transition-colors hover:bg-primary/90 flex items-center justify-center gap-2
                  ${noCount >= 10 ? 'fixed inset-0 rounded-none w-full h-full text-4xl' : 'px-8 py-4 text-xl md:text-2xl'}
                `}
              >
                Yes <Heart fill="currentColor" className={noCount >= 10 ? 'w-12 h-12' : 'w-6 h-6'} />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center relative z-50 max-w-2xl px-8"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-40 h-40 md:w-56 md:h-56 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 border-4 border-pink-100"
            >
              <Heart className="w-24 h-24 md:w-32 md:h-32 text-primary" fill="currentColor" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-handwriting font-bold text-primary leading-tight bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50">
              {request?.message}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
