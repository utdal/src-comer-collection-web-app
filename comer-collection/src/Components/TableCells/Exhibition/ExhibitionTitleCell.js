import React from "react";
import { useTableRowItemOld } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ExhibitionTitleCell = () => {
    const exhibition = useTableRowItemOld();
    return (
        exhibition.title
            ? (
                <Typography variant="body1">
                    {exhibition.title}
                </Typography>
            )
            : (
                <Typography
                    sx={{ opacity: 0.5 }}
                    variant="body1"
                >
                    Not set
                </Typography>
            )
    );
};
