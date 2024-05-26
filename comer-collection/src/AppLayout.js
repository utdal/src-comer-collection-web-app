import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar.js";
import React from "react";
import { Box } from "@mui/material";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import { AppUserProvider } from "./ContextProviders/AppUser.js";

const AppLayout = () => {
    return (
        <AppFeatureProvider>
            <AppUserProvider>
                <Box sx={{
                    height: "100vh",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "64px calc(100vh - 64px)",
                    gridTemplateAreas: `
                        "header"
                        "body"
                    `
                }}
                >
                    <NavBar sx={{ gridArea: "header" }} />

                    <Box sx={{ gridArea: "body" }}>
                        <Outlet />
                    </Box>
                </Box>

            </AppUserProvider>
        </AppFeatureProvider>
    );
};

export default AppLayout;
