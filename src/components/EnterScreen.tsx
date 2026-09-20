import { motion, AnimatePresence } from 'motion/react';

interface EnterScreenProps {
  onEnter: () => void;
  isEntered: boolean;
}

export function EnterScreen({ onEnter, isEntered }: EnterScreenProps) {
  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          id="enter-screen"
          onClick={onEnter}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(10px)',
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/90 backdrop-blur-xl select-none"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4"
          >
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.28em] text-white/80 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              [ CLICK ANYWHERE TO ENTER ]
            </p>
            <p className="mt-3 text-[11px] font-mono text-white/40 tracking-wider">
              Tap anywhere to open profile & start soundtrack
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
