/* eslint-disable react/no-multi-comp */
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import React from "react";

import { CollectionBrowser } from "./Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "./Pages/Browsers/ExhibitionBrowser.js";

import AppLayout from "./AppLayout.js";
import AccountLayout from "./Pages/AccountLayout.js";
import ExhibitionPage from "./Pages/ExhibitionPage.js";
import RequirePermanentPassword from "./Components/AccessControl/RequirePermanentPassword.js";
import Profile from "./Pages/Account/Profile.js";
import ChangePassword from "./Pages/Account/ChangePassword.js";
import MyExhibitions from "./Pages/Account/MyExhibitions.js";
import RequireAdmin from "./Components/AccessControl/RequireAdmin.js";
import UserManagement from "./Pages/Admin/UserManagement.js";
import CourseManagement from "./Pages/Admin/CourseManagement.js";
import ExhibitionManagement from "./Pages/Admin/ExhibitionManagement.js";
import ImageManagement from "./Pages/Admin/ImageManagement.js";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        path: "/",
        children: [
            {
                element: <Navigate to="SignIn" />,
                index: true
            },
            {
                element: <SignIn />,
                path: "SignIn"
            },
            {
                element: <CollectionBrowser isDialogMode={false} />,
                path: "BrowseCollection"
            },
            {
                element: <ExhibitionBrowser />,
                path: "Exhibitions",
                children: [
                    {
                        element: <ExhibitionPage />,
                        path: ":exhibitionId"
                    }
                ]
            },
            {
                element: <AccountLayout />,
                path: "Account",
                children: [
                    {
                        element: <Navigate to="Profile" />,
                        index: true
                    },
                    {
                        element: (
                            <RequirePermanentPassword
                                component={<Profile />}
                            />
                        ),
                        path: "Profile"
                    },
                    {
                        element: (
                            <RequirePermanentPassword
                                component={<MyExhibitions />}
                            />
                        ),
                        path: "MyExhibitions"
                    },
                    {
                        element: <ChangePassword />,
                        path: "ChangePassword"
                    },
                    {
                        path: "Admin",
                        children: [
                            {
                                element: (
                                    <RequireAdmin
                                        component={<UserManagement />}
                                    />
                                ),
                                path: "Users"
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<CourseManagement />}
                                    />
                                ),
                                path: "Courses"
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<ExhibitionManagement />}
                                    />
                                ),
                                path: "Exhibitions"
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        allowCollectionManager
                                        component={<ImageManagement />}
                                    />
                                ),
                                path: "Images"
                            }
                        ]
                    },
                    {
                        element: <Navigate to="Profile" />,
                        path: "*"
                    }
                ]
            },
            {
                element: <Navigate to="/SignIn" />,
                path: "*"
            }
        ]
    }
]);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
