import React from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";

export const ManagementPageContainer = ({ children }) => {
    return (
        <Box
            component={Paper}
            square
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "80px calc(100vh - 224px) 80px",
                gridTemplateAreas: `
                    "top"
                    "table"
                    "bottom"
                `
            }}
        >
            {children}
        </Box>
    );
};

ManagementPageContainer.propTypes = {
    children: PropTypes.node.isRequired
};
