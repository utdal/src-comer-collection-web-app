import React from "react";
import { Stack } from "@mui/material";

const ManagementPageFooter = ({ children }: {
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            padding={2}
            spacing={2}
            sx={{ gridArea: "bottom" }}
        >
            {children}
        </Stack>
    );
};

export default ManagementPageFooter;
