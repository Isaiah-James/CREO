'use client';
import { AnimatePresence, motion, Variants } from 'motion/react';
import React from 'react';
import useOverlay from '../hooks/useOverlay';

const VARIANTS: Variants = {
  hidden: {
    filter: 'blur(2rem)',
    opacity: 0,
  },
  visible: {
    filter: 'blur(0)',
    opacity: 1
  },
  exit: {
    filter: 'blur(2rem)',
    opacity: 0,
  },
};

export default function OverlayContainer() {
  const overlay = useOverlay();

  return (
    <AnimatePresence>
      {overlay.isOpen && (
        <motion.div
          variants={VARIANTS}
          initial="hidden"
          animate="visible"
          exit={'exit'}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className='absolute w-full h-full bg-black/75 backdrop-blur-sm'
        >
          Overlay
        </motion.div>
      )}
    </AnimatePresence>
  );
}
