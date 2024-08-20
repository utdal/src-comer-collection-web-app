import React from "react";
import { Box, styled } from "@mui/material";

const PositionedBox = styled(Box)(() => ({
    gridArea: "table",
    overflowX: "auto"
}));

const ManagementPageBody = ({ children }: {
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <PositionedBox>
            {children}
        </PositionedBox>
    );
};

export default ManagementPageBody;
