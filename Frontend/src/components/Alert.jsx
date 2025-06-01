import { motion, AnimatePresence } from "framer-motion";

export default function AlertDialog({ show, message, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 60, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-white/20 backdrop-blur-xl border border-white/30 w-[90%] max-w-sm rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <p className="text-white text-lg text-center font-medium mb-6 px-2">
              {message}
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-2.5 text-white font-semibold rounded-xl bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-600 hover:brightness-110 transition shadow-md"
            >
              OK
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
