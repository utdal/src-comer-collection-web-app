import React from "react";
import { Box, Paper } from "@mui/material";

const ManagementPageContainer = ({ children }: {
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <Box
            component={Paper}
            square
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "80px calc(100vh - 224px) 80px",
                gridTemplateAreas: `
                    "top"
                    "table"
                    "bottom"
                `,
                overflowX: "hidden"
            }}
        >
            {children}
        </Box>
    );
};

export default ManagementPageContainer;
