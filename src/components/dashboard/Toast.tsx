"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-teal-500/20 border border-teal-400/50 rounded-lg px-4 py-3 shadow-lg backdrop-blur-lg flex items-center gap-3 min-w-[300px]">
            <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <p className="text-sm font-medium text-teal-400 flex-1">{message}</p>
            <button
              onClick={onClose}
              className="text-teal-400/70 hover:text-teal-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

