import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar.js";
import React from "react";
import { Box } from "@mui/material";

const AppLayout = () => {
    return (
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
    );
};

export default AppLayout;
