import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function HeartLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="w-16 h-16 text-primary fill-primary/30" />
      </motion.div>
      <p className="text-muted-foreground font-handwriting text-xl animate-pulse">Loading love...</p>
    </div>
  );
}
