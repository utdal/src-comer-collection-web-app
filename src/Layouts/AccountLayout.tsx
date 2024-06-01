import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Import Route from react-router-dom
import AccountNavPane from "../Components/AccountNavPane/AccountNavPane";
import { Box } from "@mui/material";
import useAppUser from "../Hooks/useAppUser";

const AccountLayout = (): React.JSX.Element => {
    const appUser = useAppUser();

    return appUser !== false
        ? (
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "250px auto",
                gridTemplateAreas: `
          "sidebar main"
        `,
                height: "100%"
            }}
            >

                <AccountNavPane />

                <Box sx={{ gridArea: "main", position: "relative", overflowY: "hidden", height: "100%" }}>

                    <Outlet />

                </Box>

            </Box>
        )
        : <Navigate to="/SignIn" />;
};

export default AccountLayout;
