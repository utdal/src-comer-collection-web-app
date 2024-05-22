import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ImageAccessionNumberCell = () => {
    const image = useTableRowItem();
    return (
        <Typography variant="body1">
            {image.accessionNumber}
        </Typography>
    );
};
