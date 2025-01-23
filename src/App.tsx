import { API_KEY } from "./configs/contants";
import Copilot from "./Copilot";
// import { Copilot } from "react-copilot-embed-sandbox";
// import "react-copilot-embed-sandbox/dist/react-copilot-embed-sandbox.css";

function App() {
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden">
      <div className="flex w-full flex-1 justify-between overflow-hidden">
        <div className="flex h-full w-96 flex-shrink-0 flex-col overflow-y-scroll border-r">
          <Copilot apiKey={API_KEY} copilot={"apex"} isFloating={true} />
        </div>
      </div>
    </main>
  );
}

export default App;
