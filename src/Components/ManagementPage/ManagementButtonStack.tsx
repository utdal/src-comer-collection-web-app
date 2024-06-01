import React from "react";
import { Stack } from "@mui/material";

const ManagementButtonStack = ({ children }: {
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <Stack
            direction="row"
            spacing={2}
        >
            {children}
        </Stack>
    );
};

export default ManagementButtonStack;
