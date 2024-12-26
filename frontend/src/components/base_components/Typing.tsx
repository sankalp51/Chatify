import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Typing() {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bubbleRef.current?.scrollIntoView();
  }, []);

  return (
    <div
      ref={bubbleRef}
      className="
        m-2 
        inline-block 
        rounded-[20px] 
        py-[15px] 
        px-[15px] 
        bg-secondary 
        max-w-[80%]     
        sm:max-w-[60%]  
        md:max-w-[40%]  
        lg:max-w-[30%]  
      "
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
