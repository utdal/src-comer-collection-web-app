import React from "react";
import { Stack, styled } from "@mui/material";

const HeaderStack = styled(Stack, {
    skipSx: true
})(({ theme }) => ({
    alignItems: "center",
    gridArea: "top",
    justifyContent: "space-between",
    padding: theme.spacing(2)
}));

const ManagementPageHeader = ({ children }: {
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <HeaderStack
            direction="row"
            spacing={2}
        >
            {children}
        </HeaderStack>
    );
};

export default ManagementPageHeader;
