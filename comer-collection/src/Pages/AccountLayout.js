import React from "react";
import { Outlet } from "react-router-dom"; // Import Route from react-router-dom
import { AccountNavPane } from "../Components/AccountNavPane/AccountNavPane.js";
import { Box } from "@mui/material";
import { FullPageMessage } from "../Components/FullPageMessage.js";
import { useAppUser } from "../ContextProviders/AppUser.js";
import { AccessTimeIcon, LockIcon } from "../Imports/Icons.js";
import { AccountNavProvider } from "../ContextProviders/AccountNavProvider.js";

const AccountLayout = () => {
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

                    <Outlet />

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

export default AccountLayout;
