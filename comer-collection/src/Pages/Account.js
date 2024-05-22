import React from "react";
import { Navigate, Route, Routes } from "react-router-dom"; // Import Route from react-router-dom
import { AccountNavPane } from "../Components/AccountNavPane/AccountNavPane.js";
import UserManagement from "./Admin/UserManagement.js";
import ImageManagement from "./Admin/ImageManagement.js";
import Profile from "./Account/Profile.js";
import { Box } from "@mui/material";
import { FullPageMessage } from "../Components/FullPageMessage.js";
import ChangePassword from "./Account/ChangePassword.js";
import CourseManagement from "./Admin/CourseManagement.js";
import MyExhibitions from "./Account/MyExhibitions.js";
import ExhibitionManagement from "./Admin/ExhibitionManagement.js";
import { useAppUser } from "../ContextProviders/AppUser.js";
import { AccessTimeIcon, LockIcon } from "../Imports/Icons.js";
import { AccountNavProvider } from "../ContextProviders/AccountNavProvider.js";

const Account = () => {
    const [appUser, , , appUserIsLoaded] = useAppUser();

    return (!appUserIsLoaded &&
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading"
        />
    ) || (appUserIsLoaded && appUser &&
        <AccountNavProvider>

            <Box sx={{
                display: "grid",
                gridTemplateColumns: "250px auto",
                gridTemplateAreas: `
          "sidebar main"
        `,
                height: "100%"
            }}
            >

                <AccountNavPane sx={{ gridArea: "sidebar" }} />

                <Box sx={{ gridArea: "main", position: "relative", overflowY: "hidden", height: "100%" }}>

                    <Routes>
                        <Route
                            element={
                                <Navigate
                                    replace
                                    to='Profile'
                                />
                            }
                            index
                        />

                        <Route
                            element={<Profile />}
                            path="Profile"
                        />

                        <Route
                            element={<ChangePassword />}
                            path="ChangePassword"
                        />

                        <Route
                            element={<MyExhibitions />}
                            path="MyExhibitions"
                        />

                        <Route
                            element={<ImageManagement />}
                            path="Admin/Images"
                        />

                        <Route
                            element={<UserManagement />}
                            path="Admin/Users"
                        />

                        <Route
                            element={<ExhibitionManagement />}
                            path="Admin/Exhibitions"
                        />

                        <Route
                            element={<CourseManagement />}
                            path="Admin/Courses"
                        />

                        <Route
                            element={<Navigate to="Profile" />}
                            path="*"
                            replace
                        />

                    </Routes>

                </Box>

            </Box>
        </AccountNavProvider>
    ) || (appUserIsLoaded && !appUser &&
        <FullPageMessage
            Icon={LockIcon}
            buttonDestination="/SignIn"
            buttonText="Sign In"
            message="Unauthorized"
        />
    );
};

export default Account;
