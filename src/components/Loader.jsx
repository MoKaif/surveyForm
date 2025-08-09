import React from 'react';
import { motion } from 'framer-motion';

function Loader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent absolute top-0 left-0 animate-spin"></div>
        </div>
        <motion.p 
          className="text-slate-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Loader;
