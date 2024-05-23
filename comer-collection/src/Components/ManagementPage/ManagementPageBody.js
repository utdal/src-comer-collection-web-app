import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

export const ManagementPageBody = ({ children }) => {
    return (
        <Box
            sx={{
                gridArea: "table",
                overflowX: "auto"
            }}
        >
            {children}
        </Box>
    );
};

ManagementPageBody.propTypes = {
    children: PropTypes.node.isRequired
};
