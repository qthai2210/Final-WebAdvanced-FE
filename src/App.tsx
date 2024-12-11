import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { routes } from "./routes/routes";

import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(routes);

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <RouterProvider router={router} />
        <ToastContainer />
      </div>
    </Provider>
  );
}

export default App;
