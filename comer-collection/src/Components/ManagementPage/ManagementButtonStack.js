import { Stack } from "@mui/material";
import React, { memo } from "react";
import PropTypes from "prop-types";

export const ManagementButtonStack = memo(function ManagementButtonStack ({ children }) {
    console.log("ManagementButtonStack children", children);
    return (
        <Stack
            direction="row"
            spacing={2}
        >
            {children}
        </Stack>
    );
});

ManagementButtonStack.propTypes = {
    children: PropTypes.node.isRequired
};
