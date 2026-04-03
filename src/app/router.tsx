import { createBrowserRouter } from "react-router-dom";

import { EditorPage } from "../pages/editor-page";
import { HomePage } from "../pages/home-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
]);
