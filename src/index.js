import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {  createBrowserRouter,  RouterProvider,  redirect} from "react-router-dom";
import "./index.css";
import Login from "./routes/login";
import ErrorPage from "./routes/error-page";
import Dashboard from "./routes/dashboard"
import globalVal from "./components/globalVar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "dashboard/",
    element: <Dashboard />,
    
    //Deny access if not authenticated
    loader: async ({ params }) => {
      if (!globalVal.isAuthenticated) {
        return redirect('/');
      }
      return null;
    }
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);