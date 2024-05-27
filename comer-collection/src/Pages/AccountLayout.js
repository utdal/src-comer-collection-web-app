import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Import Route from react-router-dom
import { AccountNavPane } from "../Components/AccountNavPane/AccountNavPane.js";
import { Box } from "@mui/material";
import { useAppUser } from "../Hooks/useAppUser.js";

const AccountLayout = () => {
    const appUser = useAppUser();

    return (appUser &&

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
    ) || (appUser === false &&
        <Navigate to="/SignIn" />
    );
};

export default AccountLayout;
