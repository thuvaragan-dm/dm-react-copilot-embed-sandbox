import { motion } from "framer-motion";
import { useRef } from "react";
import Copilot from "./Copilot";
import { API_KEY } from "./configs/contants";

function App() {
  const constraintsRef = useRef(null);
  return (
    <motion.main
      ref={constraintsRef}
      className="w-full h-dvh flex flex-col items-center justify-center"
    >
      <motion.div
        dragConstraints={constraintsRef}
        dragTransition={{ power: 0.1, timeConstant: 100 }}
        drag
        className="h-96 overflow-hidden w-full max-w-sm mx-auto"
      >
        <Copilot apiKey={API_KEY} />
      </motion.div>
    </motion.main>
  );
}

export default App;
