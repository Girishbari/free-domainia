import "./App.css";
import Landing from "./components/landing";
import { Signup } from "./components/signup";
import { Signin } from "./components/signin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Deploy } from "./components/deploy";
import Layout from "./Layout";
import Deployed from "./components/deployed";
import Profile from "./components/profile";

function App() {
  const AppRouter = createBrowserRouter([
    {
      path: "/landing",
      element: <Landing />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Deploy />,
        },
        {
          path: "recent-projects",
          element: <Deployed />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={AppRouter} />
    </>
  );
}

export default App;
