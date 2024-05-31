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
import { DeletedImage, Image } from "./Classes/Entities/Image.js";
import RouterErrorMessage from "./Components/RouterErrorMessage.js";
import { Course } from "./Classes/Entities/Course.js";
import { Exhibition, PublicExhibition } from "./Classes/Entities/Exhibition.js";
import AppThemeProvider from "./ContextProviders/AppTheme.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import { FullPageMessage } from "./Components/FullPageMessage.js";
import { InfoIcon } from "./Imports/Icons.js";
import buildRouterAction from "./Classes/buildRouterAction.js";
import buildRouterLoader from "./Classes/buildRouterLoader.js";
import { Artist } from "./Classes/Entities/Artist.js";
import { Tag } from "./Classes/Entities/Tag.js";
import { EntityManageDialog } from "./Components/Dialogs/EntityManageDialog/EntityManageDialog.js";

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
    try {
        const [{ data: exhibitionData }, { data: globalImageCatalog }] = await Promise.all([
            sendAuthenticatedRequest("GET", exhibitionUrl),
            sendAuthenticatedRequest("GET", Image.baseUrl)
        ]);
        return { exhibitionData, globalImageCatalog };
    } catch (e) {
        throw new Error("Exhibition Unavailable");
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
                loader: buildRouterLoader(Image),
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
                                loader: buildRouterLoader(User),
                                action: buildRouterAction(User),
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<CourseManagement />}
                                    />
                                ),
                                path: "Courses",
                                loader: buildRouterLoader(Course),
                                action: buildRouterAction(Course),
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<ExhibitionManagement />}
                                    />
                                ),
                                path: "Exhibitions",
                                loader: buildRouterLoader(Exhibition),
                                action: buildRouterAction(Exhibition),
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
                                loader: buildRouterLoader(Image),
                                action: buildRouterAction(Image),
                                ErrorBoundary: RouterErrorMessage,
                                children: [
                                    {
                                        path: "Artists",
                                        loader: buildRouterLoader(Artist),
                                        action: buildRouterAction(Artist),
                                        element: <EntityManageDialog Entity={Artist} />
                                    },
                                    {
                                        path: "Tags",
                                        loader: buildRouterLoader(Tag),
                                        action: buildRouterAction(Tag),
                                        element: <EntityManageDialog Entity={Tag} />
                                    },
                                    {
                                        path: "Trash",
                                        loader: buildRouterLoader(DeletedImage),
                                        action: buildRouterAction(DeletedImage),
                                        element: <EntityManageDialog Entity={DeletedImage} />
                                    }
                                ]
                            },
                            {
                                path: "*",
                                element: <Navigate to="/Account/Profile" />
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
