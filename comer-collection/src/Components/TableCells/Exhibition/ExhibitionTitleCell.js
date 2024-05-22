import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ExhibitionTitleCell = () => {
    const exhibition = useTableRowItem();
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
