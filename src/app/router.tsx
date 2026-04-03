import { createBrowserRouter } from "react-router-dom";

import { EditorPage } from "../pages/editor-page";
import { HomePage } from "../pages/home-page";
import { LibraryPage } from "../pages/library-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "/library",
    element: <LibraryPage />,
  },
]);
