import { Stack, Typography } from "@mui/material";
import React from "react";

const ExhibitionOption = ({ description, children, vertical = false }: {
    readonly vertical?: boolean;
    readonly description?: string;
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    return (
        <Stack
            alignItems={vertical ? "" : "center"}
            direction={vertical ? "column" : "row"}
            justifyContent="space-between"
            spacing={1}
        >
            <Typography variant="body1">
                {description}
            </Typography>

            {children}
        </Stack>
    );
};

export default ExhibitionOption;
