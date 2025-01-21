import { Toaster } from "sonner";

const AlertProvider = () => {
  return <Toaster position="top-right" className="dm" visibleToasts={5} />;
};

export default AlertProvider;
