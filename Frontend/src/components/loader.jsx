import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ isLoading="true" }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed left-0 w-full h-screen z-50 bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center overflow-hidden absolute top-[0vh] left-[0vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute w-2/3 h-1/3 bg-blue-300/10 blur-2xl rounded-3xl"
            initial={{ x: "-100%", y: "-100%", rotate: -45 }}
            animate={{ x: "100%", y: "100%" }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative flex items-center justify-center w-40 h-40 z-10">
            {/* Spinner ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="absolute w-full h-full border-[5px] border-t-purple-500 border-b-white border-l-transparent border-r-transparent rounded-full"
            />

            {/* Pulsing DevLink Logo */}
            <motion.div
              initial={{ scale: [0.5,0.5,0.5] }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-3xl md:text-4xl font-bold tracking-wide text-center"
            >
              <span className="text-white">Dev</span>
              <span className="text-purple-500">Link</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
