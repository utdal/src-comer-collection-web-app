import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ImageAccessionNumberCell = () => {
    const image = useTableCellItem();
    return (
        <Typography variant="body1">
            {image.accessionNumber}
        </Typography>
    );
};
