import LoginPage from "@/pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;
