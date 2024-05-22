import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ImageYearCell = () => {
    const image = useTableRowItem();
    return (
        <Typography variant="body1">
            {image.year}
        </Typography>
    );
};
