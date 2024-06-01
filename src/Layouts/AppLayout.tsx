import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar/NavBar.js";
import React from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";

const AppLayoutContainer = styled(Box)(() => ({
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "64px calc(100vh - 64px)",
    gridTemplateAreas: `
        "header"
        "body"
    `
}));

const AppLayout = (): React.JSX.Element => {
    return (
        <AppLayoutContainer>
            <NavBar sx={{ gridArea: "header" }} />

            <Box sx={{ gridArea: "body" }}>
                <Outlet />
            </Box>
        </AppLayoutContainer>
    );
};

export default AppLayout;
