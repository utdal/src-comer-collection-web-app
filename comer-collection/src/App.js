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
import { sendAuthenticatedRequest } from "./Helpers/APICalls.js";
import { User } from "./Classes/Entities/User.js";
import { Image, PublicImage } from "./Classes/Entities/Image.js";
import RouterErrorMessage from "./Components/RouterErrorMessage.js";
import { Course } from "./Classes/Entities/Course.js";
import { Exhibition, PublicExhibition } from "./Classes/Entities/Exhibition.js";
import AppThemeProvider from "./ContextProviders/AppTheme.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";

const appUserLoader = async () => {
    if (!localStorage.getItem("token")) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/user/profile");
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Network request failed");
    }
};

const userManagementAction = async ({ request, params }) => {
    const requestData = await request.json();
    console.log(request, requestData, params);
    try {
        const result = await User.handleDelete(requestData.id);
        return {
            status: "success",
            message: result
        };
    } catch (e) {
        return {
            status: "error",
            error: e.message
        };
    }
};

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        path: "/",
        id: "root",
        loader: appUserLoader,
        ErrorBoundary: RouterErrorMessage,
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
                path: "BrowseCollection",
                loader: PublicImage.loader,
                ErrorBoundary: RouterErrorMessage
            },
            {
                element: <ExhibitionBrowser />,
                path: "Exhibitions",
                loader: PublicExhibition.loader,
                ErrorBoundary: RouterErrorMessage
            },
            {
                element: <ExhibitionPage />,
                path: "Exhibitions/:exhibitionId"
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
                                element: <UserManagement />,
                                path: "Users",
                                loader: User.loader,
                                action: userManagementAction,
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<CourseManagement />}
                                    />
                                ),
                                path: "Courses",
                                loader: Course.loader,
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<ExhibitionManagement />}
                                    />
                                ),
                                path: "Exhibitions",
                                loader: Exhibition.loader,
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        allowCollectionManager
                                        component={<ImageManagement />}
                                    />
                                ),
                                path: "Images",
                                loader: Image.loader,
                                ErrorBoundary: RouterErrorMessage
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
        <AppThemeProvider>
            <AppFeatureProvider>
                <RouterProvider router={router} />
            </AppFeatureProvider>
        </AppThemeProvider>
    );
};

export default App;
