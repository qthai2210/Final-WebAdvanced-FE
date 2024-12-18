import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { ToastContainer } from "react-toastify";

function App() {
  const element = useRoutes(routes);
  return (
    <>
      {element}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
