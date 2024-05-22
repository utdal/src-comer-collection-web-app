import { Stack } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export const ManagementButtonStack = ({ children }) => {
    return (
        <Stack
            direction="row"
            spacing={2}
        >
            {children}
        </Stack>
    );
};

ManagementButtonStack.propTypes = {
    children: PropTypes.node.isRequired
};
