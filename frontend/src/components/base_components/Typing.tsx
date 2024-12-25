import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Typing() {
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bubbleRef.current?.scrollIntoView();
  }, []);
  return (
    <div
      className="rounded-[20px] p-[10px] max-w-[10%] bg-secondary m-2"
      ref={bubbleRef}
    >
      {/* Typing dots */}
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-3 h-3 bg-gray-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        />
        <motion.div
          className="w-3 h-3 bg-gray-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-3 h-3 bg-gray-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </div>
  );
}
