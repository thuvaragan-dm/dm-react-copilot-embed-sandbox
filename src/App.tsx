import { motion } from "framer-motion";
import { useRef } from "react";
import { API_KEY } from "./configs/contants";
import Copilot from "./Copilot";
// import { Copilot } from "react-copilot-embed-sandbox";
// import "react-copilot-embed-sandbox/dist/react-copilot-embed-sandbox.css";

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
        className="h-[70dvh] p-2 bg-gray-100 w-full rounded-3xl border ring ring-gray-800/10 max-w-md mx-auto"
      >
        <Copilot apiKey={API_KEY} copilot={"apexxx"} />
      </motion.div>
    </motion.main>
  );
}

export default App;
