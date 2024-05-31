import React from "react";
import { Navigate } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../Layouts/AppLayout.js";
import { Artist } from "../Classes/Entities/Artist";
import { Course } from "../Classes/Entities/Course";
import { Exhibition, PublicExhibition } from "../Classes/Entities/Exhibition";
import { Image, DeletedImage } from "../Classes/Entities/Image";
import { Tag } from "../Classes/Entities/Tag";
import { User } from "../Classes/Entities/User";
import RequireAdmin from "../Components/AccessControl/RequireAdmin";
import RequirePermanentPassword from "../Components/AccessControl/RequirePermanentPassword";
import { EntityManageDialog } from "../Components/Dialogs/EntityManageDialog/EntityManageDialog.js";
import { FullPageMessage } from "../Components/FullPageMessage";
import RouterErrorMessage from "../Components/RouterErrorMessage";
import { InfoIcon } from "../Imports/Icons.js";
import ChangePassword from "../Pages/Account/ChangePassword.js";
import MyExhibitions from "../Pages/Account/MyExhibitions.js";
import Profile from "../Pages/Account/Profile.js";
import AccountLayout from "../Layouts/AccountLayout.js";
import CourseManagement from "../Pages/Admin/CourseManagement.js";
import ExhibitionManagement from "../Pages/Admin/ExhibitionManagement.js";
import ImageManagement from "../Pages/Admin/ImageManagement.js";
import UserManagement from "../Pages/Admin/UserManagement.js";
import { CollectionBrowser } from "../Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "../Pages/Browsers/ExhibitionBrowser.js";
import ExhibitionPage from "../Pages/ExhibitionPage.js";
import SignIn from "../Pages/SignIn.tsx";
import { myExhibitionsAction } from "./actions";
import buildRouterActionByEntity from "./buildRouterActionByEntity";
import buildRouterLoaderByEntity from "./buildRouterLoaderByEntity";
import { appUserLoader, exhibitionPageLoader } from "./loaders";

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
                loader: buildRouterLoaderByEntity(Image),
                ErrorBoundary: RouterErrorMessage
            },
            {
                element: <ExhibitionBrowser />,
                path: "Exhibitions",
                loader: buildRouterLoaderByEntity(PublicExhibition),
                ErrorBoundary: RouterErrorMessage
            },
            {
                element: <ExhibitionPage />,
                path: "Exhibitions/:exhibitionId",
                loader: exhibitionPageLoader,
                errorElement: (
                    <FullPageMessage
                        Icon={InfoIcon as React.FunctionComponent}
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
                                loader: buildRouterLoaderByEntity(User),
                                action: buildRouterActionByEntity(User),
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        allowCollectionManager={false}
                                        component={<CourseManagement />}
                                    />
                                ),
                                path: "Courses",
                                loader: buildRouterLoaderByEntity(Course),
                                action: buildRouterActionByEntity(Course),
                                ErrorBoundary: RouterErrorMessage
                            },
                            {
                                element: (
                                    <RequireAdmin
                                        component={<ExhibitionManagement />}
                                    />
                                ),
                                path: "Exhibitions",
                                loader: buildRouterLoaderByEntity(Exhibition),
                                action: buildRouterActionByEntity(Exhibition),
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
                                loader: buildRouterLoaderByEntity(Image),
                                action: buildRouterActionByEntity(Image),
                                ErrorBoundary: RouterErrorMessage,
                                children: [
                                    {
                                        path: "Artists",
                                        loader: buildRouterLoaderByEntity(Artist),
                                        action: buildRouterActionByEntity(Artist),
                                        element: <EntityManageDialog Entity={Artist} />
                                    },
                                    {
                                        path: "Tags",
                                        loader: buildRouterLoaderByEntity(Tag),
                                        action: buildRouterActionByEntity(Tag),
                                        element: <EntityManageDialog Entity={Tag} />
                                    },
                                    {
                                        path: "Trash",
                                        loader: buildRouterLoaderByEntity(DeletedImage),
                                        action: buildRouterActionByEntity(DeletedImage),
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

export default router;
