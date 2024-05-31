import React from "react";
import PropTypes from "prop-types";
import { Box, styled } from "@mui/material";

const PositionedBox = styled(Box)(() => ({
    gridArea: "table",
    overflowX: "auto"
}));

export const ManagementPageBody = ({ children }) => {
    return (
        <PositionedBox>
            {children}
        </PositionedBox>
    );
};

ManagementPageBody.propTypes = {
    children: PropTypes.node.isRequired
};
