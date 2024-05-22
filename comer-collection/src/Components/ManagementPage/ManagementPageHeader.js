import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";

export const ManagementPageHeader = ({ children }) => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            padding={2}
            spacing={2}
            sx={{ gridArea: "top" }}
        >
            {children}
        </Stack>
    );
};

ManagementPageHeader.propTypes = {
    children: PropTypes.node.isRequired
};
