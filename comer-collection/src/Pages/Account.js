import React, { createContext, useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom"; // Import Route from react-router-dom
import AdminNav from "../Components/AccountNav.js";
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
import { AccessTimeIcon, LockIcon } from "../Imports/IconImports.js";


const AccountNavContext = createContext();


const Account = () => {

    const [appUser, , , appUserIsLoaded] = useAppUser();

    const [selectedNavItem, setSelectedNavItem] = useState("");

    return !appUserIsLoaded && (
        <FullPageMessage Icon={AccessTimeIcon} message="Loading" />
    ) || appUserIsLoaded && appUser && (
        <AccountNavContext.Provider value={{selectedNavItem, setSelectedNavItem}}>

            <Box sx={{
                display: "grid",
                gridTemplateColumns: "250px auto",
                gridTemplateAreas: `
          "sidebar main"
        `,
                height: "100%"
            }}>


                <AdminNav sx={{gridArea: "sidebar"}} />
        
                <Box sx={{gridArea: "main", position: "relative", overflowY: "hidden", height: "100%"}}>
          
                    <Routes>
                        <Route index element={
                            !appUser.pw_change_required && (<Navigate to='Profile' replace />) ||
              appUser.pw_change_required && (<Navigate to='ChangePassword' replace />)
                        } />
                        <Route path="Profile" element={<Profile />} />
                        <Route path="ChangePassword" element={<ChangePassword />} />
                        <Route path="MyExhibitions" element={<MyExhibitions />} />
                        <Route path="UserManagement" element={<UserManagement />} />
                        <Route path="ExhibitionManagement" element={<ExhibitionManagement />} />
                        <Route path="ImageManagement" element={<ImageManagement />} />
                        <Route path="CourseManagement" element={<CourseManagement />} />
                        <Route path="*" element={<Navigate to="Profile" />} replace />

                    </Routes>

                </Box>
      
            </Box>
        </AccountNavContext.Provider>
    ) || appUserIsLoaded && !appUser && (
        <FullPageMessage Icon={LockIcon} message="Unauthorized" buttonDestination="/SignIn" buttonText="Sign In" />
    );
};

export const useAccountNav = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(AccountNavContext);
    return [selectedNavItem, setSelectedNavItem];
};

export default Account;
