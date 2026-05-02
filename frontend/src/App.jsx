import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import AdminProfile from "./components/AdminProfile";
import AuthorProfile from "./components/AuthorProfile";
import AuthorArticle from "./components/AuthorArticle";
import EditArticle from './components/EditArticle'
import WriteArticle from "./components/WriteArticle";
import ArticleById from "./components/ArticleById";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "admin-profile",
          element: <AdminProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,

          children: [
            {
              index: true,
              element: <AuthorArticle />,
            },
            {
              path: "articles",
              element: <AuthorArticle />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "author-profile/articles",
          element: <AuthorArticle />,
        },
        {
          path: "author-profile/write-article",
          element: <WriteArticle />,
        },
        {
          path: "article/:id",
          element: <ArticleById />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routerObj} />;
}

export default App;