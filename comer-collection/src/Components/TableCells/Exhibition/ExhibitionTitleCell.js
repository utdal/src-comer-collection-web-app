import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionTitleCell = () => {
    const exhibition = useTableCellItem();
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
