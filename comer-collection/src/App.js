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
import { FullPageMessage } from "./Components/FullPageMessage.js";
import { InfoIcon } from "./Imports/Icons.js";

const appUserLoader = async () => {
    if (!localStorage.getItem("token")) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/account/profile");
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Network request failed");
    }
};

const exhibitionPageLoader = async ({ params }) => {
    const exhibitionId = parseInt(params.exhibitionId);
    const exhibitionUrl = `/api/exhibitions/${exhibitionId}/data`;
    const response = await sendAuthenticatedRequest("GET", exhibitionUrl);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Exhibition unavailable");
    }
};

const myExhibitionsAction = async ({ request }) => {
    const requestData = await request.json();
    if (request.method === "POST") {
        try {
            await Exhibition.handleMultiCreate([requestData]);
            return {
                status: "success",
                message: "Exhibition created"
            };
        } catch (e) {
            return {
                status: "error",
                error: e.message
            };
        }
    } else if (request.method === "PUT") {
        const { id, ...requestBody } = requestData;
        try {
            const result = await Exhibition.handleEdit(id, requestBody);
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
    } else {
        throw new Response(null, { status: 405 });
    }
};

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        path: "/",
        id: "root",
        loader: appUserLoader,
        errorElement: (
            <RouterErrorMessage
                includeLogo
                suggestReload
                viewportHeight
            />
        ),
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
                element: <CollectionBrowser />,
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
                path: "Exhibitions/:exhibitionId",
                loader: exhibitionPageLoader,
                errorElement: (
                    <FullPageMessage
                        Icon={InfoIcon}
                        buttonDestination="/Exhibitions"
                        buttonText="View Public Exhibitions"
                        message="This exhibition is not available"
                    />
                )
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
                        path: "MyExhibitions",
                        action: myExhibitionsAction
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
                                path: "Users",
                                loader: User.loader,
                                action: User.routerAction,
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
                                action: Course.routerAction,
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
