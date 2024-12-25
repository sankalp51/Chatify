import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Typing() {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bubbleRef.current?.scrollIntoView();
  }, []);

  return (
    <div
      // Adjust the classes below to fit your design / theme
      className="m-2 rounded-[20px] py-[15px] px-[15px] bg-secondary w-[15%] md:w-[11%]"
      ref={bubbleRef}
    >
      {/* Typing dots */}
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </div>
  );
}
