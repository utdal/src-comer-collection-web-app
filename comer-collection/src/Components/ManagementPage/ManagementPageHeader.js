import React, { memo } from "react";
import PropTypes from "prop-types";
import { Stack, styled } from "@mui/material";

const HeaderStack = styled(Stack, {
    skipSx: true
})(({ theme }) => ({
    alignItems: "center",
    gridArea: "top",
    justifyContent: "space-between",
    padding: theme.spacing(2)
}));

export const ManagementPageHeader = memo(function ManagementPageHeader ({ children }) {
    return (
        <HeaderStack
            direction="row"
            spacing={2}
        >
            {children}
        </HeaderStack>
    );
});

ManagementPageHeader.propTypes = {
    children: PropTypes.node.isRequired
};
